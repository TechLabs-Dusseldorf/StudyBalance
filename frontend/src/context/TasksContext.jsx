import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks as getTasksRequest,
  updateTask as updateTaskRequest,
} from '../services/apiService'
import { createClientId, getGuestTasks, setGuestTasks } from '../utils/localStorage'
import { useAuth } from './AuthContext'
import { useStats } from './StatsContext'

const TasksContext = createContext(null)

const normalizeTasks = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.tasks)) {
    return payload.tasks
  }

  return []
}

const matchesSearch = (task, query) => {
  if (!query) {
    return true
  }

  const haystack = `${task.title ?? ''} ${task.description ?? ''}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

export function TasksProvider({ children }) {
  const { isAuthenticated, isGuest } = useAuth()
  const { refreshStats } = useStats()
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [completionFilter, setCompletionFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      if (isGuest) {
        setTasks(getGuestTasks())
        return
      }

      if (isAuthenticated) {
        const response = await getTasksRequest({
          search: searchQuery || undefined,
          tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
        })
        setTasks(normalizeTasks(response))
        return
      }

      setTasks([])
    } catch (fetchError) {
      setError(fetchError.response?.data?.message ?? fetchError.message ?? 'Unable to load tasks.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, isGuest, searchQuery, selectedTags])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = useCallback(
    async (taskData) => {
      setError('')
      let nextTasks = []

      if (isGuest) {
        const newTask = { id: createClientId(), isCompleted: false, createdAt: new Date().toISOString(), ...taskData }
        nextTasks = [newTask, ...getGuestTasks()]
        setGuestTasks(nextTasks)
        setTasks(nextTasks)
      } else {
        const response = await createTaskRequest(taskData)
        const createdTask = response?.task ?? response
        setTasks((currentTasks) => [createdTask, ...currentTasks])
      }

      await refreshStats()
    },
    [isGuest, refreshStats]
  )

  const updateTask = useCallback(
    async (id, taskData) => {
      setError('')

      if (isGuest) {
        const nextTasks = getGuestTasks().map((task) => (task.id === id ? { ...task, ...taskData } : task))
        setGuestTasks(nextTasks)
        setTasks(nextTasks)
      } else {
        const response = await updateTaskRequest(id, taskData)
        const updatedTask = response?.task ?? response
        setTasks((currentTasks) => currentTasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
      }

      await refreshStats()
    },
    [isGuest, refreshStats]
  )

  const deleteTask = useCallback(
    async (id) => {
      setError('')

      if (isGuest) {
        const nextTasks = getGuestTasks().filter((task) => task.id !== id)
        setGuestTasks(nextTasks)
        setTasks(nextTasks)
      } else {
        await deleteTaskRequest(id)
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
      }

      await refreshStats()
    },
    [isGuest, refreshStats]
  )

  const toggleTaskCompletion = useCallback(
    async (task) => {
      await updateTask(task.id, { isCompleted: !task.isCompleted })
    },
    [updateTask]
  )

  const availableTags = useMemo(() => {
    const tags = new Set()
    tasks.forEach((task) => {
      ;(task.tags ?? []).forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [tasks])

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesTags = selectedTags.length === 0 || (task.tags ?? []).some((tag) => selectedTags.includes(tag))
        const matchesCompletion =
          completionFilter === 'all' ||
          (completionFilter === 'completed' && task.isCompleted) ||
          (completionFilter === 'active' && !task.isCompleted)

        return matchesSearch(task, searchQuery) && matchesTags && matchesCompletion
      }),
    [completionFilter, searchQuery, selectedTags, tasks]
  )

  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      availableTags,
      searchQuery,
      setSearchQuery,
      selectedTags,
      setSelectedTags,
      completionFilter,
      setCompletionFilter,
      isLoading,
      error,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
    }),
    [
      availableTags,
      completionFilter,
      createTask,
      deleteTask,
      error,
      fetchTasks,
      filteredTasks,
      isLoading,
      searchQuery,
      selectedTags,
      tasks,
      toggleTaskCompletion,
      updateTask,
    ]
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export const useTasks = () => {
  const context = useContext(TasksContext)

  if (!context) {
    throw new Error('useTasks must be used within TasksProvider')
  }

  return context
}
