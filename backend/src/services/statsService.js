const { internal, notFound } = require('../utils/httpErrors')

const makeStatsService = ({ userModel, sessionModel, taskModel, goalModel }) => {
  const getUserStats = async ({ userId, query = {} }) => {
    try {
      // Get user's total study time
      const user = await userModel.findById(userId).lean()
      
      if (!user) {
        throw notFound('User not found')
      }

      // Build date filter based on period
      const period = query.period || 'all'
      let dateFilter = {}
      
      if (period === 'today') {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        dateFilter = { createdAt: { $gte: startOfDay } }
      } else if (period === 'week') {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        dateFilter = { createdAt: { $gte: weekAgo } }
      } else if (period === 'month') {
        const monthAgo = new Date()
        monthAgo.setDate(monthAgo.getDate() - 30)
        dateFilter = { createdAt: { $gte: monthAgo } }
      }
      // 'all' means no date filter

      // Count completed and active tasks
      const completedTasks = await taskModel.countDocuments({ 
        userId, 
        isCompleted: true,
        ...dateFilter
      })
      
      const activeTasks = await taskModel.countDocuments({ 
        userId, 
        isCompleted: false 
      })

      // Count completed and active goals
      const completedGoals = await goalModel.countDocuments({ 
        userId, 
        isCompleted: true,
        ...dateFilter
      })
      
      const activeGoals = await goalModel.countDocuments({ 
        userId, 
        isCompleted: false 
      })

      return {
        totalStudyTime: user.totalStudyTime || 0,
        completedTasks,
        activeTasks,
        completedGoals,
        activeGoals,
        period,
        lastUpdated: new Date().toISOString(),
      }
    } catch (err) {
      if (err.statusCode) throw err
      throw internal('Failed to get stats')
    }
  }

  return {
    getUserStats,
  }
}

module.exports = { makeStatsService }