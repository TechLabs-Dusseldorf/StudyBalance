const formatError = (err, includeStack = false) => ({
  success: false,
  error: {
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Internal Server Error',
    ...(err.details ? { details: err.details } : {}),
    ...(includeStack ? { stack: err.stack } : {}),
  },
  timestamp: new Date().toISOString(),
});

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';
  res.status(statusCode).json(formatError(err, isDev));
};

const notFoundHandler = (_req, res) => {
  res.status(404).json(
    formatError({
      code: 'NOT_FOUND',
      message: 'Resource not found',
    })
  );
};

module.exports = { errorHandler, notFoundHandler, formatError };
