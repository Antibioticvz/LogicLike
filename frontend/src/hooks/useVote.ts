import { useState } from 'react'
import { apiClient } from '@/api/client'
import type { ApiError } from '@/types/api.types'

export function useVote() {
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const vote = async (ideaId: number) => {
    try {
      setVoting(true)
      setError(null)
      const updatedIdea = await apiClient.voteForIdea(ideaId)
      return updatedIdea
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      throw apiError
    } finally {
      setVoting(false)
    }
  }

  return { vote, voting, error }
}
