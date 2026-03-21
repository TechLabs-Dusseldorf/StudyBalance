const makeGoalController = ({ goalService }) => {
  const createGoal = async (req, res, next) => {
    try {
      const userId = req.user.id
      const goal = await goalService.createGoal({ userId, input: req.validatedBody })
      res.status(201).json({ success: true, goal })
    } catch (err) {
      next(err)
    }
  }

  const listGoals = async (req, res, next) => {
    try {
      const userId = req.user.id
      const result = await goalService.listGoals({ userId, query: req.query })
      res.status(200).json({ success: true, goals: result.goals, count: result.count })
    } catch (err) {
      next(err)
    }
  }

  const getGoalById = async (req, res, next) => {
    try {
      const userId = req.user.id
      const goalId = req.params.id
      const goal = await goalService.getGoalById({ userId, goalId })
      res.status(200).json({ success: true, goal })
    } catch (err) {
      next(err)
    }
  }

  const updateGoal = async (req, res, next) => {
    try {
      const userId = req.user.id
      const goalId = req.params.id
      const goal = await goalService.updateGoal({ userId, goalId, input: req.validatedBody })
      res.status(200).json({ success: true, goal })
    } catch (err) {
      next(err)
    }
  }

  const deleteGoal = async (req, res, next) => {
    try {
      const userId = req.user.id
      const goalId = req.params.id
      await goalService.deleteGoal({ userId, goalId })
      res.status(200).json({ success: true, message: 'Goal deleted successfully' })
    } catch (err) {
      next(err)
    }
  }

  return { createGoal, listGoals, getGoalById, updateGoal, deleteGoal }
}

module.exports = { makeGoalController }