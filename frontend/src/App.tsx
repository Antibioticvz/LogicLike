import { useCallback, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { IdeaList } from "@/components/features/ideas/IdeaList"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { useIdeas } from "@/hooks/useIdeas"
import { useVote } from "@/hooks/useVote"
import type { ApiError } from "@/types/api.types"
import { isVotingError } from "@/types/api.types"

function App() {
  const { ideas, loading, error, refetch, updateIdeaOptimistically } =
    useIdeas()
  const { vote, votingId } = useVote()
  const [voteError, setVoteError] = useState<ApiError | null>(null)

  const handleVote = useCallback(
    async (ideaId: number) => {
      try {
        setVoteError(null)
        const updatedIdea = await vote(ideaId)

        if (updatedIdea && updatedIdea.id) {
          updateIdeaOptimistically(updatedIdea)

          toast.success("Голос учтён!", {
            icon: "✓",
            duration: 2000,
            position: "bottom-center",
          })
        } else {
          throw new Error("Invalid response from server")
        }
      } catch (error) {
        const apiError = error as ApiError
        setVoteError(apiError)

        if (isVotingError(apiError)) {
          switch (apiError.type) {
            case "DUPLICATE_VOTE":
              toast.error("Вы уже голосовали за эту идею", {
                icon: "⚠️",
                duration: 3000,
                position: "bottom-center",
              })
              break
            case "VOTE_LIMIT_EXCEEDED":
              toast.error("Достигнут лимит голосов (10)", {
                icon: "🚫",
                duration: 3000,
                position: "bottom-center",
              })
              break
            default:
              toast.error(apiError.message, {
                duration: 3000,
                position: "bottom-center",
              })
          }
        } else {
          toast.error("Не удалось проголосовать", {
            duration: 3000,
            position: "bottom-center",
          })
        }

        console.error("Vote failed:", apiError)
      }
    },
    [setVoteError, updateIdeaOptimistically, vote]
  )

  const handleRetry = useCallback(() => {
    setVoteError(null)
    refetch()
  }, [refetch, setVoteError])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <Toaster />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Платформа голосования LogicLike
          </h1>
          <p className="text-gray-600">
            Голосуйте за свои любимые идеи • Каждый IP может голосовать до 10
            раз
          </p>
        </header>

        <main>
          {/* Ошибка загрузки данных */}
          {error && <ErrorMessage error={error} onRetry={refetch} />}

          {/* Ошибка голосования */}
          {voteError && (
            <div className="mb-6">
              <ErrorMessage error={voteError} onRetry={handleRetry} />
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <IdeaList
              ideas={ideas}
              onVote={handleVote}
              votingIdeaId={votingId}
            />
          )}
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
          <p>Built with React + TypeScript + Tailwind CSS</p>
          <p className="mt-2">Backend: Fastify + Prisma + PostgreSQL</p>
        </footer>
      </div>
    </div>
  )
}

export default App
