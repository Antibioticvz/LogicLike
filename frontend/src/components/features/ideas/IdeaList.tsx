import { EmptyState } from "@/components/shared/EmptyState"
import type { IdeaWithVoteStatus } from "@/types/api.types"
import { IdeaCard } from "./IdeaCard"

interface IdeaListProps {
  ideas: IdeaWithVoteStatus[]
  onVote: (ideaId: number) => void
  voting: boolean
}

export function IdeaList({ ideas, onVote, voting }: IdeaListProps) {
  if (ideas.length === 0) {
    return (
      <EmptyState
        title="Идей пока нет"
        description="Список идей пуст. Возможно, данные еще загружаются или база данных не содержит записей."
        icon={
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        }
        action={
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="font-medium text-gray-700 mb-2">
              💡 Совет для разработчиков:
            </p>
            <p>
              Запустите{" "}
              <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                npm run prisma:seed
              </code>{" "}
              в папке <code className="font-mono">backend</code> для загрузки
              тестовых данных
            </p>
          </div>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ideas.map(idea => (
        <IdeaCard key={idea.id} idea={idea} onVote={onVote} voting={voting} />
      ))}
    </div>
  )
}
