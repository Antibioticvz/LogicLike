# Frontend — Voting Platform

> React 18 + Vite + Tailwind интерфейс с оптимистичными обновлениями.

- 📖 Корневой обзор: [../README.md](../README.md)
- 🧠 UI состояния: [../UI_STATES.md](../UI_STATES.md)

## 🚀 Быстрый старт

### Требования

- Node.js **20.11+** и npm **10+**
- Запущенный backend `http://localhost:3000`

### Установка и запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Приложение доступно на `http://localhost:5173` (Vite HMR).

## 📁 Структура

```
src/
├── api/                # Клиент с типобезопасными методами
├── components/
│   ├── features/ideas  # IdeaCard, IdeaList, VoteButton
│   └── shared          # ErrorMessage, LoadingSpinner, EmptyState
├── hooks/              # useIdeas, useVote
├── types/              # generated.ts (авто) + api.types.ts
├── App.tsx             # Корневой UI составной компонент
└── main.tsx            # Точка входа React
```

## 🎨 Ключевые особенности

- ✅ **Optimistic UI**: мгновенное обновление карточки без мерцания.
- ✅ **Type-safe API**: импорт `IdeaWithVoteStatus`, `VotingError` из автогенерённых типов.
- ✅ **Responsive**: mobile-first сетка, Tailwind utility классы.
- ✅ **UX сценарии**: обработаны loading/empty/error/voted состояния.
- ✅ **Готовность к toast**: `react-hot-toast` уже в зависимостях.

## 🛠️ Скрипты

| Команда              | Назначение                               |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Vite dev server с HMR                    |
| `npm run type-check` | Строгая проверка типов (`tsc --noEmit`)  |
| `npm run build`      | Production сборка (`tsc` + `vite build`) |
| `npm run preview`    | Локальный предпросмотр _dist_            |
| `npm run lint`       | ESLint (React hooks + refresh правила)   |

## 🔗 Интеграция с backend

- Базовый URL: `import.meta.env.VITE_API_URL` (см. `.env`).
- Типы синхронизируются скриптом `npm run types:generate` в `/backend`.
- Ошибки проверяются через `isVotingError` и `isApiError`.

```typescript
import { isVotingError } from "@/types/api.types"

const handleVoteError = (error: unknown) => {
  if (isVotingError(error)) {
    // DUPLICATE_VOTE, VOTE_LIMIT_EXCEEDED
  }
}
```

## 🎯 Паттерны

- **Container/Presentational**: `IdeaList` (логика) ↔ `IdeaCard`/`VoteButton` (UI).
- **Custom Hooks**: `useIdeas` (fetch + optimistic cache), `useVote` (мутации, ошибки).
- **Композиция**: переиспользуемые shared-компоненты и состояния.

## 🎨 Стили

- Tailwind CSS с кастомными токенами цвета.
- Transition для кнопок и карточек (`transition-all duration-200`).
- Локализация даты: `toLocaleDateString('ru-RU', { month: 'short', ... })`.

## ⚙️ Конфигурация

`.env`:

```env
VITE_API_URL=http://localhost:3000
```

`vite.config.ts` настраивает алиас `@/*`, strict bundling и preview proxy.

## 🧪 Проверка качества

- `npm run type-check` — гарантирует отсутствие ошибок типов.
- `npm run lint` — стиль и best practices (React Hooks).

## 🐛 Траблшутинг

| Проблема         | Решение                                                              |
| ---------------- | -------------------------------------------------------------------- |
| Нет типов        | `cd ../backend && npm run prisma:generate && npm run types:generate` |
| 0 идей в списке  | `cd ../backend && npm run prisma:seed`                               |
| 409 ошибки часто | Проверить лимит `MAX_VOTES_PER_IP` и повторные клики                 |
| Нет связи с API  | Убедитесь, что backend запущен и `VITE_API_URL` корректен            |

## 📦 Сборка и деплой

```bash
npm run build   # сборка → dist/
npm run preview # smoke-test production билд
```

Деплойте содержимое `dist/` на Vercel, Netlify или другой статический хостинг. Перед сборкой обновите `VITE_API_URL` на production домен.

---

Сделано с ❤️ и React.
