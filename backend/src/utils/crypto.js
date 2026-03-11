const bcrypt = require('bcryptjs')

const hashPassword = async ({ password, saltRounds }) =>
  bcrypt.hash(password, saltRounds)

const comparePassword = async ({ password, passwordHash }) =>
  bcrypt.compare(password, passwordHash)

module.exports = {
  hashPassword,
  comparePassword,
}