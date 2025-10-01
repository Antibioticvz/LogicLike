/**
 * Shared TypeScript types for LogicLike Voting Platform
 *
 * Этот пакет содержит все типы, используемые backend и frontend
 * для обеспечения type safety на всех уровнях приложения.
 */

import type { Idea } from "@prisma/client"

// ============================================================================
// Re-export Prisma types
// ============================================================================

export type { Idea, Vote } from "@prisma/client"

// ============================================================================
// Domain Types
// ============================================================================

/**
 * Идея с информацией о голосовании текущего пользователя
 */
export interface IdeaWithVoteStatus extends Idea {
  hasVoted: boolean
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Стандартная обёртка для успешных API ответов
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
}

/**
 * Структура API ошибки
 */
export interface ApiError {
  message: string
  statusCode: number
  error?: string
  type?: string
}

// ============================================================================
// Voting Error Types
// ============================================================================

/**
 * Типы ошибок при голосовании
 */
export enum VotingErrorType {
  DUPLICATE_VOTE = "DUPLICATE_VOTE",
  VOTE_LIMIT_EXCEEDED = "VOTE_LIMIT_EXCEEDED",
  IDEA_NOT_FOUND = "IDEA_NOT_FOUND",
}

/**
 * Расширенная ошибка голосования с типом
 */
export interface VotingError extends ApiError {
  type: VotingErrorType
}

/**
 * Результат успешного голосования
 */
export interface VoteResult {
  success: boolean
  data: IdeaWithVoteStatus
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard для проверки VotingError
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
 * Type guard для проверки ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "statusCode" in error
  )
}

// ============================================================================
// Request/Response Types для API эндпоинтов
// ============================================================================

/**
 * GET /api/ideas - получить все идеи
 */
export type GetIdeasResponse = ApiResponse<IdeaWithVoteStatus[]>

/**
 * GET /api/ideas/:id - получить одну идею
 */
export type GetIdeaByIdResponse = ApiResponse<IdeaWithVoteStatus>

/**
 * POST /api/ideas/:id/vote - проголосовать за идею
 */
export type VoteForIdeaResponse = VoteResult
