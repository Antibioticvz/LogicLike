import type { IdeaWithVoteStatus } from "@/types/api.types"
import { memo } from "react"

interface VoteButtonProps {
  idea: IdeaWithVoteStatus
  onVote: (ideaId: number) => void
  isVoting: boolean
}

function VoteButtonComponent({ idea, onVote, isVoting }: VoteButtonProps) {
  const handleClick = () => {
    if (!isVoting && !idea.hasVoted) {
      onVote(idea.id)
    }
  }
  const disabled = isVoting || idea.hasVoted

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
        transition-all duration-200 ease-in-out
        ${
          idea.hasVoted
            ? "bg-green-600 text-white cursor-default shadow-sm"
            : isVoting
            ? "bg-gray-300 text-gray-500 cursor-wait"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
        }
      `}
    >
      {isVoting ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Голосую...</span>
        </>
      ) : (
        <>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              idea.hasVoted ? "scale-110" : ""
            }`}
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
          <span>{idea.hasVoted ? "Проголосовано" : "Голосовать"}</span>
        </>
      )}
    </button>
  )
}

export const VoteButton = memo(VoteButtonComponent)
