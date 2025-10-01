import type { FastifyReply, FastifyRequest } from "fastify"
import type { IdeasService } from "@/application/services/ideas.service.js"
import { extractIpAddress } from "@/infrastructure/utils/ip-extractor.js"

export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const ipAddress = extractIpAddress(request)
      const ideas = await this.ideasService.getAllIdeas(ipAddress)

      await reply.code(200).send({
        data: ideas,
      })
    } catch (error) {
      request.log.error(error)
      await reply.code(500).send({
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch ideas",
      })
    }
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const ideaId = parseInt(request.params.id, 10)

      if (isNaN(ideaId)) {
        await reply.code(400).send({
          error: "INVALID_ID",
          message: "Invalid idea ID",
        })
        return
      }

      const ipAddress = extractIpAddress(request)
      const idea = await this.ideasService.getIdeaById(ideaId, ipAddress)

      if (!idea) {
        await reply.code(404).send({
          error: "NOT_FOUND",
          message: "Idea not found",
        })
        return
      }

      await reply.code(200).send({
        data: idea,
      })
    } catch (error) {
      request.log.error(error)
      await reply.code(500).send({
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch idea",
      })
    }
  }
}
