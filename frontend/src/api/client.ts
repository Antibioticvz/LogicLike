import type { ApiError, IdeaWithVoteStatus } from "@/types/api.types"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP error! status: ${response.status}`,
          statusCode: response.status,
        }

        try {
          const errorData = await response.json()
          error.message = errorData.message || error.message
        } catch {
          // If JSON parsing fails, use the default message
        }

        throw error
      }

      return await response.json()
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error
      }

      throw {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      } as ApiError
    }
  }

  // Get all ideas with vote status
  async getIdeas(): Promise<IdeaWithVoteStatus[]> {
    return this.request<IdeaWithVoteStatus[]>("/api/ideas")
  }

  // Get a single idea by ID
  async getIdeaById(id: number): Promise<IdeaWithVoteStatus> {
    return this.request<IdeaWithVoteStatus>(`/api/ideas/${id}`)
  }

  // Vote for an idea
  async voteForIdea(ideaId: number): Promise<IdeaWithVoteStatus> {
    return this.request<IdeaWithVoteStatus>(`/api/ideas/${ideaId}/vote`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient()
