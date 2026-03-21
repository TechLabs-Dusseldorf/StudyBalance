const { internal } = require('../utils/httpErrors')
const { sessionDto } = require('../utils/response')

const makeSessionService = ({ sessionModel, userModel }) => {
  const logSession = async ({ userId, input }) => {
    const { durationMinutes, sessionType, taskId } = input

    try {
      // Create the session
      const session = await sessionModel.create({
        userId,
        durationMinutes,
        sessionType,
        ...(taskId && { taskId }),
      })

      // Update user's total study time (only for focus sessions)
      if (sessionType === 'focus') {
        await userModel.findByIdAndUpdate(
          userId,
          { $inc: { totalStudyTime: durationMinutes } }
        )
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
