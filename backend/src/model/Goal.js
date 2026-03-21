const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    targetDate: {
      type: Date,
      default: undefined,
    },
    targetHours: {
      type: Number,
      default: undefined,
    },
    progressHours: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      default: undefined,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

goalSchema.index({ userId: 1, isCompleted: 1 })

module.exports = mongoose.model('Goal', goalSchema)