const express = require('express')
const { validateBody } = require('../middleware/validate')
const { createGoalSchema, updateGoalSchema } = require('../validators/goal.schema')

const makeGoalRoutes = ({ goalController, requireAuth }) => {
  const router = express.Router()

  router.post('/', requireAuth, validateBody(createGoalSchema), goalController.createGoal)
  router.get('/', requireAuth, goalController.listGoals)
  router.get('/:id', requireAuth, goalController.getGoalById)
  router.put('/:id', requireAuth, validateBody(updateGoalSchema), goalController.updateGoal)
  router.delete('/:id', requireAuth, goalController.deleteGoal)

  return router
}

module.exports = { makeGoalRoutes }