const { internal, notFound } = require('../utils/httpErrors')
const { goalDto } = require('../utils/response')

const makeGoalService = ({ goalModel }) => {
  const createGoal = async ({ userId, input }) => {
    const goalToCreate = {
      userId,
      title: input.title,
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.targetDate !== undefined ? { targetDate: input.targetDate } : {}),
      ...(input.targetHours !== undefined ? { targetHours: input.targetHours } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.isCompleted !== undefined ? { isCompleted: input.isCompleted } : {}),
    }

    try {
      const created = await goalModel.create(goalToCreate)
      return goalDto(created.toObject())
    } catch (err) {
      throw internal('Failed to create goal')
    }
  }

  const listGoals = async ({ userId, query = {} }) => {
    try {
      const filter = { userId }
      
      const val = query.isCompleted
      if (val === true || val === 'true' || val === '1') filter.isCompleted = true
      else if (val === false || val === 'false' || val === '0') filter.isCompleted = false

      const goals = await goalModel
        .find(filter)
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
      if (input.targetHours !== undefined) updates.targetHours = input.targetHours
      if (input.progressHours !== undefined) updates.progressHours = input.progressHours
      if (input.category !== undefined) updates.category = input.category
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
