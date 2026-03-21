const makeSessionController = ({ sessionService }) => {
  const logSession = async (req, res, next) => {
    try {
      const userId = req.user.id
      const session = await sessionService.logSession({ userId, input: req.validatedBody })
      res.status(201).json({ success: true, session })
    } catch (err) {
      next(err)
    }
  }

  return { logSession }
}

module.exports = { makeSessionController }