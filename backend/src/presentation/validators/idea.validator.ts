import { z } from "zod"

/**
 * Валидация ID идеи из параметров URL
 *
 * Проверяет что ID:
 * - Является числом (не NaN)
 * - Положительное (> 0)
 * - В безопасном диапазоне Number.isSafeInteger
 */
export const IdeaIdParamsSchema = z.object({
  id: z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10)

    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ID must be a valid number",
      })
      return z.NEVER
    }

    if (parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ID must be a positive number",
      })
      return z.NEVER
    }

    if (!Number.isSafeInteger(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ID must be within safe integer range",
      })
      return z.NEVER
    }

    return parsed
  }),
})

export type IdeaIdParams = z.infer<typeof IdeaIdParamsSchema>
