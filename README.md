# 🗳️ Voting Platform (LogicLike)

Современная платформа для голосования за идеи с защитой от накрутки голосов и единым типобезопасным API.

> Productivity-first, type-safe, production-ready.

## Содержание

1. [Ключевые преимущества](#ключевые-преимущества)
2. [Архитектура и дизайн](#архитектура-и-дизайн)
3. [Данные и типобезопасность](#данные-и-типобезопасность)
4. [UI/UX особенности](#uiux-особенности)
5. [Быстрый старт](#быстрый-старт)
6. [Инструменты качества и скрипты](#инструменты-качества-и-скрипты)
7. [Тестирование и наблюдаемость](#тестирование-и-наблюдаемость)
8. [Деплой и продакшен](#деплой-и-продакшен)
9. [Траблшутинг](#траблшутинг)
10. [Карта документации](#карта-документации)
11. [Дорожная карта](#дорожная-карта)
12. [Лицензия](#лицензия)

## Ключевые преимущества

### Платформа

- **IP-based защита от накрутки**: лимит голосов на IP + уникальность голосов на уровне БД.
- **Реактивность**: оптимистичные обновления на фронтенде, мгновенные счётчики.
- **Типобезопасность сквозь стек**: единые типы домена, ошибок и API генерируются из Prisma.
- **Clean Architecture**: строгие слои Domain → Application → Infrastructure → Presentation.
- **Автоматизация**: postinstall-скрипты генерируют Prisma клиент и синхронизируют типы.

### UX & Performance

- ⚡ Оптимистичные обновления без мерцания UI.
- 📱 Responsive дизайн с mobile-first макетом.
- 🧠 UI state-machine задокументирована и покрывает loading/empty/error/success.
- 🛡️ Rate limiting на Fastify и строгая валидация входных данных (Zod).

### Инженерная культура

- ✅ TypeScript strict mode и «zero `any` policy» на обоих проектах.
- ✅ Интеграционные тесты (Vitest + Supertest) покрывают основной бизнес-флоу.
- ✅ Ручной и автоматический чек-лист продакшена, CI-ready конфигурации.

## Архитектура и дизайн

```
├── backend
│   ├── domain/ → Бизнес-сущности и интерфейсы
│   ├── application/ → Use-cases (сервисы)
│   ├── infrastructure/ → Prisma репозитории, утилиты
│   └── presentation/ → Fastify контроллеры, маршруты, валидация
└── frontend
  ├── api/ → Типизированный клиент на fetch
  ├── hooks/ → Бизнес-логика (useIdeas, useVote)
  ├── components/
  │   ├── features/ideas → карточки, список, кнопка голосования
  │   └── shared → спиннер, ошибки, пустое состояние
  └── types/ → Автогенерированные доменные типы
```

**Backend**

- Fastify 5 с plug-and-play CORS/rate-limit.
- Prisma ORM с миграциями, seed-скриптом, транзакциями для согласованности голосов.
- Graceful shutdown, structured logging, конфигурация через `.env`.

**Frontend**

- React 18 + Vite, Tailwind, React Hot Toast (готово к уведомлениям).
- Feature-based структура, кастомные хуки, композиция компонентов.
- Реиспользуемые UI состояния и анимации.

## Данные и типобезопасность

| Модель | Поля                                                    | Особенности                                             |
| ------ | ------------------------------------------------------- | ------------------------------------------------------- |
| `Idea` | `id`, `title`, `description`, `votesCount`, `createdAt` | Индекс по `votesCount` для сортировки                   |
| `Vote` | `id`, `ideaId`, `ipAddress`, `createdAt`                | Уникальность `(ideaId, ipAddress)` и каскадное удаление |

### Pipeline синхронизации типов

```
schema.prisma → prisma generate → scripts/generate-types.js
    ↓                                   ↓
@prisma/client               backend/src/types/generated.ts
                     ↓
              frontend/src/types/generated.ts
```

`npm run types:generate` обеспечивает единые интерфейсы `IdeaWithVoteStatus`, `ApiResponse`, `VotingError` и type guards (`isVotingError`, `isApiError`).

## UI/UX особенности

- **Loading**: центрированный спиннер `LoadingSpinner`.
- **Empty**: компонент `EmptyState` с подсказкой для seed-данных.
- **Error**: единый `ErrorMessage` с типизацией ошибок сети/HTTP.
- **Voting**: кнопка `VoteButton` с состояниями _idle → voting → voted_ и оптимистичным обновлением списка.
- **UX Upgrades**: плавные transition, локализация дат на `ru-RU`, устранены мерцания и лишние refetch.

## Быстрый старт

### 1. Предварительные требования

- Node.js **20.11+**, npm **10+**
- PostgreSQL **15+** (локально или в Docker)
- Git

### 2. Клонировать и установить зависимости

```bash
git clone <your-repo-url>
cd ligiclike

cd backend && npm install
cd ../frontend && npm install
```

### 3. Настроить переменные окружения

`backend/.env`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/voting_platform"
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
MAX_VOTES_PER_IP=10
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute
```

`frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

### 4. Поднять базу данных

- **Docker**: `docker-compose up -d` (поднимает PostgreSQL `voting_platform`).
- **Локально**: `createdb voting_platform` или через `psql`.

### 5. Применить миграции и seed

```bash
cd backend
npx prisma migrate dev
npx prisma db seed   # опционально, для демо-данных
```

### 6. Синхронизировать типы

```bash
npm run prisma:generate
npm run types:generate
```

Postinstall делается автоматически при `npm install`, но вручную полезно после правок схемы.

### 7. Запустить dev-серверы

- Терминал A: `cd backend && npm run dev`
- Терминал B: `cd frontend && npm run dev`

Приложение доступно на `http://localhost:5173`, API – на `http://localhost:3000`.

## Инструменты качества и скрипты

### Backend (`/backend`)

| Команда                         | Назначение                                         |
| ------------------------------- | -------------------------------------------------- |
| `npm run dev`                   | Fastify через `tsx` с live-reload                  |
| `npm run build`                 | Компиляция TypeScript → `dist/`                    |
| `npm start`                     | Production старт (`node --import tsconfig-paths`)  |
| `npm test` / `npm run test:run` | Интеграционные тесты (Vitest)                      |
| `npm run test:ui`               | Vitest UI runner                                   |
| `npm run lint` / `lint:fix`     | ESLint (strict, no `any`)                          |
| `npm run prisma:generate`       | Генерация Prisma клиента                           |
| `npm run prisma:migrate`        | `prisma migrate dev`                               |
| `npm run prisma:seed`           | Заполнение демо-данными через `tsx prisma/seed.ts` |
| `npm run types:generate`        | Генерация общих типов backend/frontend             |

### Frontend (`/frontend`)

| Команда              | Назначение                    |
| -------------------- | ----------------------------- |
| `npm run dev`        | Vite dev server (HMR)         |
| `npm run type-check` | TS проверка без компиляции    |
| `npm run build`      | `tsc` + production build Vite |
| `npm run preview`    | Локальный предпросмотр сборки |
| `npm run lint`       | ESLint (React hooks, refresh) |

## Тестирование и наблюдаемость

- **Интеграционные тесты**: `backend/tests/integration/voting.test.ts` покрывает 6 сценариев, включая лимит голосов, X-Forwarded-For и консистентность данных.
- **Type checks**: строгие `tsc --noEmit` на обоих проектах.
- **Логирование**: Fastify logger (Pino) + бизнес-события.
- **Health check**: `GET /api/ideas` (используется как smoke test).

## Деплой и продакшен

### Production build

```bash
# Backend
cd backend
npm run build
NODE_ENV=production npm start

# Frontend
cd frontend
echo "VITE_API_URL=https://your-api-domain.com" > .env
npm run build
# Разверните содержимое dist/ на статическом хостинге
```

### Docker & база данных

- `docker-compose.yml` разворачивает PostgreSQL 15 (данные → volume `postgres_data`).
- Для полного контейнерного деплоя добавьте сервисы backend/frontend или используйте PaaS (Railway, Render, Fly.io, Vercel, Netlify).

### Рекомендуемые платформы

- **Backend**: Railway, Render, Fly.io, DigitalOcean App Platform.
- **Frontend**: Vercel, Netlify, Cloudflare Pages.
- **DB**: Supabase, Neon, Railway, DigitalOcean Managed PostgreSQL.

### Production чек-лист

- [ ] Установить `NODE_ENV=production`, `DATABASE_URL` → prod экземпляр.
- [ ] Настроить CORS/certificates, HTTPS, rate limiting.
- [ ] Настроить логи и мониторинг (Sentry, LogRocket, DataDog).
- [ ] Настроить резервное копирование и connection pooling.
- [ ] Проверить Lighthouse, bundle size, CSP заголовки.

## Траблшутинг

| Ситуация                     | Диагностика                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------- |
| Backend не стартует          | `cd backend && npx prisma db pull`, `npx prisma migrate status`, проверить `.env` |
| Ошибка подключения фронтенда | Проверить `VITE_API_URL`, CORS, запущен ли backend                                |
| Типы рассинхронизированы     | `cd backend && npm run prisma:generate && npm run types:generate`                 |
| БД отстала от схемы          | `npx prisma migrate reset` (dev only)                                             |

## Карта документации

- [`backend/README.md`](./backend/README.md) — технические детали API, конфигурации, тестов.
- [`frontend/README.md`](./frontend/README.md) — архитектура UI, хуки, стили.
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — расширенный гид по деплою и CI/CD.
- [`TYPE_GENERATION.md`](./TYPE_GENERATION.md) — подробности генерации типов.
- [`UI_STATES.md`](./UI_STATES.md) — состояния интерфейса и тест-кейсы.
- [`SUMMARY.md`](./SUMMARY.md) — история разработки и метрики.

## Лицензия

MIT — см. [LICENSE](./LICENSE).

---

Сделано с ❤️, Fastify и TypeScript.
