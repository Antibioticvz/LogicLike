import type { IdeaWithVoteStatus } from '@/types/api.types'
import { VoteButton } from './VoteButton'

interface IdeaCardProps {
  idea: IdeaWithVoteStatus
  onVote: (ideaId: number) => void
  voting: boolean
}

export function IdeaCard({ idea, onVote, voting }: IdeaCardProps) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {idea.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{idea.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="font-semibold">{idea.votesCount}</span>
            <span>votes</span>
          </div>
          <span className="text-gray-400">•</span>
          <span>{formatDate(idea.createdAt)}</span>
        </div>

        <VoteButton idea={idea} onVote={onVote} disabled={voting} />
      </div>
    </div>
  )
}
