const { badRequest, internal } = require('../utils/httpErrors')
const { taskDto } = require('../utils/response')

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const parseBooleanQuery = (value) => {
  if (value === undefined) return undefined
  if (value === true || value === 'true' || value === '1') return true
  if (value === false || value === 'false' || value === '0') return false
  return undefined
}

const normalizeTagsQuery = (value) => {
  if (!value) return undefined
  return String(value)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

const normalizeSort = ({ sortBy, order }) => {
  const allowedSortFields = {
    createdAt: 'createdAt',
    dueDate: 'dueDate',
    priority: 'priority',
  }

  const sortField = allowedSortFields[sortBy] || 'createdAt'
  const sortOrder = String(order).toLowerCase() === 'desc' ? -1 : 1

  return { sortField, sortOrder }
}

const makeTaskService = ({ taskModel }) => {
  const createTask = async ({ userId, input }) => {
    const taskToCreate = {
      userId,
      title: input.title,
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
      ...(input.estimatedTime !== undefined ? { estimatedTime: input.estimatedTime } : {}),
      ...(input.isCompleted !== undefined ? { isCompleted: input.isCompleted } : {}),
    }

    try {
      const created = await taskModel.create(taskToCreate)
      return taskDto(created.toObject())
    } catch (err) {
      throw internal('Failed to create task')
    }
  }

  const listTasks = async ({ userId, query }) => {
    const search = query.search ? String(query.search).trim() : undefined
    const tags = normalizeTagsQuery(query.tags)
    const parsedIsCompleted = parseBooleanQuery(query.isCompleted)

    if (query.isCompleted !== undefined && parsedIsCompleted === undefined) {
      throw badRequest('Invalid isCompleted value. Use true/false.')
    }

    const { sortField, sortOrder } = normalizeSort({
      sortBy: query.sortBy,
      order: query.order,
    })

    const baseFilter = { userId }

    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: escapeRegex(search), $options: 'i' } },
            { description: { $regex: escapeRegex(search), $options: 'i' } },
          ],
        }
      : {}

    const tagsFilter = tags && tags.length
      ? { tags: { $in: tags } }
      : {}

    const completionFilter =
      parsedIsCompleted === undefined ? {} : { isCompleted: parsedIsCompleted }

    const filter = {
      ...baseFilter,
      ...searchFilter,
      ...tagsFilter,
      ...completionFilter,
    }

    const tasks = await taskModel
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .lean()

    const dtoTasks = tasks.map((task) => taskDto(task))

    if (sortField === 'priority') {
      const PRIORITY_ORDER = { low: 1, medium: 2, high: 3 }
      dtoTasks.sort((a, b) => {
        const aVal = PRIORITY_ORDER[a.priority] ?? 0
        const bVal = PRIORITY_ORDER[b.priority] ?? 0
        return sortOrder === 1 ? aVal - bVal : bVal - aVal
      })
    }

    return { tasks: dtoTasks, count: dtoTasks.length }
  }

  return {
    createTask,
    listTasks,
  }
}

module.exports = { makeTaskService }

