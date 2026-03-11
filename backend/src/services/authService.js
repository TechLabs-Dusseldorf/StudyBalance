const { registerSchema, loginSchema } = require('../validators/auth.schema')
const { badRequest, conflict, internal, unauthorized } = require('../utils/httpErrors')
const { userDto } = require('../utils/response')

const isMongoDuplicateKeyError = (err) =>
  Boolean(err && (err.code === 11000 || err.code === 11001))

const mapZodErrors = (error) =>
  error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))

const makeAuthService = ({ userModel, hashPassword, comparePassword, signJwt, config }) => {
  const validateRegisterInput = ({ email, password }) => {
    const result = registerSchema.safeParse({ email, password })

    if (!result.success) {
      throw badRequest('Validation failed', { errors: mapZodErrors(result.error) })
    }

    return {
      email: result.data.email.toLowerCase().trim(),
      password: result.data.password,
    }
  }

  const validateLoginInput = ({ email, password }) => {
    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      throw badRequest('Validation failed', { errors: mapZodErrors(result.error) })
    }

    return {
      email: result.data.email.toLowerCase().trim(),
      password: result.data.password,
    }
  }

  const createUser = async ({ email, password }) => {
    const passwordHash = await hashPassword({
      password,
      saltRounds: config.bcryptSaltRounds,
    })

    try {
      return await userModel.create({ email, passwordHash })
    } catch (err) {
      if (isMongoDuplicateKeyError(err)) {
        throw conflict('Email already exists')
      }

      console.error('User creation failed:', err)
      throw internal('Failed to create user')
    }
  }

  const issueToken = ({ user }) =>
    signJwt({
      payload: { sub: String(user._id), email: user.email },
      secret: config.jwtSecret,
      expiresIn: config.jwtExpiresIn,
    })

  const register = async ({ email, password }) => {
    const input = validateRegisterInput({ email, password })
    const user = await createUser(input)
    const token = issueToken({ user })

    return {
      token,
      user: userDto(user.toObject()),
    }
  }

  const login = async ({ email, password }) => {
    const input = validateLoginInput({ email, password })

    let user

    try {
      user = await userModel.findOne({ email: input.email }).select('+passwordHash')
    } catch (err) {
      console.error('User login lookup failed:', err)
      throw internal('Failed to login')
    }

    if (!user) {
      throw unauthorized('Invalid credentials')
    }

    const passwordMatches = await comparePassword({
      password: input.password,
      passwordHash: user.passwordHash,
    })

    if (!passwordMatches) {
      throw unauthorized('Invalid credentials')
    }

    let updatedUser

    try {
      updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { lastLogin: new Date() },
        { new: true }
      )
    } catch (err) {
      console.error('Updating lastLogin failed:', err)
      throw internal('Failed to login')
    }

    const token = issueToken({ user: updatedUser })

    return {
      token,
      user: userDto(updatedUser.toObject()),
    }
  }

  return {
    register,
    login,
  }
}

module.exports = { makeAuthService }