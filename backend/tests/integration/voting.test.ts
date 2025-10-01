import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { build } from '../helpers/app';
import prisma from '../../src/infrastructure/database/prisma';
import type { FastifyInstance } from 'fastify';

describe('IP-based Voting Restrictions', () => {
  let app: FastifyInstance;
  const TEST_IP_1 = '192.168.1.100';
  const TEST_IP_2 = '192.168.1.200';

  beforeEach(async () => {
    app = await build();
    
    // Clean votes before each test
    await prisma.vote.deleteMany();
    
    // Reset vote counts
    await prisma.idea.updateMany({
      data: { votesCount: 0 },
    });
  });

  afterEach(async () => {
    await app.close();
  });

  /**
   * Scenario 1: Successful vote within limits
   * IP голосует за идею #1
   * Expected: 201 Created, votesCount увеличился
   */
  it('should allow voting when within limits', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/ideas/1/vote',
      headers: {
        'x-forwarded-for': TEST_IP_1,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.idea.id).toBe(1);
    expect(body.idea.votesCount).toBe(1);
    expect(body.idea.hasVoted).toBe(true);

    // Verify in database
    const idea = await prisma.idea.findUnique({ where: { id: 1 } });
    expect(idea?.votesCount).toBe(1);

    const voteCount = await prisma.vote.count({
      where: { ipAddress: TEST_IP_1 },
    });
    expect(voteCount).toBe(1);
  });

  /**
   * Scenario 2: Duplicate vote prevention
   * IP голосует за идею #1 дважды
   * Expected: 409 Conflict, error: "ALREADY_VOTED"
   */
  it('should prevent duplicate votes from the same IP', async () => {
    // First vote
    await app.inject({
      method: 'POST',
      url: '/api/ideas/2/vote',
      headers: {
        'x-forwarded-for': TEST_IP_1,
      },
    });

    // Second vote (should fail)
    const response = await app.inject({
      method: 'POST',
      url: '/api/ideas/2/vote',
      headers: {
        'x-forwarded-for': TEST_IP_1,
      },
    });

    expect(response.statusCode).toBe(409);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('ALREADY_VOTED');

    // Verify only one vote in database
    const voteCount = await prisma.vote.count({
      where: { ideaId: 2, ipAddress: TEST_IP_1 },
    });
    expect(voteCount).toBe(1);
  });

  /**
   * Scenario 3: Vote limit not exceeded
   * IP голосует за 10 разных идей
   * Expected: Все 10 голосов успешны (201)
   */
  it('should allow up to 10 votes from the same IP', async () => {
    interface VoteResult {
      ideaId: number;
      statusCode: number;
      body: {
        success: boolean;
        idea: {
          id: number;
          votesCount: number;
          hasVoted: boolean;
        };
      };
    }
    
    const votes: VoteResult[] = [];
    
    // Vote for ideas 1-10
    for (let ideaId = 1; ideaId <= 10; ideaId++) {
      const response = await app.inject({
        method: 'POST',
        url: `/api/ideas/${ideaId}/vote`,
        headers: {
          'x-forwarded-for': TEST_IP_1,
        },
      });

      votes.push({
        ideaId,
        statusCode: response.statusCode,
        body: JSON.parse(response.body),
      });
    }

    // All votes should succeed
    votes.forEach((vote) => {
      expect(vote.statusCode).toBe(201);
      expect(vote.body.success).toBe(true);
      expect(vote.body.idea.votesCount).toBe(1);
    });

    // Verify total vote count for this IP
    const totalVotes = await prisma.vote.count({
      where: { ipAddress: TEST_IP_1 },
    });
    expect(totalVotes).toBe(10);
  });

  /**
   * Scenario 4: Vote limit exceeded
   * IP голосует за 10 идей, затем пытается проголосовать за 11-ю
   * Expected: 409 Conflict, error: "VOTE_LIMIT_EXCEEDED"
   */
  it('should prevent voting when limit is exceeded', async () => {
    // Vote for ideas 1-10 (reach the limit)
    for (let ideaId = 1; ideaId <= 10; ideaId++) {
      const response = await app.inject({
        method: 'POST',
        url: `/api/ideas/${ideaId}/vote`,
        headers: {
          'x-forwarded-for': TEST_IP_1,
        },
      });
      
      expect(response.statusCode).toBe(201);
    }

    // Try to vote for 11th idea - should fail
    const response = await app.inject({
      method: 'POST',
      url: '/api/ideas/11/vote',
      headers: {
        'x-forwarded-for': TEST_IP_1,
      },
    });

    expect(response.statusCode).toBe(409);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('VOTE_LIMIT_EXCEEDED');
    expect(body.message).toContain('maximum number of votes');
    expect(body.message).toContain('10');

    // Verify vote count is still 10
    const totalVotes = await prisma.vote.count({
      where: { ipAddress: TEST_IP_1 },
    });
    expect(totalVotes).toBe(10);

    // Verify idea 11 wasn't voted
    const idea11 = await prisma.idea.findUnique({ where: { id: 11 } });
    expect(idea11?.votesCount).toBe(0);
  });

  /**
   * Scenario 5: Different IPs are independent
   * IP1 голосует 10 раз, IP2 голосует за ту же идею
   * Expected: IP2 успешно голосует (разные IP не связаны)
   */
  it('should allow different IPs to vote independently', async () => {
    // IP1 votes 10 times (reaches limit)
    for (let ideaId = 1; ideaId <= 10; ideaId++) {
      const response = await app.inject({
        method: 'POST',
        url: `/api/ideas/${ideaId}/vote`,
        headers: {
          'x-forwarded-for': TEST_IP_1,
        },
      });
      expect(response.statusCode).toBe(201);
    }

    // IP2 should still be able to vote for idea 1
    const response = await app.inject({
      method: 'POST',
      url: '/api/ideas/1/vote',
      headers: {
        'x-forwarded-for': TEST_IP_2,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.idea.votesCount).toBe(2); // IP1 + IP2

    // Verify vote counts
    const ip1Votes = await prisma.vote.count({
      where: { ipAddress: TEST_IP_1 },
    });
    const ip2Votes = await prisma.vote.count({
      where: { ipAddress: TEST_IP_2 },
    });

    expect(ip1Votes).toBe(10);
    expect(ip2Votes).toBe(1);
  });

  /**
   * Scenario 6: X-Forwarded-For handling
   * Запрос с заголовком X-Forwarded-For
   * Expected: IP определяется корректно из заголовка
   */
  it('should correctly extract IP from X-Forwarded-For header', async () => {
    const clientIp = '203.0.113.45';
    const proxyIp = '10.0.0.1';

    // Vote with X-Forwarded-For header
    const response1 = await app.inject({
      method: 'POST',
      url: '/api/ideas/1/vote',
      headers: {
        'x-forwarded-for': `${clientIp}, ${proxyIp}`,
      },
    });

    expect(response1.statusCode).toBe(201);

    // Try to vote again with same X-Forwarded-For - should fail (duplicate)
    const response2 = await app.inject({
      method: 'POST',
      url: '/api/ideas/1/vote',
      headers: {
        'x-forwarded-for': `${clientIp}, ${proxyIp}`,
      },
    });

    expect(response2.statusCode).toBe(409);
    const body = JSON.parse(response2.body);
    expect(body.error).toBe('ALREADY_VOTED');

    // Verify vote was recorded with correct IP
    const vote = await prisma.vote.findFirst({
      where: {
        ideaId: 1,
        ipAddress: clientIp,
      },
    });
    expect(vote).not.toBeNull();
    expect(vote?.ipAddress).toBe(clientIp);

    // Vote for another idea with different client IP
    const differentClientIp = '198.51.100.78';
    const response3 = await app.inject({
      method: 'POST',
      url: '/api/ideas/2/vote',
      headers: {
        'x-forwarded-for': `${differentClientIp}, ${proxyIp}`,
      },
    });

    expect(response3.statusCode).toBe(201);
    
    // Verify two different IPs in database
    const uniqueIps = await prisma.vote.findMany({
      distinct: ['ipAddress'],
      select: { ipAddress: true },
    });
    
    const ipAddresses = uniqueIps.map(v => v.ipAddress);
    expect(ipAddresses).toContain(clientIp);
    expect(ipAddresses).toContain(differentClientIp);
  });
});
