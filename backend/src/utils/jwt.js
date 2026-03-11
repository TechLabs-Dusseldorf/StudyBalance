const jwt = require('jsonwebtoken')

const signJwt = ({ payload, secret, expiresIn }) =>
  jwt.sign(payload, secret, { expiresIn })

const verifyJwt = ({ token, secret }) => {
  try {
    return jwt.verify(token, secret)
  } catch (_err) {
    return null
  }
}

module.exports = {
  signJwt,
  verifyJwt,
}