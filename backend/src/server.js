const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const config = require('./config/config')
const { connectDB, disconnectDB } = require('./db/db')

const User = require('./model/User')
const { makeAuthService } = require('./services/authService')
const { makeAuthController } = require('./controllers/authController')
const { makeAuthRoutes } = require('./routes/authRoutes')
const { hashPassword, comparePassword } = require('./utils/crypto')
const { signJwt } = require('./utils/jwt')
const { makeRequireAuth } = require('./middleware/authenticate')

const Task = require('./model/Task')
const { makeTaskService } = require('./services/taskService')
const { makeTaskController } = require('./controllers/taskController')
const { makeTaskRoutes } = require('./routes/taskRoutes')

const Goal = require('./model/Goal')
const { makeGoalService } = require('./services/goalService')
const { makeGoalController } = require('./controllers/goalController')
const { makeGoalRoutes } = require('./routes/goalRoutes')

const Session = require('./model/Session')
const { makeSessionService } = require('./services/sessionService')
const { makeSessionController } = require('./controllers/sessionController')
const { makeSessionRoutes } = require('./routes/sessionRoutes')

const { makeStatsService } = require('./services/statsService')
const { makeStatsController } = require('./controllers/statsController')
const { makeStatsRoutes } = require('./routes/statsRoutes')

/**
 * Create and configure Express application
 * @returns {express.Application}
 */
const createApp = () => {
  const app = express()

  // Security middleware
  app.use(helmet())

  // CORS
  app.use(cors(config.cors))

  // Body parsing
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // Compression
  app.use(compression())

  // Logging
  if (config.isDevelopment) {
    app.use(morgan('dev'))
  }

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
  })
  app.use(`${config.server.apiPrefix}/`, limiter)

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
    })
  })

  const authService = makeAuthService({
    userModel: User,
    hashPassword,
    comparePassword,
    signJwt,
    config,
  })

  const authController = makeAuthController({ authService })

  // API routes
  app.use(`${config.server.apiPrefix}/auth`, makeAuthRoutes({ authController }))

  const requireAuth = makeRequireAuth({ jwtSecret: config.jwtSecret })
  
  const taskService = makeTaskService({ taskModel: Task })
  const taskController = makeTaskController({ taskService })
  app.use(`${config.server.apiPrefix}/tasks`, makeTaskRoutes({ taskController, requireAuth }))

  const goalService = makeGoalService({ goalModel: Goal })
  const goalController = makeGoalController({ goalService })
  app.use(`${config.server.apiPrefix}/goals`, makeGoalRoutes({ goalController, requireAuth }))

  const sessionService = makeSessionService({ sessionModel: Session, userModel: User })
  const sessionController = makeSessionController({ sessionService })
  app.use(`${config.server.apiPrefix}/sessions`, makeSessionRoutes({ sessionController, requireAuth }))

  const statsService = makeStatsService({ userModel: User, sessionModel: Session })
  const statsController = makeStatsController({ statsService })
  app.use(`${config.server.apiPrefix}/stats`, makeStatsRoutes({ statsController, requireAuth }))

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Resource not found', path: req.path },
      timestamp: new Date().toISOString(),
    })
  })

  // Global error handler
  app.use((err, req, res, _next) => {
    const statusCode = err.statusCode || 500
    const isDev = config.isDevelopment

    res.status(statusCode).json({
      success: false,
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message || 'Internal Server Error',
        ...(err.details && { details: err.details }),
        ...(isDev && { stack: err.stack }),
      },
      timestamp: new Date().toISOString(),
    })
  })

  return app
}

/**
 * Start server
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    await connectDB()

    const app = createApp()

    const server = app.listen(config.server.port, () => {
      console.log(`🚀 Server running in ${config.env} mode`)
      console.log(`📡 Listening on port ${config.server.port}`)
      console.log(`🔗 API: http://localhost:${config.server.port}${config.server.apiPrefix}`)
    })

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`)

      server.close(async () => {
        console.log('✅ HTTP server closed')
        try {
          await disconnectDB()
        } catch (err) {
          console.error('❌ Error disconnecting DB:', err.message)
          process.exit(1)
        }
        process.exit(0)
      })

      setTimeout(() => {
        console.error('⚠️  Forcefully shutting down')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    throw error
  }
}

if (require.main === module) {
  startServer()
}

module.exports = { createApp, startServer }