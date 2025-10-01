# Backend — Voting Platform API

> Fastify + Prisma сервис с IP-защитой голосования.

## 📌 Быстрые ссылки

- 📖 Корневой обзор: [../README.md](../README.md)
- 🗳️ UI документация: [../UI_STATES.md](../UI_STATES.md)
- 🔄 Генерация типов: [../TYPE_GENERATION.md](../TYPE_GENERATION.md)

## 🧭 Обзор

- **Clean Architecture**: Domain → Application → Infrastructure → Presentation.
- **Prisma ORM**: миграции, seed-данные, транзакции.
- **Безопасность**: лимит голосов на IP, уникальные голосования, rate limiting.
- **Типобезопасность**: строгий TypeScript, общие типы с фронтендом.

## 🏗️ Структура каталога

```
src/
├── config/           # Экспорт настроек из .env
├── domain/           # Сущности и интерфейсы
├── application/      # Сервисы бизнес-логики
├── infrastructure/   # Prisma клиент, репозитории, утилиты
└── presentation/     # Fastify контроллеры, маршруты, валидация
prisma/
├── schema.prisma     # Источник правды для моделей
├── migrations/       # История миграций
└── seed.ts           # Генератор демо-данных
```

## ⚙️ Переменные окружения (`.env`)

| Ключ                | Назначение                   | Пример                                                          |
| ------------------- | ---------------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`      | Подключение к PostgreSQL     | `postgresql://postgres:password@localhost:5432/voting_platform` |
| `PORT`              | HTTP порт Fastify            | `3000`                                                          |
| `HOST`              | Адрес прослушивания          | `0.0.0.0`                                                       |
| `NODE_ENV`          | Окружение                    | `development` / `production`                                    |
| `MAX_VOTES_PER_IP`  | Лимит голосов на IP          | `10`                                                            |
| `CORS_ORIGIN`       | Разрешённый origin фронтенда | `http://localhost:5173`                                         |
| `RATE_LIMIT_MAX`    | Запросов за окно             | `100`                                                           |
| `RATE_LIMIT_WINDOW` | Окно rate limit              | `1 minute`                                                      |

## 🚀 Локальный запуск

1. Установить зависимости: `npm install`
2. Настроить `.env` (см. выше)
3. Поднять базу (`docker-compose up -d` в корне или `createdb voting_platform`)
4. Применить миграции: `npx prisma migrate dev`
5. (Опционально) Засидить данные: `npm run prisma:seed`
6. Запустить dev-сервер: `npm run dev`

API будет доступно на `http://localhost:3000`.

## 📜 Скрипты

| Команда                             | Описание                                                                   |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `npm run dev`                       | Fastify + tsx watch                                                        |
| `npm run build`                     | Компиляция TypeScript → `dist/`                                            |
| `npm start`                         | Production запуск (`node --import=tsconfig-paths/register dist/server.js`) |
| `npm test` / `npm run test:run`     | Vitest интеграционные тесты                                                |
| `npm run lint` / `npm run lint:fix` | ESLint (strict)                                                            |
| `npm run prisma:generate`           | Генерация Prisma клиента                                                   |
| `npm run prisma:migrate`            | `prisma migrate dev`                                                       |
| `npm run prisma:seed`               | Seed данных через `tsx prisma/seed.ts`                                     |
| `npm run prisma:studio`             | GUI для БД                                                                 |
| `npm run db:push`                   | Синхронизация схемы без миграций                                           |
| `npm run types:generate`            | Общие типы backend/frontend                                                |

> Postinstall автоматически вызывает `prisma:generate` и `types:generate`.

## 🧪 Тестирование

- **Vitest**: интеграционные сценарии в `tests/integration/voting.test.ts` покрывают лимиты голосов, `X-Forwarded-For` и консистентность данных.
- **Seed для тестов**: `tests/helpers/app.ts` поднимает Fastify-инстанс с заменой репозиториев на реальные Prisma.
- Запуск: `npm test` (watch) или `npm run test:run` (CI режим).

## 🔌 API эндпоинты

| Метод  | Путь                  | Описание                                 |
| ------ | --------------------- | ---------------------------------------- |
| `GET`  | `/api/ideas`          | Список идей + `hasVoted` для текущего IP |
| `GET`  | `/api/ideas/:id`      | Конкретная идея                          |
| `POST` | `/api/ideas/:id/vote` | Голосование, возвращает обновлённую идею |

### Успешный ответ

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Добавить темную тему",
    "votesCount": 42,
    "hasVoted": true
  }
}
```

### Ошибки

- `409 DUPLICATE_VOTE` — повторное голосование за ту же идею.
- `409 VOTE_LIMIT_EXCEEDED` — превышен `MAX_VOTES_PER_IP`.
- `404 IDEA_NOT_FOUND` — идея отсутствует.
- `400` — невалидный `id`.

## 🔐 Безопасность и наблюдаемость

- Rate limiting (`@fastify/rate-limit`).
- Валидация входа через Zod.
- Логирование Pino (Fastify logger) + бизнес-ивенты.
- Graceful shutdown (SIGTERM/SIGINT): закрывает HTTP и `prisma`.

## 🔄 Генерация типов

`npm run types:generate` формирует `src/types/generated.ts` и синхронный файл фронтенда. Скрипт читает DMMF через Prisma, добавляет бизнес-типы (`IdeaWithVoteStatus`, `VotingError`) и type guards.

## ☁️ Production

1. Собрать: `npm run build`
2. Запустить: `NODE_ENV=production npm start`
3. Применить миграции: `npx prisma migrate deploy`
4. Проверить: `curl https://your-api/api/ideas`

Настройки производительности и чек-лист см. в [DEPLOYMENT.md](../DEPLOYMENT.md).

---

Сделано с ❤️ и Fastify.
