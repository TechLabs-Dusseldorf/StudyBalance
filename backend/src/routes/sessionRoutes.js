const express = require('express')
const { validateBody } = require('../middleware/validate')
const { logSessionSchema } = require('../validators/session.schema')

const makeSessionRoutes = ({ sessionController, requireAuth }) => {
  const router = express.Router()

  router.post('/', requireAuth, validateBody(logSessionSchema), sessionController.logSession)

  return router
}

module.exports = { makeSessionRoutes }
