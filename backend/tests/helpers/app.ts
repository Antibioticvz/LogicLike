import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import config from '../../src/config/index';
import { IdeasRepository } from '../../src/infrastructure/repositories/ideas.repository';
import { VotesRepository } from '../../src/infrastructure/repositories/votes.repository';
import { IdeasService } from '../../src/application/services/ideas.service';
import { VotingService } from '../../src/application/services/voting.service';
import { IdeasController } from '../../src/presentation/controllers/ideas.controller';
import { VotingController } from '../../src/presentation/controllers/voting.controller';
import { registerRoutes } from '../../src/presentation/routes/index';

export async function build(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: false, // Disable logging in tests
  });

  // Register plugins
  await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  });

  await fastify.register(rateLimit, {
    max: 1000, // Higher limit for tests
    timeWindow: 60000,
  });

  // Dependency Injection
  const ideasRepository = new IdeasRepository();
  const votesRepository = new VotesRepository();

  const ideasService = new IdeasService(ideasRepository, votesRepository);
  const votingService = new VotingService(ideasRepository, votesRepository);

  const ideasController = new IdeasController(ideasService);
  const votingController = new VotingController(votingService);

  // Register routes
  await registerRoutes(fastify, ideasController, votingController);

  return fastify;
}
