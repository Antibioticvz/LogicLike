import type { IdeaWithVoteStatus } from "../../domain/entities/index.js"
import type {
  IIdeasRepository,
  IVotesRepository,
} from "../../domain/interfaces/repositories.js"

export class IdeasService {
  constructor(
    private readonly ideasRepository: IIdeasRepository,
    private readonly votesRepository: IVotesRepository
  ) {}

  async getAllIdeas(ipAddress: string): Promise<IdeaWithVoteStatus[]> {
    const ideas = await this.ideasRepository.findAll()

    // Get all votes for this IP to mark which ideas were voted
    const userVotes = await this.votesRepository.findByIpAddress(ipAddress)
    const votedIdeaIds = new Set(userVotes.map(vote => vote.ideaId))

    return ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      votesCount: idea.votesCount,
      createdAt: idea.createdAt,
      hasVoted: votedIdeaIds.has(idea.id),
    }))
  }

  async getIdeaById(
    id: number,
    ipAddress: string
  ): Promise<IdeaWithVoteStatus | null> {
    const idea = await this.ideasRepository.findById(id)

    if (!idea) {
      return null
    }

    const hasVoted = await this.votesRepository.existsByIdeaAndIp(id, ipAddress)

    return {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      votesCount: idea.votesCount,
      createdAt: idea.createdAt,
      hasVoted,
    }
  }
}
