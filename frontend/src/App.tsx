import { useIdeas } from './hooks/useIdeas'
import { useVote } from './hooks/useVote'
import { LoadingSpinner } from './components/shared/LoadingSpinner'
import { ErrorMessage } from './components/shared/ErrorMessage'
import { IdeaList } from './components/features/ideas/IdeaList'

function App() {
  const { ideas, loading, error, refetch } = useIdeas()
  const { vote, voting } = useVote()

  const handleVote = async (ideaId: number) => {
    try {
      await vote(ideaId)
      // Refresh ideas list to update vote counts and hasVoted status
      await refetch()
    } catch (error) {
      // Error is already handled in useVote hook
      console.error('Vote failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LogicLike Voting Platform
          </h1>
          <p className="text-gray-600">
            Vote for your favorite ideas • Each IP can vote up to 10 times
          </p>
        </header>

        <main>
          {error && <ErrorMessage error={error} onRetry={refetch} />}
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <IdeaList ideas={ideas} onVote={handleVote} voting={voting} />
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
