const { badRequest } = require('../utils/httpErrors');

const requireBodyFields = (fields) => (req, _res, next) => {
  const body = req.body || {};
  const missing = fields.filter((f) => body[f] == null);

  return missing.length > 0
    ? next(badRequest('Missing required fields', { missing }))
    : next();
};

module.exports = { requireBodyFields };
