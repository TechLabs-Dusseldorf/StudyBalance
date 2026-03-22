const successResponse = ({ token, user }) => ({
  success: true,
  token,
  user,
})

const userDto = ({ _id, email, lastLogin, createdAt, updatedAt }) => ({
  id: String(_id),
  email,
  lastLogin,
  createdAt,
  updatedAt,
})

const taskDto = ({
  _id,
  userId,
  title,
  description,
  tags,
  priority,
  dueDate,
  estimatedTime,
  isCompleted,
  createdAt,
  updatedAt,
}) => ({
  id: String(_id),
  userId: String(userId),
  title,
  description,
  tags,
  priority,
  dueDate,
  estimatedTime,
  isCompleted,
  createdAt,
  updatedAt,
})

const goalDto = ({
  _id,
  userId,
  title,
  description,
  targetDate,
  targetHours,
  progressHours,
  category,
  isCompleted,
  createdAt,
  updatedAt,
}) => ({
  id: String(_id),
  userId: String(userId),
  title,
  description,
  targetDate,
  targetHours,
  progressHours,
  category,
  isCompleted,
  createdAt,
  updatedAt,
})

const sessionDto = ({
  _id,
  userId,
  duration,
  type,
  completedAt,
  taskId,
  goalId,
  createdAt,
  updatedAt,
}) => ({
  id: String(_id),
  userId: String(userId),
  duration,
  type,
  completedAt,
  taskId: taskId ? String(taskId) : undefined,
  goalId: goalId ? String(goalId) : undefined,
  createdAt,
  updatedAt,
})

module.exports = {
  successResponse,
  userDto,
  taskDto,
  goalDto,
  sessionDto,
}