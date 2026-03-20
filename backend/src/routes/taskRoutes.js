const express = require('express')
const { validateBody } = require('../middleware/validate')
const { createTaskSchema } = require('../validators/task.schema')

const makeTaskRoutes = ({ taskController, requireAuth }) => {
  const router = express.Router()

  router.post('/', requireAuth, validateBody(createTaskSchema), taskController.createTask)
  router.get('/', requireAuth, taskController.listTasks)

  return router
}

module.exports = { makeTaskRoutes }

