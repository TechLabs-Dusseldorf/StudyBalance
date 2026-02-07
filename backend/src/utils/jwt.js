const jwt = require('jsonwebtoken');

const signJwt = ({ payload, secret, expiresIn }) =>
  jwt.sign(payload, secret, { expiresIn });

module.exports = { signJwt };
