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
    logger: false, // Disable logging in tests
  })

  // Register plugins
  await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  })

  await fastify.register(rateLimit, {
    max: 1000, // Higher limit for tests
    timeWindow: 60000,
  })

  // Dependency Injection
  const ideasRepository = new IdeasRepository()
  const votesRepository = new VotesRepository()

  const ideasService = new IdeasService(ideasRepository, votesRepository)
  const votingService = new VotingService(ideasRepository, votesRepository)

  const ideasController = new IdeasController(ideasService)
  const votingController = new VotingController(votingService)

  // Register routes
  await registerRoutes(fastify, ideasController, votingController)

  return fastify
}
