# Type Generation

Этот проект использует автоматическую генерацию TypeScript типов из Prisma схемы бэкенда для фронтенда.

## Как это работает

1. **Источник**: Prisma схема в `backend/prisma/schema.prisma`
2. **Генератор**: Скрипт `backend/scripts/generate-types.js`
3. **Результат**: Файл `frontend/src/types/generated.ts`

## Генерация типов

### Автоматическая генерация

Типы автоматически генерируются при:

- `npm install` в backend (postinstall hook)
- Изменении Prisma схемы

### Ручная генерация

```bash
cd backend
npm run types:generate
```

## Использование типов

### В API клиенте

```typescript
import type { IdeaWithVoteStatus, ApiError } from "@/types/api.types"

const ideas: IdeaWithVoteStatus[] = await apiClient.getIdeas()
```

### В компонентах

```typescript
import type { IdeaWithVoteStatus } from "@/types/api.types"

interface Props {
  idea: IdeaWithVoteStatus
}
```

### Type Guards

```typescript
import { isVotingError, isApiError } from "@/types/api.types"

try {
  await voteForIdea(id)
} catch (error) {
  if (isVotingError(error)) {
    // Handle specific voting error
    console.log(error.type) // 'DUPLICATE_VOTE' | 'VOTE_LIMIT_EXCEEDED' | ...
  } else if (isApiError(error)) {
    // Handle generic API error
    console.log(error.statusCode)
  }
}
```

## Сгенерированные типы

### Domain Types

- `Idea` - базовая сущность идеи из БД
- `Vote` - сущность голоса из БД
- `IdeaWithVoteStatus` - идея с флагом hasVoted

### API Types

- `ApiResponse<T>` - обёртка для успешных ответов
- `ApiError` - структура ошибки API
- `VotingError` - расширенная ошибка с типом
- `VotingErrorType` - union type для типов ошибок голосования

### Type Guards

- `isVotingError(error)` - проверка на VotingError
- `isApiError(error)` - проверка на ApiError

## Workflow

1. Изменяешь Prisma схему в backend
2. Запускаешь `npm run prisma:migrate` (автоматически запускает генерацию типов)
3. Типы во frontend обновляются автоматически
4. TypeScript подскажет если что-то сломалось

## Преимущества

✅ **Type Safety** - полная типизация между backend и frontend
✅ **DRY** - единственный источник истины (Prisma схема)
✅ **Auto-sync** - типы всегда синхронизированы с БД
✅ **Developer Experience** - автокомплит и подсказки в IDE
✅ **Refactoring** - TypeScript укажет на все места где нужны изменения
