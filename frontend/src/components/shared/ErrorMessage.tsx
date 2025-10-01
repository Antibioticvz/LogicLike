import type { ApiError, VotingError } from "@/types/api.types"
import { isVotingError } from "@/types/api.types"

interface ErrorMessageProps {
  error: ApiError | VotingError | null
  onRetry?: () => void
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null

  // Определяем тип ошибки и заголовок
  let title = "Что-то пошло не так"
  let additionalInfo = null

  if (error.statusCode === 0) {
    title = "Ошибка сети"
    additionalInfo = (
      <p className="text-sm text-red-500 mb-4">
        Проверьте подключение к интернету и убедитесь, что backend сервер
        запущен
      </p>
    )
  } else if (isVotingError(error)) {
    // Специальные сообщения для ошибок голосования
    switch (error.type) {
      case "DUPLICATE_VOTE":
        title = "Уже проголосовали"
        additionalInfo = (
          <p className="text-sm text-red-500 mb-4">
            Вы уже голосовали за эту идею. Каждый пользователь может
            проголосовать только один раз за одну идею.
          </p>
        )
        break
      case "VOTE_LIMIT_EXCEEDED":
        title = "Достигнут лимит голосов"
        additionalInfo = (
          <p className="text-sm text-red-500 mb-4">
            Вы достигли максимального количества голосов (10). Больше голосовать
            нельзя.
          </p>
        )
        break
      case "IDEA_NOT_FOUND":
        title = "Идея не найдена"
        additionalInfo = (
          <p className="text-sm text-red-500 mb-4">
            Идея, за которую вы пытаетесь проголосовать, не существует.
          </p>
        )
        break
    }
  } else if (error.statusCode === 404) {
    title = "Не найдено"
  } else if (error.statusCode === 500) {
    title = "Ошибка сервера"
    additionalInfo = (
      <p className="text-sm text-red-500 mb-4">
        Произошла ошибка на сервере. Попробуйте позже.
      </p>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
      <div className="text-red-800 mb-4">
        <svg
          className="w-12 h-12 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-semibold">{title}</p>
      </div>
      <p className="text-red-600 mb-4">{error.message}</p>
      {additionalInfo}
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Попробовать снова
        </button>
      )}
    </div>
  )
}
