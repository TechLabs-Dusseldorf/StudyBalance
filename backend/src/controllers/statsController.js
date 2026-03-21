const makeStatsController = ({ statsService }) => {
  const getStats = async (req, res, next) => {
    try {
      const userId = req.user.id
      const stats = await statsService.getUserStats({ userId })
      res.status(200).json({ success: true, stats })
    } catch (err) {
      next(err)
    }
  }

  return { getStats }
}

module.exports = { makeStatsController }
