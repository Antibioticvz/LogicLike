import type { FastifyReply, FastifyRequest } from "fastify"
import { Prisma } from "@prisma/client"

import type { IdeasService } from "@/application/services/index.js"
import { extractIpAddress } from "@/infrastructure/utils/index.js"
import { IdeaIdParamsSchema } from "@/presentation/validators/index.js"

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
      if (error instanceof Prisma.PrismaClientInitializationError) {
        request.log.error(error, "Database connection failed")
        await reply.code(503).send({
          error: "SERVICE_UNAVAILABLE",
          message: "Database connection failed. Please try again later.",
        })
        return
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        request.log.error({ error, code: error.code }, "Prisma known error")
        await reply.code(500).send({
          error: "DATABASE_ERROR",
          message: "Database operation failed",
        })
        return
      }

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
      if (error instanceof Prisma.PrismaClientInitializationError) {
        request.log.error(error, "Database connection failed")
        await reply.code(503).send({
          error: "SERVICE_UNAVAILABLE",
          message: "Database connection failed. Please try again later.",
        })
        return
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        request.log.error({ error, code: error.code }, "Prisma known error")
        await reply.code(500).send({
          error: "DATABASE_ERROR",
          message: "Database operation failed",
        })
        return
      }

      request.log.error(error)
      await reply.code(500).send({
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch idea",
      })
    }
  }
}
