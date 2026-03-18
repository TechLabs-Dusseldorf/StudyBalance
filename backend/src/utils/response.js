const successResponse = ({ token, user }) => ({
  success: true,
  token,
  user,
})

const userDto = ({ _id, email, lastLogin }) => ({ 
  id: String(_id),
  email,
  lastLogin,                                        
})

module.exports = {
  successResponse,
  userDto,
}