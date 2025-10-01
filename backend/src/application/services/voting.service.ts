import config from "@/config/index.js"
import type { VoteResult } from "@/domain/entities/index.js"
import { VotingError, VotingErrorType } from "@/domain/entities/index.js"
import type {
  IIdeasRepository,
  IVotesRepository,
} from "@/domain/interfaces/index.js"

export class VotingService {
  constructor(
    private readonly ideasRepository: IIdeasRepository,
    private readonly votesRepository: IVotesRepository
  ) {}

  async vote(ideaId: number, ipAddress: string): Promise<VoteResult> {
    // Check if idea exists
    const idea = await this.ideasRepository.findById(ideaId)
    if (!idea) {
      throw new VotingError(
        VotingErrorType.IDEA_NOT_FOUND,
        `Idea with id ${ideaId} not found`
      )
    }

    // Check if already voted for this idea
    const alreadyVoted = await this.votesRepository.existsByIdeaAndIp(
      ideaId,
      ipAddress
    )
    if (alreadyVoted) {
      throw new VotingError(
        VotingErrorType.ALREADY_VOTED,
        "You have already voted for this idea"
      )
    }

    // Check vote limit
    const voteCount = await this.votesRepository.countByIpAddress(ipAddress)
    if (voteCount >= config.voting.maxVotesPerIp) {
      throw new VotingError(
        VotingErrorType.VOTE_LIMIT_EXCEEDED,
        `You have reached the maximum number of votes (${config.voting.maxVotesPerIp})`
      )
    }

    // Create vote and increment counter
    await this.votesRepository.create(ideaId, ipAddress)
    const updatedIdea = await this.ideasRepository.incrementVoteCount(ideaId)

    return {
      success: true,
      idea: {
        id: updatedIdea.id,
        votesCount: updatedIdea.votesCount,
        hasVoted: true,
      },
    }
  }
}
