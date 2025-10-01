import type { IdeaWithVoteStatus } from "@/domain/entities/index.js"
import prisma from "@/infrastructure/database/prisma.js"

export class IdeasService {
  async getAllIdeas(ipAddress: string): Promise<IdeaWithVoteStatus[]> {
    const ideas = await prisma.idea.findMany({
      orderBy: { votesCount: "desc" },
      include: {
        votes: {
          where: { ipAddress },
          select: { id: true },
        },
      },
    })

    // Маппим результат в нужный формат с флагом hasVoted
    return ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      votesCount: idea.votesCount,
      createdAt: idea.createdAt,
      hasVoted: idea.votes.length > 0,
    }))
  }

  async getIdeaById(
    ideaId: number,
    ipAddress: string
  ): Promise<IdeaWithVoteStatus | null> {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        votes: {
          where: { ipAddress },
          select: { id: true },
        },
      },
    })

    if (!idea) {
      return null
    }

    return {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      votesCount: idea.votesCount,
      createdAt: idea.createdAt,
      hasVoted: idea.votes.length > 0,
    }
  }
}
