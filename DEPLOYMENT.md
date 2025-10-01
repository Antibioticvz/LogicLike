# 🚀 Deployment Guide

Полное руководство по развертыванию Voting Platform.

## 📋 Предварительные требования

- Node.js 20.11+ и npm 10+
- PostgreSQL 15+
- Git

## 🔧 Локальная разработка

### 1. Клонирование и установка

```bash
# Клонировать репозиторий
git clone <your-repo-url>
cd ligiclike

# Установить зависимости backend
cd backend
npm install

# Установить зависимости frontend
cd ../frontend
npm install
```

### 2. Настройка базы данных

```bash
# Создать базу данных PostgreSQL
createdb voting_platform

# Или через psql:
psql -U postgres
CREATE DATABASE voting_platform;
\q
```

### 3. Настройка переменных окружения

#### Backend: `/backend/.env`

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/voting_platform"

# Server
PORT=3000
NODE_ENV=development

# Application
MAX_VOTES_PER_IP=3
```

#### Frontend: `/frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

### 4. Миграции и seed данных

```bash
cd backend

# Применить миграции
npx prisma migrate dev

# (Опционально) Загрузить тестовые данные
npx prisma db seed
```

### 5. Запуск серверов

Откройте два терминала:

**Терминал 1 - Backend:**
```bash
cd backend
npm run dev
# Сервер запустится на http://localhost:3000
```

**Терминал 2 - Frontend:**
```bash
cd frontend
npm run dev
# Приложение доступно на http://localhost:5173
```

### 6. Проверка работы

- Откройте http://localhost:5173
- Вы должны увидеть список идей
- Попробуйте проголосовать за идею
- Проверьте, что счётчик голосов увеличивается
- Попробуйте проголосовать повторно (должна быть ошибка)

## 🏗️ Production Build

### Backend Production

```bash
cd backend

# Собрать TypeScript
npm run build

# Запустить production сервер
npm start
```

### Frontend Production

```bash
cd frontend

# Обновить .env для production
echo "VITE_API_URL=https://your-api-domain.com" > .env

# Собрать
npm run build

# Результат в директории dist/
# Деплойте содержимое dist/ на ваш хостинг
```

## 🐳 Docker Deployment

### Использование Docker Compose

```bash
# Запустить весь стек
docker-compose up -d

# Проверить логи
docker-compose logs -f

# Остановить
docker-compose down
```

Сервисы:
- Backend: http://localhost:3000
- Frontend: http://localhost:80
- PostgreSQL: localhost:5432

### Применить миграции в Docker

```bash
docker-compose exec backend npx prisma migrate deploy
```

## ☁️ Cloud Deployment

### Backend (Node.js)

Рекомендуемые платформы:
- **Railway** - https://railway.app
- **Render** - https://render.com
- **Fly.io** - https://fly.io
- **DigitalOcean App Platform**

Конфигурация:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment Variables: добавьте все из `.env`

### Frontend (Static)

Рекомендуемые платформы:
- **Vercel** - https://vercel.com (лучший выбор для Vite)
- **Netlify** - https://netlify.com
- **Cloudflare Pages** - https://pages.cloudflare.com

Конфигурация:
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 20
- Environment Variables: `VITE_API_URL=https://your-backend-url`

### База данных

Рекомендуемые хостинги PostgreSQL:
- **Supabase** - https://supabase.com (бесплатный tier)
- **Neon** - https://neon.tech (бесплатный tier)
- **Railway** - https://railway.app
- **DigitalOcean Managed Databases**

## 🔐 Production Checklist

### Backend

- [ ] Изменить DATABASE_URL на production БД
- [ ] Установить NODE_ENV=production
- [ ] Настроить CORS для frontend домена
- [ ] Включить HTTPS
- [ ] Настроить rate limiting
- [ ] Настроить логирование (Winston, Pino)
- [ ] Настроить мониторинг (Sentry, LogRocket)
- [ ] Настроить health check endpoint
- [ ] Резервное копирование БД

### Frontend

- [ ] Обновить VITE_API_URL на production API
- [ ] Проверить bundle size (`npm run build`)
- [ ] Настроить CDN для статических файлов
- [ ] Добавить Google Analytics / Plausible (опционально)
- [ ] Настроить Service Worker для offline (опционально)
- [ ] Проверить Lighthouse score
- [ ] Настроить CSP заголовки

### Database

- [ ] Настроить автоматические бэкапы
- [ ] Настроить connection pooling
- [ ] Оптимизировать индексы
- [ ] Мониторинг performance

## 🔄 CI/CD Pipeline

### GitHub Actions (пример)

**Backend:**
```yaml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd backend && npm ci
      - run: cd backend && npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: |
          # Add your deployment commands
```

**Frontend:**
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## 📊 Мониторинг

### Backend Health Check

```bash
curl http://localhost:3000/api/ideas
```

### Application Monitoring

Рекомендуемые инструменты:
- **Backend**: Sentry, LogRocket, DataDog
- **Frontend**: Sentry, LogRocket, Google Analytics
- **Database**: PgAdmin, DataDog, Grafana

### Логирование

Backend уже использует Fastify logger (Pino):
- Все запросы логируются автоматически
- Ошибки логируются с полным стеком
- Бизнес-события (голосование) логируются

## 🔧 Troubleshooting

### Backend не запускается

```bash
# Проверить подключение к БД
cd backend
npx prisma db pull

# Проверить миграции
npx prisma migrate status

# Пересоздать БД (только dev!)
npx prisma migrate reset
```

### Frontend не подключается к API

1. Проверить VITE_API_URL в `.env`
2. Проверить CORS настройки в backend
3. Проверить что backend запущен
4. Открыть DevTools → Network → проверить запросы

### TypeScript ошибки

```bash
# Регенерировать типы
cd backend
npm run types:generate

# Проверить типы frontend
cd ../frontend
npm run type-check
```

### Database connection issues

```bash
# Проверить что PostgreSQL запущен
psql -U postgres -l

# Проверить DATABASE_URL
cd backend
echo $DATABASE_URL
```

## 📚 Дополнительные ресурсы

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Type Generation Guide](./TYPE_GENERATION.md)
- [Project Plan](./PROJECT_PLAN.md)

## 🆘 Поддержка

Если возникли проблемы:
1. Проверьте логи: `docker-compose logs` или terminal output
2. Проверьте переменные окружения
3. Убедитесь что все зависимости установлены
4. Проверьте версии Node.js и npm

## 🎉 Готово!

После успешного развертывания у вас будет:
- ✅ Backend API с полной типизацией
- ✅ React frontend с автоматической генерацией типов
- ✅ PostgreSQL база данных
- ✅ Готовая система голосования с защитой от дублирования
