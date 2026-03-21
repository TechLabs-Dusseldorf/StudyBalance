const { internal } = require('../utils/httpErrors')

const makeStatsService = ({ userModel, sessionModel }) => {
  const getUserStats = async ({ userId }) => {
    try {
      // Get user's total study time
      const user = await userModel.findById(userId).lean()
      
      if (!user) {
        throw internal('User not found')
      }

      // Get session count
      const sessionCount = await sessionModel.countDocuments({ 
        userId, 
        sessionType: 'focus' 
      })

      return {
        totalStudyTime: user.totalStudyTime || 0,
        sessionCount: sessionCount,
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