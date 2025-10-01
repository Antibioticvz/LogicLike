/**
 * Shared types for API communication
 * Экспортируются для использования в frontend
 */

import type { Idea, Vote } from "@prisma/client"

// ==================== Domain Types ====================

export type { Idea, Vote }

/**
 * Idea with user vote status
 * Добавляет флаг hasVoted к базовой сущности Idea
 */
export interface IdeaWithVoteStatus extends Idea {
  hasVoted: boolean
}

// ==================== API Response Types ====================

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// ==================== Voting Error Types ====================

/**
 * Voting error types enum
 */
export enum VotingErrorType {
  DUPLICATE_VOTE = "DUPLICATE_VOTE",
  VOTE_LIMIT_EXCEEDED = "VOTE_LIMIT_EXCEEDED",
  IDEA_NOT_FOUND = "IDEA_NOT_FOUND",
}

/**
 * Extended voting error with type discriminator
 */
export interface VotingError extends ApiError {
  type: VotingErrorType
}

// ==================== Type Guards ====================

/**
 * Type guard to check if error is a VotingError
 */
export function isVotingError(error: unknown): error is VotingError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error &&
    "statusCode" in error &&
    Object.values(VotingErrorType).includes((error as VotingError).type)
  )
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "statusCode" in error
  )
}

// ==================== Request/Response Shapes ====================

/**
 * Vote success response
 */
export interface VoteResponse extends ApiResponse<IdeaWithVoteStatus> {}

/**
 * Ideas list response
 */
export interface IdeasListResponse extends ApiResponse<IdeaWithVoteStatus[]> {}

/**
 * Single idea response
 */
export interface IdeaResponse extends ApiResponse<IdeaWithVoteStatus> {}
