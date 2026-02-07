const { successResponse } = require('../utils/response');

const makeAuthController = ({ authService }) => {
  const register = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.register({ email, password });

      res.status(201).json(successResponse({ token, user }));
    } catch (err) {
      next(err);
    }
  };

  return { register };
};

module.exports = { makeAuthController };
