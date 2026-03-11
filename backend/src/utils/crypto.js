const bcrypt = require('bcryptjs');

const hashPassword = async ({ password, saltRounds }) =>
  bcrypt.hash(password, saltRounds);

module.exports = { hashPassword };
const comparePassword = async ({ password, passwordHash }) => 
  bcrypt.compare(password, passwordHash);
module.exports = { hashPassword, comparePassword };
