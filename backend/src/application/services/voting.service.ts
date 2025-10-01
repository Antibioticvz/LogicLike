import config from "@/config/index.js"
import type { VoteResult } from "@/domain/entities/index.js"
import { VotingError, VotingErrorType } from "@/domain/entities/index.js"
import type {
  IIdeasRepository,
  IVotesRepository,
} from "@/domain/interfaces/index.js"
import prisma from "@/infrastructure/database/prisma.js"
import type { FastifyBaseLogger } from "fastify"

export class VotingService {
  constructor(
    private readonly ideasRepository: IIdeasRepository,
    private readonly votesRepository: IVotesRepository,
    private readonly logger?: FastifyBaseLogger
  ) {}

  async vote(ideaId: number, ipAddress: string): Promise<VoteResult> {
    const idea = await this.ideasRepository.findById(ideaId)
    if (!idea) {
      // LOGGING: Попытка голосования за несуществующую идею
      this.logger?.warn(
        { ideaId, ipAddress },
        "Vote attempt for non-existent idea"
      )
      throw new VotingError(
        VotingErrorType.IDEA_NOT_FOUND,
        `Idea with id ${ideaId} not found`
      )
    }

    // CRITICAL FIX #1: Проверка дубликата ПЕРЕД транзакцией
    // Это позволяет быстро вернуть ошибку без блокировки БД
    const alreadyVoted = await this.votesRepository.existsByIdeaAndIp(
      ideaId,
      ipAddress
    )
    if (alreadyVoted) {
      // LOGGING: Попытка повторного голосования
      this.logger?.info({ ideaId, ipAddress }, "Duplicate vote attempt blocked")
      throw new VotingError(
        VotingErrorType.ALREADY_VOTED,
        "You have already voted for this idea"
      )
    }

    // CRITICAL FIX #2 & #3: Транзакция для атомарности и защиты от race condition
    //
    // Проблема #1 (race condition): Раньше между проверкой лимита и созданием голоса
    // другой параллельный запрос мог пройти проверку, и пользователь получал 11+ голосов
    //
    // Проблема #2 (рассинхронизация): create() и incrementVoteCount() были отдельными операциями.
    // Если incrementVoteCount падал, голос оставался в БД, но счетчик не увеличивался
    //
    // Решение: Всё в одной транзакции с правильной изоляцией
    const result = await prisma.$transaction(async tx => {
      // Пересчитываем голоса ВНУТРИ транзакции для точности
      const voteCount = await tx.vote.count({
        where: { ipAddress },
      })

      if (voteCount >= config.voting.maxVotesPerIp) {
        // LOGGING: Превышен лимит голосов
        this.logger?.warn(
          { ideaId, ipAddress, voteCount, limit: config.voting.maxVotesPerIp },
          "Vote limit exceeded"
        )
        throw new VotingError(
          VotingErrorType.VOTE_LIMIT_EXCEEDED,
          `You have reached the maximum number of votes (${config.voting.maxVotesPerIp})`
        )
      }

      // Атомарно создаем голос и инкрементируем счетчик
      // Либо обе операции успешны, либо полный откат
      await tx.vote.create({
        data: { ideaId, ipAddress },
      })

      const updatedIdea = await tx.idea.update({
        where: { id: ideaId },
        data: { votesCount: { increment: 1 } },
      })

      return updatedIdea
    })

    // LOGGING: Успешное голосование
    this.logger?.info(
      { ideaId, ipAddress, newVoteCount: result.votesCount },
      "Vote successfully recorded"
    )

    return {
      success: true,
      idea: {
        id: result.id,
        votesCount: result.votesCount,
        hasVoted: true,
      },
    }
  }
}
