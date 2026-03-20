import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  createGoal,
  createSession,
  createTask,
  login as loginRequest,
  register as registerRequest,
  setUnauthorizedHandler,
} from '../services/apiService'
import {
  clearAuthSession,
  clearGuestData,
  getAuthToken,
  getGuestGoals,
  getGuestSessions,
  getGuestTasks,
  getStoredUser,
  getUserMode,
  setGuestGoals,
  setGuestSessions,
  setGuestTasks,
  setUserMode,
  storeAuthSession,
} from '../utils/localStorage'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

const parseJwtPayload = (token) => {
  try {
    const [, payload] = token.split('.')
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

const isTokenExpired = (token) => {
  const payload = parseJwtPayload(token)

  if (!payload?.exp) {
    return false
  }

  return payload.exp * 1000 <= Date.now()
}

const normalizeUser = (user, token) => {
  const payload = parseJwtPayload(token)
  return {
    id: user?.id ?? payload?.sub ?? payload?.id ?? null,
    name: user?.name ?? user?.username ?? payload?.name ?? 'Study User',
    email: user?.email ?? payload?.email ?? '',
  }
}

const extractAuthPayload = (response) => {
  const token = response?.token ?? response?.jwt ?? response?.accessToken ?? response?.data?.token
  const user = response?.user ?? response?.data?.user ?? response?.data

  if (!token) {
    throw new Error('Authentication token missing from server response.')
  }

  return { token, user: normalizeUser(user, token) }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const { showInfo, showSuccess, showWarning } = useToast()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [userMode, setUserModeState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(
    (options = {}) => {
      clearAuthSession()
      clearGuestData()
      setUser(null)
      setToken(null)
      setUserModeState(null)

      if (options.redirect !== false) {
        navigate('/login', { replace: true })
      }
    },
    [navigate]
  )

  const migrateGuestData = useCallback(async () => {
    const guestTasks = getGuestTasks()
    const guestGoals = getGuestGoals()
    const guestSessions = getGuestSessions()
    const operations = [
      ...guestTasks.map((task) => ({ type: 'task', item: task, request: () => createTask(task) })),
      ...guestGoals.map((goal) => ({ type: 'goal', item: goal, request: () => createGoal(goal) })),
      ...guestSessions.map((session) => ({ type: 'session', item: session, request: () => createSession(session) })),
    ]

    if (operations.length === 0) {
      clearGuestData()
      return
    }

    const results = await Promise.allSettled(operations.map((operation) => operation.request()))
    const failedOperations = results.flatMap((result, index) =>
      result.status === 'rejected' ? [{ ...operations[index], reason: result.reason }] : []
    )

    if (failedOperations.length === 0) {
      clearGuestData()
      return
    }

    setGuestTasks(failedOperations.filter((operation) => operation.type === 'task').map((operation) => operation.item))
    setGuestGoals(failedOperations.filter((operation) => operation.type === 'goal').map((operation) => operation.item))
    setGuestSessions(
      failedOperations.filter((operation) => operation.type === 'session').map((operation) => operation.item)
    )

    console.warn('Failed to migrate some guest data.', failedOperations)
    showWarning('Some guest data could not be migrated. It stays on this device so you can try again later.')
  }, [showWarning])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      showWarning('Your session expired. Please log in again.')
      logout()
    })
    return () => setUnauthorizedHandler(null)
  }, [logout, showWarning])

  useEffect(() => {
    const mode = getUserMode()
    const storedToken = getAuthToken()
    const storedUser = getStoredUser()

    if (mode === 'guest') {
      setUser({ name: 'Guest User', email: '' })
      setUserModeState('guest')
      setIsLoading(false)
      return
    }

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken)
      setUser(normalizeUser(storedUser, storedToken))
      setUserModeState('authenticated')
      setIsLoading(false)
      return
    }

    if (storedToken && isTokenExpired(storedToken)) {
      clearAuthSession()
    }

    setIsLoading(false)
  }, [])

  const login = useCallback(
    async ({ email, password }) => {
      const response = await loginRequest(email, password)
      const payload = extractAuthPayload(response)
      storeAuthSession(payload)
      setToken(payload.token)
      setUser(payload.user)
      setUserModeState('authenticated')
      showSuccess(`Welcome back, ${payload.user.name}.`)
      navigate('/dashboard', { replace: true })
      return payload.user
    },
    [navigate, showSuccess]
  )

  const register = useCallback(
    async ({ email, password }) => {
      const shouldMigrateGuestData = getUserMode() === 'guest'
      const response = await registerRequest(email, password)
      const payload = extractAuthPayload(response)
      storeAuthSession(payload)
      setToken(payload.token)
      setUser(payload.user)
      setUserModeState('authenticated')

      if (shouldMigrateGuestData) {
        await migrateGuestData()
      }

      showSuccess('Account created successfully.')
      navigate('/dashboard', { replace: true })
      return payload.user
    },
    [migrateGuestData, navigate, showSuccess]
  )

  const loginAsGuest = useCallback(() => {
    clearAuthSession()
    setUserMode('guest')
    setUser({ name: 'Guest User', email: '' })
    setToken(null)
    setUserModeState('guest')
    showInfo('You are browsing in guest mode.')
    navigate('/dashboard', { replace: true })
  }, [navigate, showInfo])

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: userMode === 'authenticated' && Boolean(token),
      isGuest: userMode === 'guest',
      login,
      logout,
      register,
      loginAsGuest,
    }),
    [isLoading, login, loginAsGuest, logout, register, token, user, userMode]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
