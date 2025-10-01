import type { FastifyInstance } from "fastify"

import type {
  IdeasController,
  VotingController,
} from "@/presentation/controllers/index.js"

export function registerRoutes(
  fastify: FastifyInstance,
  ideasController: IdeasController,
  votingController: VotingController
): void {
  // Ideas routes
  fastify.get("/api/ideas", ideasController.getAll.bind(ideasController))
  fastify.get("/api/ideas/:id", ideasController.getById.bind(ideasController))

  // Voting routes
  fastify.post(
    "/api/ideas/:id/vote",
    votingController.vote.bind(votingController)
  )

  // Health check
  fastify.get("/health", () => ({ status: "ok" }))
}
