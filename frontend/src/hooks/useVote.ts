import { apiClient } from "@/api/client"
import type { ApiError } from "@/types/api.types"
import { useState } from "react"

export function useVote() {
  const [votingId, setVotingId] = useState<number | null>(null)
  const [error, setError] = useState<ApiError | null>(null)

  const vote = async (ideaId: number) => {
    try {
      setVotingId(ideaId)
      setError(null)
      const updatedIdea = await apiClient.voteForIdea(ideaId)
      return updatedIdea
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      throw apiError
    } finally {
      setVotingId(null)
    }
  }

  return { vote, voting: votingId !== null, votingId, error }
}
