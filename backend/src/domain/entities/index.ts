// Re-export types from shared types module
import type { IdeaWithVoteStatus as IdeaWithVoteStatusType } from "@/types/index.js"
import { VotingErrorType as VotingErrorTypeEnum } from "@/types/index.js"

export {
  isApiError,
  isVotingError,
  VotingErrorType,
  type VotingError as IVotingError,
} from "@/types/index.js"
export type {
  ApiError,
  ApiResponse,
  Idea,
  IdeaWithVoteStatus,
  Vote,
} from "@/types/index.js"

export interface VoteResult {
  success: boolean
  data: IdeaWithVoteStatusType
}

export class VotingError extends Error {
  constructor(public type: VotingErrorTypeEnum, message: string) {
    super(message)
    this.name = "VotingError"
  }
}
