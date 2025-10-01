import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import config from './config/index.js';
import { IdeasRepository } from './infrastructure/repositories/ideas.repository.js';
import { VotesRepository } from './infrastructure/repositories/votes.repository.js';
import { IdeasService } from './application/services/ideas.service.js';
import { VotingService } from './application/services/voting.service.js';
import { IdeasController } from './presentation/controllers/ideas.controller.js';
import { VotingController } from './presentation/controllers/voting.controller.js';
import { registerRoutes } from './presentation/routes/index.js';

const fastify = Fastify({
  logger: {
    level: config.nodeEnv === 'production' ? 'info' : 'debug',
  },
});

// Register plugins
await fastify.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
});

await fastify.register(rateLimit, {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.timeWindow,
});

// Dependency Injection - Initialize repositories
const ideasRepository = new IdeasRepository();
const votesRepository = new VotesRepository();

// Initialize services
const ideasService = new IdeasService(ideasRepository, votesRepository);
const votingService = new VotingService(ideasRepository, votesRepository);

// Initialize controllers
const ideasController = new IdeasController(ideasService);
const votingController = new VotingController(votingService);

// Register routes
await registerRoutes(fastify, ideasController, votingController);

// Start server
const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: config.port,
      host: config.host,
    });
    
    fastify.log.info(`🚀 Server is running on http://${config.host}:${config.port}`);
    fastify.log.info(`📊 Environment: ${config.nodeEnv}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
