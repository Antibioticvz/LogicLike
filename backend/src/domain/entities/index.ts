export type { Idea, Vote } from "@prisma/client"

export interface IdeaWithVoteStatus {
  id: number
  title: string
  description: string
  votesCount: number
  createdAt: Date
  hasVoted: boolean
}

export interface VoteResult {
  success: boolean
  data: IdeaWithVoteStatus
}

export enum VotingErrorType {
  VOTE_LIMIT_EXCEEDED = "VOTE_LIMIT_EXCEEDED",
  DUPLICATE_VOTE = "DUPLICATE_VOTE",
  IDEA_NOT_FOUND = "IDEA_NOT_FOUND",
}

export class VotingError extends Error {
  constructor(public type: VotingErrorType, message: string) {
    super(message)
    this.name = "VotingError"
  }
}
