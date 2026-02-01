const mongoose = require('mongoose')

const config = require('../config/config')

/**
 * Connect to MongoDB
 * Pure function that returns a promise
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri, config.database.options)

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected')
    })

    return conn
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message)
    throw error
  }
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    console.log('✅ MongoDB connection closed')
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message)
    throw error
  }
}

/**
 * Get connection status
 * Pure function
 * @returns {string}
 */
const getConnectionStatus = () => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  return states[mongoose.connection.readyState] || 'unknown'
}

module.exports = { connectDB, disconnectDB, getConnectionStatus }
