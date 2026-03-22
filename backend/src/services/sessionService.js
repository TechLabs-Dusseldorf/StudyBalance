const { internal } = require('../utils/httpErrors')
const { sessionDto } = require('../utils/response')

const makeSessionService = ({ sessionModel, userModel, goalModel }) => {
  const logSession = async ({ userId, input }) => {
    const { duration, type, completedAt, taskId, goalId } = input

    try {
      // Create the session
      const session = await sessionModel.create({
        userId,
        duration,
        type,
        completedAt,
        ...(taskId && { taskId }),
        ...(goalId && { goalId }),
      })

      // Update user's total study time (only for focus sessions)
      if (type === 'focus') {
        await userModel.findByIdAndUpdate(
          userId,
          { $inc: { totalStudyTime: duration } }
        )

        // Update goal progress if goalId is provided
        if (goalId) {
          await goalModel.findByIdAndUpdate(
            goalId,
            { $inc: { progressHours: duration / 60 } }
          )
        }
      }

      return sessionDto(session.toObject())
    } catch (err) {
      throw internal('Failed to log session')
    }
  }

  return {
    logSession,
  }
}

module.exports = { makeSessionService }