const makeTaskController = ({ taskService }) => {
  const createTask = async (req, res, next) => {
    try {
      const userId = req.user.id
      const task = await taskService.createTask({ userId, input: req.validatedBody })
      res.status(201).json({ success: true, task })
    } catch (err) {
      next(err)
    }
  }

  const listTasks = async (req, res, next) => {
    try {
      const userId = req.user.id
      const result = await taskService.listTasks({ userId, query: req.query })
      res.status(200).json({ success: true, tasks: result.tasks, count: result.count })
    } catch (err) {
      next(err)
    }
  }

  const getTaskById = async (req, res, next) => {
    try {
      const userId = req.user.id
      const taskId = req.params.id
      const task = await taskService.getTaskById({ userId, taskId })
      res.status(200).json({ success: true, task })
    } catch (err) {
      next(err)
    }
  }

  const updateTask = async (req, res, next) => {
    try {
      const userId = req.user.id
      const taskId = req.params.id
      const task = await taskService.updateTask({ userId, taskId, input: req.validatedBody })
      res.status(200).json({ success: true, task })
    } catch (err) {
      next(err)
    }
  }

  const deleteTask = async (req, res, next) => {
    try {
      const userId = req.user.id
      const taskId = req.params.id
      await taskService.deleteTask({ userId, taskId })
      res.status(200).json({ success: true, message: 'Task deleted successfully' })
    } catch (err) {
      next(err)
    }
  }

  return { createTask, listTasks, getTaskById, updateTask, deleteTask }
}

module.exports = { makeTaskController }