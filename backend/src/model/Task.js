const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
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
    tags: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      default: undefined,
    },
    dueDate: {
      type: Date,
      default: undefined,
    },
    estimatedTime: {
      type: Number,
      default: undefined,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

taskSchema.index({ userId: 1, isCompleted: 1 })

module.exports = mongoose.model('Task', taskSchema)

