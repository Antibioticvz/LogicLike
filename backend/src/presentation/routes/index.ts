import type { FastifyInstance } from 'fastify';
import type { IdeasController } from '../controllers/ideas.controller.js';
import type { VotingController } from '../controllers/voting.controller.js';

export async function registerRoutes(
  fastify: FastifyInstance,
  ideasController: IdeasController,
  votingController: VotingController,
): Promise<void> {
  // Ideas routes
  fastify.get('/api/ideas', ideasController.getAll.bind(ideasController));
  fastify.get('/api/ideas/:id', ideasController.getById.bind(ideasController));
  
  // Voting routes
  fastify.post('/api/ideas/:id/vote', votingController.vote.bind(votingController));

  // Health check
  fastify.get('/health', async () => ({ status: 'ok' }));
}
