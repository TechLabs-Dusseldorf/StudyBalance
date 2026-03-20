const { z } = require('zod')

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  estimatedTime: z.coerce.number().int().positive().optional(),
  isCompleted: z.boolean().optional(),
})

module.exports = { createTaskSchema }

