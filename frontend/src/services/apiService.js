import axios from 'axios'

import { getAuthToken } from '../utils/localStorage'

let onUnauthorized = null

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '' })

api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized()
    }

    return Promise.reject(error)
  }
)

export const register = async (email, password) => {
  const response = await api.post('/api/auth/register', { email, password })
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password })
  return response.data
}

export const getTasks = async (filters = {}) => {
  const response = await api.get('/api/tasks', { params: filters })
  return response.data
}

export const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData)
  return response.data
}

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/api/tasks/${id}`, taskData)
  return response.data
}

export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`)
  return response.data
}

export const getGoals = async () => {
  const response = await api.get('/api/goals')
  return response.data
}

export const createGoal = async (goalData) => {
  const response = await api.post('/api/goals', goalData)
  return response.data
}

export const updateGoal = async (id, goalData) => {
  const response = await api.put(`/api/goals/${id}`, goalData)
  return response.data
}

export const deleteGoal = async (id) => {
  const response = await api.delete(`/api/goals/${id}`)
  return response.data
}

export const getStats = async () => {
  const response = await api.get('/api/stats')
  return response.data
}

export const createSession = async (sessionData) => {
  const response = await api.post('/api/sessions', sessionData)
  return response.data
}
