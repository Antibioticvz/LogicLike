#!/usr/bin/env node

/**
 * Скрипт для генерации TypeScript типов из Prisma схемы для frontend
 * 
 * Генерирует:
 * - Domain types (Idea, Vote)
 * - API response types
 * - Вспомогательные типы
 */

import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Путь к выходному файлу (поднимаемся в корень проекта, затем в frontend)
const projectRoot = join(__dirname, '../../')
const outputPath = join(projectRoot, 'frontend/src/types/generated.ts')

// Генерируем типы на основе Prisma схемы
const generatedTypes = `// This file is auto-generated. Do not edit manually.
// Generated at: ${new Date().toISOString()}
// Source: backend/prisma/schema.prisma

/**
 * Base Idea entity from database
 */
export interface Idea {
  id: number
  title: string
  description: string
  votesCount: number
  createdAt: Date | string
}

/**
 * Vote entity from database
 */
export interface Vote {
  id: number
  ideaId: number
  ipAddress: string
  createdAt: Date | string
}

/**
 * Idea with user vote status
 * Extends base Idea with hasVoted flag
 */
export interface IdeaWithVoteStatus extends Idea {
  hasVoted: boolean
}

/**
 * API Response wrapper
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

/**
 * Voting error types
 */
export type VotingErrorType =
  | 'DUPLICATE_VOTE'
  | 'VOTE_LIMIT_EXCEEDED'
  | 'IDEA_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

/**
 * Extended voting error with type
 */
export interface VotingError extends ApiError {
  type: VotingErrorType
}

/**
 * Type guards
 */
export function isVotingError(error: unknown): error is VotingError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'statusCode' in error
  )
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error
  )
}
`

// Создаём директорию если её нет
mkdirSync(dirname(outputPath), { recursive: true })

// Записываем файл
writeFileSync(outputPath, generatedTypes, 'utf-8')

console.log('✅ Types generated successfully!')
console.log(`📁 Output: ${outputPath}`)
