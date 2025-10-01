# 🗳️ Voting Platform (LogicLike)

Современная платформа для голосования за идеи с защитой от накрутки голосов.

## ✨ Особенности

- ✅ **Полная типизация** - TypeScript на backend и frontend с автогенерацией типов
- ✅ **Clean Architecture** - Разделение на слои: Domain, Application, Infrastructure, Presentation
- ✅ **Защита от накрутки** - Ограничение голосов по IP-адресу
- ✅ **Real-time обновления** - Мгновенное обновление счётчика голосов
- ✅ **Responsive дизайн** - Адаптивный интерфейс для всех устройств
- ✅ **Type-safe API** - Автоматическая синхронизация типов между backend и frontend
- ✅ **Тестирование** - Интеграционные тесты с покрытием основных сценариев

## 🏗️ Архитектура

### Backend (Clean Architecture)

```
src/
├── domain/              # Бизнес-логика
│   ├── entities/        # Сущности
│   └── interfaces/      # Контракты репозиториев
├── application/         # Use Cases
│   └── services/        # Сервисы бизнес-логики
├── infrastructure/      # Технические детали
│   ├── database/        # Prisma клиент
│   └── repositories/    # Реализация репозиториев
└── presentation/        # HTTP слой
    ├── controllers/     # REST контроллеры
    ├── routes/          # Маршруты
    └── validators/      # Zod схемы валидации
```

### Frontend (Feature-based)

```
src/
├── api/                 # API клиент
├── components/
│   ├── features/        # Компоненты фич
│   └── shared/          # Переиспользуемые компоненты
├── hooks/               # Custom React hooks
└── types/               # TypeScript типы
    └── generated.ts     # 🤖 Автогенерация из Prisma
```

## 🚀 Технологический стек

### Backend

- **Node.js 20** + **TypeScript 5**
- **Fastify 5** - быстрый веб-фреймворк
- **Prisma 6** - type-safe ORM
- **PostgreSQL 15** - реляционная БД
- **Zod 3** - валидация схем
- **Vitest 3** - тестирование

### Frontend

- **React 18** - UI библиотека
- **TypeScript 5** - типизация
- **Vite 5** - сборщик и dev сервер
- **Tailwind CSS 3** - utility-first CSS
- **Fetch API** - HTTP запросы

### DevOps

- **Docker** + **Docker Compose**
- **tsx** - TypeScript executor
- **Prisma Migrate** - миграции БД

## 📦 Быстрый старт

### 1. Клонирование

```bash
git clone <your-repo-url>
cd ligiclike
```

### 2. Установка зависимостей

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Настройка окружения

**Backend** - создайте `/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/voting_platform"
PORT=3000
NODE_ENV=development
MAX_VOTES_PER_IP=3
```

**Frontend** - создайте `/frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. База данных

```bash
# Запустить PostgreSQL через Docker
docker-compose up -d

# Применить миграции
cd backend
npx prisma migrate dev

# (Опционально) Загрузить seed данные
npx prisma db seed
```

### 5. Запуск

**Терминал 1 - Backend:**

```bash
cd backend
npm run dev
```

**Терминал 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Откройте http://localhost:5173 🎉

## 🧪 Тестирование

```bash
# Backend интеграционные тесты
cd backend
npm test

# Frontend type checking
cd frontend
npm run type-check

# Production build
npm run build
```

## 📚 Документация

- [Backend README](./backend/README.md) - Подробная документация backend
- [Frontend README](./frontend/README.md) - Подробная документация frontend
- [Type Generation](./TYPE_GENERATION.md) - Автогенерация типов
- [Deployment Guide](./DEPLOYMENT.md) - Инструкции по развертыванию
- [Project Plan](./PROJECT_PLAN.md) - План разработки

## 🔑 Основные API эндпоинты

```
GET    /api/ideas         # Получить все идеи с статусом голосования
GET    /api/ideas/:id     # Получить конкретную идею
POST   /api/ideas/:id/vote # Проголосовать за идею
```

## 🎯 Ключевые фичи реализации

### Автоматическая генерация типов

```bash
# Запускается автоматически при изменении schema.prisma
cd backend
npm run types:generate
```

Генерирует TypeScript типы для frontend из Prisma схемы:

- Domain типы (Idea, Vote)
- API типы (ApiResponse, ApiError, VotingError)
- Type guards для runtime проверки

### Защита от накрутки

- IP-адрес определяется на сервере
- Проверка дубликатов на уровне БД (unique constraint)
- Ограничение голосов per IP (configurable)
- Транзакции для предотвращения race conditions

### Type-safe коммуникация

```typescript
// Backend генерирует типы
interface IdeaWithVoteStatus {
  id: number
  title: string
  description: string
  votesCount: number
  hasVoted: boolean // Автоматически добавляется для текущего IP
  createdAt: Date
}

// Frontend использует те же типы
const ideas: IdeaWithVoteStatus[] = await apiClient.getIdeas()
```

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📝 Лицензия

MIT License - см. [LICENSE](LICENSE) для деталей

## 🙏 Благодарности

- [Fastify](https://fastify.io/) - за отличный веб-фреймворк
- [Prisma](https://prisma.io/) - за type-safe ORM
- [Vite](https://vitejs.dev/) - за молниеносный dev сервер
- [Tailwind CSS](https://tailwindcss.com/) - за утилитарный подход к стилям

---

Сделано с ❤️ и TypeScript
