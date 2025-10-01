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
  fastify.get("/api/ideas", ideasController.getAll.bind(ideasController))
  fastify.get("/api/ideas/:id", ideasController.getById.bind(ideasController))

  fastify.post(
    "/api/ideas/:id/vote",
    votingController.vote.bind(votingController)
  )

  fastify.get("/health", () => ({ status: "ok" }))
}
