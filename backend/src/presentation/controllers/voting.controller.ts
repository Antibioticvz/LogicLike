import { Prisma } from "@prisma/client"
import type { FastifyReply, FastifyRequest } from "fastify"

import type { VotingService } from "@/application/services/index.js"
import { VotingError, VotingErrorType } from "@/domain/entities/index.js"
import { extractIpAddress } from "@/infrastructure/utils/index.js"
import { IdeaIdParamsSchema } from "@/presentation/validators/index.js"

export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  async vote(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      // Валидация с Zod
      const validationResult = IdeaIdParamsSchema.safeParse(request.params)

      if (!validationResult.success) {
        await reply.code(400).send({
          error: "INVALID_ID",
          message:
            validationResult.error.issues[0]?.message || "Invalid idea ID",
        })
        return
      }

      const ideaId = validationResult.data.id
      const ipAddress = extractIpAddress(request)
      const result = await this.votingService.vote(ideaId, ipAddress)

      await reply.code(201).send(result)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation (дубликат голоса - не должно произойти из-за проверки)
        // Record not found
        request.log.error({ error, code: error.code }, "Prisma known error")
        await reply.code(500).send({
          error: "DATABASE_ERROR",
          message: "Database operation failed",
        })
        return
      }

      if (error instanceof Prisma.PrismaClientInitializationError) {
        // БД недоступна
        request.log.error(error, "Database connection failed")
        await reply.code(503).send({
          error: "SERVICE_UNAVAILABLE",
          message: "Database connection failed. Please try again later.",
        })
        return
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        // Невалидные данные для Prisma
        request.log.error(error, "Prisma validation error")
        await reply.code(500).send({
          error: "INTERNAL_SERVER_ERROR",
          message: "Invalid data format",
        })
        return
      }

      if (error instanceof VotingError) {
        const statusCode =
          error.type === VotingErrorType.IDEA_NOT_FOUND ? 404 : 409

        await reply.code(statusCode).send({
          error: error.type,
          type: error.type, // Добавляем type для frontend type guard
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
