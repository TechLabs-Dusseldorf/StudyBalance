const express = require('express')
const { validateBody } = require('../middleware/validate')
const { createTaskSchema, updateTaskSchema } = require('../validators/task.schema')

const makeTaskRoutes = ({ taskController, requireAuth }) => {
  const router = express.Router()

  router.post('/', requireAuth, validateBody(createTaskSchema), taskController.createTask)
  router.get('/', requireAuth, taskController.listTasks)
  router.get('/:id', requireAuth, taskController.getTaskById)
  router.put('/:id', requireAuth, validateBody(updateTaskSchema), taskController.updateTask)
  router.delete('/:id', requireAuth, taskController.deleteTask)

  return router
}

module.exports = { makeTaskRoutes }