const jwt = require('jsonwebtoken')
const { unauthorized } = require('../utils/httpErrors')

/**
 * Express middleware factory for JWT authentication.
 * Attaches `req.user = { id, email }` on success.
 */
const makeRequireAuth = ({ jwtSecret }) => (req, res, next) => {
  const authorization = req.headers.authorization

  if (!authorization) {
    return next(unauthorized('Missing token'))
  }

  const [scheme, token] = authorization.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return next(unauthorized('Missing token'))
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    const { sub, email } = decoded || {}

    if (!sub) {
      return next(unauthorized('Invalid token'))
    }

    req.user = {
      id: String(sub),
      email: email ? String(email) : undefined,
    }

    return next()
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      return next(unauthorized('Expired token'))
    }
    return next(unauthorized('Invalid token'))
  }
}

module.exports = { makeRequireAuth }

