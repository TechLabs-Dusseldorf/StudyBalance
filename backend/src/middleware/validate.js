const { badRequest } = require('../utils/httpErrors')

const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }))

    return next(badRequest('Validation failed', { errors }))
  }

  req.validatedBody = result.data
  next()
}

module.exports = { validateBody }