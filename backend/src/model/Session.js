const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    sessionType: {
      type: String,
      enum: ['focus', 'break'],
      default: 'focus',
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: undefined,
    },
  },
  { timestamps: true }
)

sessionSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Session', sessionSchema)