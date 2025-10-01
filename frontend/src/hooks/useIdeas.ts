import { apiClient } from "@/api/client"
import type { ApiError, IdeaWithVoteStatus } from "@/types/api.types"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    fetchIdeas()
  }, [])

  return { ideas, loading, error, refetch: fetchIdeas }
}
