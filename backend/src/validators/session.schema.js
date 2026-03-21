const { z } = require('zod')

const logSessionSchema = z.object({
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  sessionType: z.enum(['focus', 'break']).default('focus'),
  taskId: z.string().optional(),
})

module.exports = { logSessionSchema }