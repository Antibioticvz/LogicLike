import type { IdeaWithVoteStatus } from "@/types/api.types"

interface VoteButtonProps {
  idea: IdeaWithVoteStatus
  onVote: (ideaId: number) => void
  disabled: boolean
}

export function VoteButton({ idea, onVote, disabled }: VoteButtonProps) {
  const handleClick = () => {
    if (!disabled && !idea.hasVoted) {
      onVote(idea.id)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || idea.hasVoted}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${
          idea.hasVoted
            ? "bg-green-100 text-green-700 cursor-default"
            : disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
        }
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {idea.hasVoted ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        )}
      </svg>
      {idea.hasVoted ? "Voted" : "Vote"}
    </button>
  )
}
