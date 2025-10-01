import type { FastifyReply, FastifyRequest } from "fastify"
import type { VotingService } from "@/application/services/voting.service.js"
import { VotingError, VotingErrorType } from "@/domain/entities/index.js"
import { extractIpAddress } from "@/infrastructure/utils/ip-extractor.js"

export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  async vote(
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
      const result = await this.votingService.vote(ideaId, ipAddress)

      await reply.code(201).send(result)
    } catch (error) {
      if (error instanceof VotingError) {
        const statusCode =
          error.type === VotingErrorType.IDEA_NOT_FOUND ? 404 : 409

        await reply.code(statusCode).send({
          error: error.type,
          message: error.message,
        })
        return
      }

      request.log.error(error)
      await reply.code(500).send({
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to process vote",
      })
    }
  }
}
