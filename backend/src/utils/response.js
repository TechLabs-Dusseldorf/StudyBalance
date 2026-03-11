const successResponse = ({ token, user }) => ({
  success: true,
  token,
  user,
})

const userDto = ({ _id, email, createdAt, lastLogin }) => ({
  id: String(_id),
  email,
  createdAt,
  lastLogin,
})

module.exports = {
  successResponse,
  userDto,
}