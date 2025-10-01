import type { Vote } from '@prisma/client';
import type { IVotesRepository } from '../../domain/interfaces/repositories.js';
import prisma from '../database/prisma.js';

export class VotesRepository implements IVotesRepository {
  async create(ideaId: number, ipAddress: string): Promise<Vote> {
    return prisma.vote.create({
      data: {
        ideaId,
        ipAddress,
      },
    });
  }

  async countByIpAddress(ipAddress: string): Promise<number> {
    return prisma.vote.count({
      where: {
        ipAddress,
      },
    });
  }

  async existsByIdeaAndIp(ideaId: number, ipAddress: string): Promise<boolean> {
    const vote = await prisma.vote.findUnique({
      where: {
        ideaId_ipAddress: {
          ideaId,
          ipAddress,
        },
      },
    });
    return vote !== null;
  }

  async findByIpAddress(ipAddress: string): Promise<Vote[]> {
    return prisma.vote.findMany({
      where: {
        ipAddress,
      },
    });
  }
}
