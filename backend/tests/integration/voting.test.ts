import type { FastifyInstance } from "fastify"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import prisma from "@/infrastructure/database/prisma.js"

import { build } from "../helpers/app.js"

describe("Ограничения голосования на основе IP", () => {
  let app: FastifyInstance
  const TEST_IP_1 = "192.168.1.100"
  const TEST_IP_2 = "192.168.1.200"

  beforeEach(async () => {
    app = await build()

    // Очистить голоса перед каждым тестом
    await prisma.vote.deleteMany()

    // Сбросить счетчики голосов
    await prisma.idea.updateMany({
      data: { votesCount: 0 },
    })
  })

  afterEach(async () => {
    await app.close()
  })

  /**
   * Сценарий 1: Успешное голосование в пределах лимита
   * IP голосует за идею #1
   * Ожидается: 201 Created, votesCount увеличился
   */
  it("должен разрешать голосование в пределах лимита", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/ideas/1/vote",
      headers: {
        "x-forwarded-for": TEST_IP_1,
      },
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(true)
    expect(body.idea.id).toBe(1)
    expect(body.idea.votesCount).toBe(1)
    expect(body.idea.hasVoted).toBe(true)

    // Проверить в базе данных
    const idea = await prisma.idea.findUnique({ where: { id: 1 } })
    expect(idea?.votesCount).toBe(1)

    const voteCount = await prisma.vote.count({
      where: { ipAddress: TEST_IP_1 },
    })
    expect(voteCount).toBe(1)
  })

  /**
   * Сценарий 2: Предотвращение дублированных голосов
   * IP голосует за идею #1 дважды
   * Ожидается: 409 Conflict, error: "ALREADY_VOTED"
   */
  it("должен предотвращать дублированные голоса с одного IP", async () => {
    // Первый голос
    await app.inject({
      method: "POST",
      url: "/api/ideas/2/vote",
      headers: {
        "x-forwarded-for": TEST_IP_1,
      },
    })

    // Второй голос (должен провалиться)
    const response = await app.inject({
      method: "POST",
      url: "/api/ideas/2/vote",
      headers: {
        "x-forwarded-for": TEST_IP_1,
      },
    })

    expect(response.statusCode).toBe(409)
    const body = JSON.parse(response.body)
    expect(body.error).toBe("ALREADY_VOTED")

    // Проверить, что только один голос в базе данных
    const voteCount = await prisma.vote.count({
      where: { ideaId: 2, ipAddress: TEST_IP_1 },
    })
    expect(voteCount).toBe(1)
  })

  /**
   * Сценарий 3: Лимит голосов не превышен
   * IP голосует за 10 разных идей
   * Ожидается: Все 10 голосов успешны (201)
   */
  it("должен разрешать до 10 голосов с одного IP", async () => {
    interface VoteResult {
      ideaId: number
      statusCode: number
      body: {
        success: boolean
        idea: {
          id: number
          votesCount: number
          hasVoted: boolean
        }
      }
    }

    const votes: VoteResult[] = []

    // Голосовать за идеи 1-10
    for (let ideaId = 1; ideaId <= 10; ideaId++) {
      const response = await app.inject({
        method: "POST",
        url: `/api/ideas/${ideaId}/vote`,
        headers: {
          "x-forwarded-for": TEST_IP_1,
        },
      })

      votes.push({
        ideaId,
        statusCode: response.statusCode,
        body: JSON.parse(response.body),
      })
    }

    // Все голоса должны быть успешными
    votes.forEach(vote => {
      expect(vote.statusCode).toBe(201)
      expect(vote.body.success).toBe(true)
      expect(vote.body.idea.votesCount).toBe(1)
    })

    // Проверить общее количество голосов для этого IP
    const totalVotes = await prisma.vote.count({
      where: { ipAddress: TEST_IP_1 },
    })
    expect(totalVotes).toBe(10)
  })

  /**
   * Сценарий 4: Лимит голосов превышен
   * IP голосует за 10 идей, затем пытается проголосовать за 11-ю
   * Ожидается: 409 Conflict, error: "VOTE_LIMIT_EXCEEDED"
   */
  it("должен предотвращать голосование при превышении лимита", async () => {
    // Голосовать за идеи 1-10 (достичь лимита)
    for (let ideaId = 1; ideaId <= 10; ideaId++) {
      const response = await app.inject({
        method: "POST",
        url: `/api/ideas/${ideaId}/vote`,
        headers: {
          "x-forwarded-for": TEST_IP_1,
        },
      })

      expect(response.statusCode).toBe(201)
    }

    // Попытаться проголосовать за 11-ю идею - должно провалиться
    const response = await app.inject({
      method: "POST",
      url: "/api/ideas/11/vote",
      headers: {
        "x-forwarded-for": TEST_IP_1,
      },
    })

    expect(response.statusCode).toBe(409)
    const body = JSON.parse(response.body)
    expect(body.error).toBe("VOTE_LIMIT_EXCEEDED")
    expect(body.message).toContain("maximum number of votes")
    expect(body.message).toContain("10")

    // Проверить, что количество голосов все еще 10
    const totalVotes = await prisma.vote.count({
      where: { ipAddress: TEST_IP_1 },
    })
    expect(totalVotes).toBe(10)

    // Проверить, что за идею 11 не голосовали
    const idea11 = await prisma.idea.findUnique({ where: { id: 11 } })
    expect(idea11?.votesCount).toBe(0)
  })

  /**
   * Сценарий 5: Разные IP независимы
   * IP1 голосует 10 раз, IP2 голосует за ту же идею
   * Ожидается: IP2 успешно голосует (разные IP не связаны)
   */
  it("должен разрешать разным IP голосовать независимо", async () => {
    // IP1 голосует 10 раз (достигает лимита)
    for (let ideaId = 1; ideaId <= 10; ideaId++) {
      const response = await app.inject({
        method: "POST",
        url: `/api/ideas/${ideaId}/vote`,
        headers: {
          "x-forwarded-for": TEST_IP_1,
        },
      })
      expect(response.statusCode).toBe(201)
    }

    // IP2 все еще должен иметь возможность голосовать за идею 1
    const response = await app.inject({
      method: "POST",
      url: "/api/ideas/1/vote",
      headers: {
        "x-forwarded-for": TEST_IP_2,
      },
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(body.success).toBe(true)
    expect(body.idea.votesCount).toBe(2) // IP1 + IP2

    // Проверить счетчики голосов
    const ip1Votes = await prisma.vote.count({
      where: { ipAddress: TEST_IP_1 },
    })
    const ip2Votes = await prisma.vote.count({
      where: { ipAddress: TEST_IP_2 },
    })

    expect(ip1Votes).toBe(10)
    expect(ip2Votes).toBe(1)
  })

  /**
   * Сценарий 6: Обработка X-Forwarded-For
   * Запрос с заголовком X-Forwarded-For
   * Ожидается: IP определяется корректно из заголовка
   */
  it("должен корректно извлекать IP из заголовка X-Forwarded-For", async () => {
    const clientIp = "203.0.113.45"
    const proxyIp = "10.0.0.1"

    // Голосовать с заголовком X-Forwarded-For
    const response1 = await app.inject({
      method: "POST",
      url: "/api/ideas/1/vote",
      headers: {
        "x-forwarded-for": `${clientIp}, ${proxyIp}`,
      },
    })

    expect(response1.statusCode).toBe(201)

    // Попытаться проголосовать снова с тем же X-Forwarded-For - должно провалиться (дубликат)
    const response2 = await app.inject({
      method: "POST",
      url: "/api/ideas/1/vote",
      headers: {
        "x-forwarded-for": `${clientIp}, ${proxyIp}`,
      },
    })

    expect(response2.statusCode).toBe(409)
    const body = JSON.parse(response2.body)
    expect(body.error).toBe("ALREADY_VOTED")

    // Проверить, что голос был записан с правильным IP
    const vote = await prisma.vote.findFirst({
      where: {
        ideaId: 1,
        ipAddress: clientIp,
      },
    })
    expect(vote).not.toBeNull()
    expect(vote?.ipAddress).toBe(clientIp)

    // Голосовать за другую идею с другим клиентским IP
    const differentClientIp = "198.51.100.78"
    const response3 = await app.inject({
      method: "POST",
      url: "/api/ideas/2/vote",
      headers: {
        "x-forwarded-for": `${differentClientIp}, ${proxyIp}`,
      },
    })

    expect(response3.statusCode).toBe(201)

    // Проверить два разных IP в базе данных
    const uniqueIps = await prisma.vote.findMany({
      distinct: ["ipAddress"],
      select: { ipAddress: true },
    })

    const ipAddresses = uniqueIps.map(v => v.ipAddress)
    expect(ipAddresses).toContain(clientIp)
    expect(ipAddresses).toContain(differentClientIp)
  })
})
