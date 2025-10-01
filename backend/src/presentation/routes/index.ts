import type { IdeasController } from "@/presentation/controllers/ideas.controller.js"
import type { VotingController } from "@/presentation/controllers/voting.controller.js"
import type { FastifyInstance } from "fastify"

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
