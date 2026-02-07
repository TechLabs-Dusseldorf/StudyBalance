const bcrypt = require('bcryptjs');

const hashPassword = async ({ password, saltRounds }) =>
  bcrypt.hash(password, saltRounds);

module.exports = { hashPassword };
