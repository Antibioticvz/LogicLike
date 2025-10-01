// Re-export generated types for convenience
export type {
  ApiError,
  ApiResponse,
  Idea,
  IdeaWithVoteStatus,
  Vote,
  VotingError,
  VotingErrorType,
} from "./generated"

export { isApiError, isVotingError } from "./generated"
