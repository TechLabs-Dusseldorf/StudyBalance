const express = require('express');
const { requireBodyFields } = require('../middleware/validate');

const makeAuthRoutes = ({ authController }) => {
  const router = express.Router();

  router.post('/register', requireBodyFields(['email', 'password']), authController.register);

  return router;
};

module.exports = { makeAuthRoutes };
