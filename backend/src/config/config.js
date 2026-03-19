const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

/**
 * Application configuration object
 * Pure object with environment-based settings
 */
const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Crypto / Auth
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  // Story 4: Logout is client-side; backend should keep tokens short-lived (~7 days).
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Server
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    apiPrefix: process.env.API_PREFIX || '/api',
    apiVersion: process.env.API_VERSION || 'v1',
  },

  // Database
  database: {
    uri:
      process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_URI_TEST
        : process.env.MONGODB_URI || 'mongodb://localhost:27017/backend_db',
    options: {
      // Mongoose 8+ options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // CORS
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'development' ? 'dev' : 'combined',
  },
}

// Freeze config to prevent mutations (functional programming)
module.exports = Object.freeze(config)
