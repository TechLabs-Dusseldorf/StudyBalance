const { internal, notFound } = require('../utils/httpErrors')
const { goalDto } = require('../utils/response')

const makeGoalService = ({ goalModel }) => {
  const createGoal = async ({ userId, input }) => {
    const goalToCreate = {
      userId,
      title: input.title,
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.targetDate !== undefined ? { targetDate: input.targetDate } : {}),
      ...(input.isCompleted !== undefined ? { isCompleted: input.isCompleted } : {}),
    }

    try {
      const created = await goalModel.create(goalToCreate)
      return goalDto(created.toObject())
    } catch (err) {
      throw internal('Failed to create goal')
    }
  }

  const listGoals = async ({ userId }) => {
    try {
      const goals = await goalModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .lean()

      const dtoGoals = goals.map((goal) => goalDto(goal))
      return { goals: dtoGoals, count: dtoGoals.length }
    } catch (err) {
      throw internal('Failed to list goals')
    }
  }

  const getGoalById = async ({ userId, goalId }) => {
    try {
      const goal = await goalModel.findById(goalId).lean()
      
      if (!goal) {
        throw notFound('Goal not found')
      }
      
      if (String(goal.userId) !== String(userId)) {
        throw notFound('Goal not found')
      }
      
      return goalDto(goal)
    } catch (err) {
      if (err.statusCode) throw err
      throw internal('Failed to get goal')
    }
  }

  const updateGoal = async ({ userId, goalId, input }) => {
    try {
      const existingGoal = await goalModel.findById(goalId)
      
      if (!existingGoal) {
        throw notFound('Goal not found')
      }
      
      if (String(existingGoal.userId) !== String(userId)) {
        throw notFound('Goal not found')
      }

      const updates = {}
      if (input.title !== undefined) updates.title = input.title
      if (input.description !== undefined) updates.description = input.description
      if (input.targetDate !== undefined) updates.targetDate = input.targetDate
      if (input.isCompleted !== undefined) updates.isCompleted = input.isCompleted

      const updated = await goalModel.findByIdAndUpdate(
        goalId,
        updates,
        { new: true, runValidators: true }
      ).lean()

      return goalDto(updated)
    } catch (err) {
      if (err.statusCode) throw err
      throw internal('Failed to update goal')
    }
  }

  const deleteGoal = async ({ userId, goalId }) => {
    try {
      const goal = await goalModel.findById(goalId)
      
      if (!goal) {
        throw notFound('Goal not found')
      }
      
      if (String(goal.userId) !== String(userId)) {
        throw notFound('Goal not found')
      }

      await goalModel.findByIdAndDelete(goalId)
    } catch (err) {
      if (err.statusCode) throw err
      throw internal('Failed to delete goal')
    }
  }

  return {
    createGoal,
    listGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
  }
}

module.exports = { makeGoalService }