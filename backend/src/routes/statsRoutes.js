const express = require('express')

const makeStatsRoutes = ({ statsController, requireAuth }) => {
  const router = express.Router()

  router.get('/', requireAuth, statsController.getStats)

  return router
}

module.exports = { makeStatsRoutes }