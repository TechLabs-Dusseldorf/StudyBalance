const { z } = require('zod')

const logSessionSchema = z.object({
  duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
  type: z.enum(['focus', 'break']).default('focus'),
  completedAt: z.coerce.date(),
  taskId: z.string().optional(),
  goalId: z.string().optional(),
})

module.exports = { logSessionSchema }