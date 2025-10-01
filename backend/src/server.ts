import Fastify from "fastify"
import cors from "@fastify/cors"
import rateLimit from "@fastify/rate-limit"

import { IdeasService, VotingService } from "@/application/services/index.js"
import config from "@/config/index.js"
import prisma from "@/infrastructure/database/prisma.js"
import {
  IdeasRepository,
  VotesRepository,
} from "@/infrastructure/repositories/index.js"
import {
  IdeasController,
  VotingController,
} from "@/presentation/controllers/index.js"
import { registerRoutes } from "@/presentation/routes/index.js"

const fastify = Fastify({
  logger: {
    level: config.nodeEnv === "production" ? "info" : "debug",
  },
})

// Регистрация плагинов
await fastify.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
})

await fastify.register(rateLimit, {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.timeWindow,
})

// Внедрение зависимостей - Инициализация репозиториев
const ideasRepository = new IdeasRepository()
const votesRepository = new VotesRepository()

// Инициализация сервисов
const ideasService = new IdeasService()
const votingService = new VotingService(
  ideasRepository,
  votesRepository,
  fastify.log
)

// Инициализация контроллеров
const ideasController = new IdeasController(ideasService)
const votingController = new VotingController(votingService)

// Регистрация маршрутов
registerRoutes(fastify, ideasController, votingController)

// Запуск сервера
const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: config.port,
      host: config.host,
    })

    fastify.log.info(
      `🚀 Сервер запущен на http://${config.host}:${config.port}`
    )
    fastify.log.info(`📊 Окружение: ${config.nodeEnv}`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

// Корректное завершение работы: Обработка сигналов SIGTERM и SIGINT для корректного завершения
// Проблема: при завершении процесса активные соединения обрываются, БД может остаться в неконсистентном состоянии
// Решение: перехватываем сигналы, закрываем соединения корректно
const gracefulShutdown = async (signal: string): Promise<void> => {
  fastify.log.info(`${signal} получен, корректное завершение работы...`)

  try {
    // Закрываем HTTP сервер (перестаем принимать новые запросы)
    await fastify.close()
    fastify.log.info("HTTP сервер закрыт")

    // Закрываем соединение с БД
    await prisma.$disconnect()
    fastify.log.info("Соединение с базой данных закрыто")

    fastify.log.info("Корректное завершение работы выполнено")
    process.exit(0)
  } catch (error) {
    fastify.log.error(error, "Ошибка при корректном завершении работы")
    process.exit(1)
  }
}

// Регистрируем обработчики сигналов
process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => void gracefulShutdown("SIGINT"))

void start()
