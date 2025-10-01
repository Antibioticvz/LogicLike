// Re-export generated types for convenience
export type {
  ApiError,
  ApiResponse,
  Idea,
  IdeaWithVoteStatus,
  Vote,
  VotingError,
  VotingErrorType,
} from "./generated.ts"

export { isApiError, isVotingError } from "./generated.ts"
