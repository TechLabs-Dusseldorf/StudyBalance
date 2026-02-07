const { normalizeEmail, isValidEmail, isStrongPassword } = require('../utils/validators');
const { badRequest, conflict, internal } = require('../utils/httpErrors');
const { userDto } = require('../utils/response');

const isMongoDuplicateKeyError = (err) =>
  Boolean(err && (err.code === 11000 || err.code === 11001));

const makeAuthService = ({ userModel, hashPassword, signJwt, config }) => {
  const validateRegisterInput = ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email);

    const errors = [
      !isValidEmail(normalizedEmail) ? { field: 'email', message: 'Invalid email format' } : null,
      !isStrongPassword(password)
        ? {
            field: 'password',
            message: 'Password must be >= 8 chars and include uppercase, lowercase, and number',
          }
        : null,
    ].filter(Boolean);

    if (errors.length > 0) {
      throw badRequest('Validation failed', { errors });
    }

    return { email: normalizedEmail, password };
  };

  const ensureEmailUnique = async ({ email }) => {
    const existing = await userModel.findOne({ email }).lean();
    if (existing) throw conflict('Email already exists');
    return { email };
  };

  const createUser = async ({ email, password }) => {
    const passwordHash = await hashPassword({
      password,
      saltRounds: config.bcryptSaltRounds,
    });

    try {
      const doc = await userModel.create({ email, passwordHash });
      return doc;
    } catch (err) {
      if (isMongoDuplicateKeyError(err)) throw conflict('Email already exists');
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
    await ensureEmailUnique({ email: input.email });

    const user = await createUser(input);
    const token = issueToken({ user });

    return {
      token,
      user: userDto(user.toObject ? user.toObject() : user),
    };
  };

  return { register };
};

module.exports = { makeAuthService };
