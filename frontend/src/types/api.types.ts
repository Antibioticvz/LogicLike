// Re-export generated types for convenience
export type {
  Idea,
  IdeaWithVoteStatus,
  Vote,
  ApiResponse,
  ApiError,
  VotingError,
  VotingErrorType,
} from './generated'

export { isVotingError, isApiError } from './generated'
