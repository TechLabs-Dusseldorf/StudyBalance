const { normalizeEmail, isValidEmail, isStrongPassword } = require('../utils/validators');
const { badRequest, conflict, internal } = require('../utils/httpErrors');
const { userDto } = require('../utils/response');

const isMongoDuplicateKeyError = (err) =>
  Boolean(err && (err.code === 11000 || err.code === 11001));

const makeAuthService = ({ userModel, hashPassword, signJwt, config }) => {
  const validateRegisterInput = ({ email, password }) => {
    const result = registerSchema.safeParse({ email, password });
    
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path[0],
        message: err.message,
      }));
      throw badRequest('Validation failed', { errors });
    }
    
    return { 
      email: result.data.email.toLowerCase().trim(), 
      password: result.data.password 
    };
  };
    return { email: normalizedEmail, password };
  };

  const createUser = async ({ email, password }) => {
    const passwordHash = await hashPassword({
      password,
      saltRounds: config.bcryptSaltRounds,
    });

    try {
      return await userModel.create({ email, passwordHash });
    } catch (err) {
      if (isMongoDuplicateKeyError(err)) {
        throw conflict('Email already exists');
      }

      console.error('User creation failed:', err);

      throw internal('Failed to create user');
    }
  };

  const issueToken = ({ user }) =>
    signJwt({
      payload: { sub: String(user._id), email: user.email },
      secret: config.jwtSecret,
      expiresIn: config.jwtExpiresIn,
    });

  const register = async ({ email, password }) => {
    const input = validateRegisterInput({ email, password });

    const user = await createUser(input);
    const token = issueToken({ user });

    return {
      token,
      user: userDto(user.toObject()),
    };
  };

  return { register };


module.exports = { makeAuthService };