const successResponse = ({ token, user }) => ({
  success: true,
  token,
  user,
});

const userDto = ({ _id, email, createdAt }) => ({
  id: String(_id),
  email,
  createdAt,
});

module.exports = {
  successResponse,
  userDto,
};
