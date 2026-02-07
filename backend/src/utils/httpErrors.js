const makeHttpError = ({ statusCode, code, message, details }) => ({
  name: 'HttpError',
  statusCode,
  code,
  message,
  ...(details ? { details } : {}),
});

const badRequest = (message, details) =>
  makeHttpError({ statusCode: 400, code: 'BAD_REQUEST', message, details });

const conflict = (message, details) =>
  makeHttpError({ statusCode: 409, code: 'CONFLICT', message, details });

const internal = (message = 'Internal Server Error', details) =>
  makeHttpError({ statusCode: 500, code: 'INTERNAL_ERROR', message, details });

module.exports = {
  makeHttpError,
  badRequest,
  conflict,
  internal,
};
