import cors from "@fastify/cors"
import rateLimit from "@fastify/rate-limit"
import Fastify from "fastify"

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

const fastify = Fastify({
  logger: {
    level: config.nodeEnv === "production" ? "info" : "debug",
  },
})

// Register plugins
await fastify.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
})

await fastify.register(rateLimit, {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.timeWindow,
})

// Dependency Injection - Initialize repositories
const ideasRepository = new IdeasRepository()
const votesRepository = new VotesRepository()

// Initialize services
const ideasService = new IdeasService(ideasRepository, votesRepository)
const votingService = new VotingService(ideasRepository, votesRepository)

// Initialize controllers
const ideasController = new IdeasController(ideasService)
const votingController = new VotingController(votingService)

// Register routes
registerRoutes(fastify, ideasController, votingController)

// Start server
const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: config.port,
      host: config.host,
    })

    fastify.log.info(
      `🚀 Server is running on http://${config.host}:${config.port}`
    )
    fastify.log.info(`📊 Environment: ${config.nodeEnv}`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

void start()
