const express = require('express')
const { validateBody } = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../validators/auth_schema')

const makeAuthRoutes = ({ authController }) => {
  const router = express.Router()

  router.post('/register', validateBody(registerSchema), authController.register)
  router.post('/login', validateBody(loginSchema), authController.login)

  return router
}

module.exports = { makeAuthRoutes }