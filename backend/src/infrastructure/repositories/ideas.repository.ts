import type { Idea } from "@prisma/client"

import type { IIdeasRepository } from "@/domain/interfaces/index.js"
import prisma from "@/infrastructure/database/prisma.js"

export class IdeasRepository implements IIdeasRepository {
  async findAll(): Promise<Idea[]> {
    return prisma.idea.findMany({
      orderBy: {
        votesCount: "desc",
      },
    })
  }

  async findById(id: number): Promise<Idea | null> {
    return prisma.idea.findUnique({
      where: { id },
    })
  }

  async incrementVoteCount(id: number): Promise<Idea> {
    return prisma.idea.update({
      where: { id },
      data: {
        votesCount: {
          increment: 1,
        },
      },
    })
  }
}
