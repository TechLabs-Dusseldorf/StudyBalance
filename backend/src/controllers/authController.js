const { successResponse } = require('../utils/response')

const makeAuthController = ({ authService }) => {
  const register = async (req, res, next) => {
    try {
      const { email, password } = req.validatedBody
      const { token, user } = await authService.register({ email, password })

      res.status(201).json(successResponse({ token, user }))
    } catch (err) {
      next(err)
    }
  }

  const login = async (req, res, next) => {
    try {
      const { email, password } = req.validatedBody
      const { token, user } = await authService.login({ email, password })

      res.status(200).json(successResponse({ token, user }))
    } catch (err) {
      next(err)
    }
  }

  return {
    register,
    login,
  }
}

module.exports = { makeAuthController }