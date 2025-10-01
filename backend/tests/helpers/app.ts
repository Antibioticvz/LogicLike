import cors from "@fastify/cors"
import rateLimit from "@fastify/rate-limit"
import Fastify, { FastifyInstance } from "fastify"

import { IdeasService, VotingService } from "@/application/services/index.js"
import config from "@/config/index.js"
import {
  IdeasRepository,
  VotesRepository,
} from "@/infrastructure/repositories/index.js"
import {
  IdeasController,
  VotingController,
} from "@/presentation/controllers/index.js"
import { registerRoutes } from "@/presentation/routes/index.js"

export async function build(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: false, // Отключить логирование в тестах
  })

  // Регистрация плагинов
  await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  })

  await fastify.register(rateLimit, {
    max: 1000, // Более высокий лимит для тестов
    timeWindow: 60000,
  })

  // Внедрение зависимостей
  const ideasRepository = new IdeasRepository()
  const votesRepository = new VotesRepository()

  const ideasService = new IdeasService()
  const votingService = new VotingService(ideasRepository, votesRepository)

  const ideasController = new IdeasController(ideasService)
  const votingController = new VotingController(votingService)

  // Регистрация маршрутов
  await registerRoutes(fastify, ideasController, votingController)

  return fastify
}
