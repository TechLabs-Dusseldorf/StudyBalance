const { z } = require('zod')

const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
  targetDate: z.coerce.date().optional(),
  isCompleted: z.boolean().optional(),
})

const updateGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').trim().optional(),
  description: z.string().optional(),
  targetDate: z.coerce.date().optional(),
  isCompleted: z.boolean().optional(),
})

module.exports = { createGoalSchema, updateGoalSchema }
