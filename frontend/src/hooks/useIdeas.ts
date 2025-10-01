import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/api/client"
import type { ApiError, IdeaWithVoteStatus } from "@/types/api.types"

export function useIdeas() {
  const [ideas, setIdeas] = useState<IdeaWithVoteStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchIdeas = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getIdeas()
      setIdeas(data)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }

  // Оптимистичное обновление идеи после голосования
  const updateIdeaOptimistically = useCallback(
    (updatedIdea: IdeaWithVoteStatus) => {
      setIdeas(prevIdeas =>
        prevIdeas.map(idea => (idea.id === updatedIdea.id ? updatedIdea : idea))
      )
    },
    []
  )

  // Тихое обновление без спиннера (для рефетча после голосования)
  const silentRefetch = useCallback(async () => {
    try {
      const data = await apiClient.getIdeas()
      setIdeas(data)
    } catch (err) {
      // Игнорируем ошибки при тихом обновлении
      console.error("Silent refetch failed:", err)
    }
  }, [])

  useEffect(() => {
    fetchIdeas()
  }, [])

  return {
    ideas,
    loading,
    error,
    refetch: fetchIdeas,
    silentRefetch,
    updateIdeaOptimistically,
  }
}
