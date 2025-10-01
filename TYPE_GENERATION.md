# Type Generation Workflow

Этот проект синхронизирует типы между бэкендом и фронтендом через Prisma схему.

## Источник правды

- Prisma схема: `backend/prisma/schema.prisma`
- Дополнительные бизнес-типы: добавлены прямо в генератор `backend/scripts/generate-types.js`

## Генерация

```bash
cd backend
npm run types:generate
```

Команда выполняет скрипт `scripts/generate-types.js`, который:

1. Читает DMMF из `@prisma/client` (нужен предварительный запуск `npm run prisma:generate`).
2. Строит интерфейсы для всех моделей Prisma (только скалярные поля).
3. Дополняет файл блоками бизнес-логики, ошибок и type guard-ов.
4. Записывает результат в два файла:
   - `backend/src/types/generated.ts`
   - `frontend/src/types/generated.ts`

## Использование

- Бэкенд импортирует типы из `backend/src/types/index.ts`, который реэкспортирует `./generated`.
- Фронтенд использует обертку `frontend/src/types/api.types.ts`, реэкспортирующую `./generated`.

## Когда запускать

- После изменения `schema.prisma`
- После изменения бизнес-типов в генераторе
- В рамках `npm install` (postinstall хук в `backend/package.json`)

## Проверка

```bash
cd backend
npm run test:run
```

Тесты гарантируют, что обновленные типы не ломают существующую логику API.
