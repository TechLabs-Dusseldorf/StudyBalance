export const STORAGE_KEYS = {
  authToken: 'authToken',
  authUser: 'authUser',
  userMode: 'userMode',
  guestTasks: 'guestTasks',
  guestGoals: 'guestGoals',
  guestSessions: 'guestSessions',
}

const readJson = (key, fallback = []) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.authToken)

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.authUser)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const getUserMode = () => localStorage.getItem(STORAGE_KEYS.userMode)

export const setUserMode = (mode) => {
  if (mode) {
    localStorage.setItem(STORAGE_KEYS.userMode, mode)
    return
  }

  localStorage.removeItem(STORAGE_KEYS.userMode)
}

export const storeAuthSession = ({ token, user }) => {
  localStorage.setItem(STORAGE_KEYS.authToken, token)
  localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user ?? {}))
  setUserMode('authenticated')
}

export const clearAuthSession = () => {
  localStorage.removeItem(STORAGE_KEYS.authToken)
  localStorage.removeItem(STORAGE_KEYS.authUser)
  localStorage.removeItem(STORAGE_KEYS.userMode)
}

export const getGuestTasks = () => readJson(STORAGE_KEYS.guestTasks, [])
export const setGuestTasks = (tasks) => writeJson(STORAGE_KEYS.guestTasks, tasks)

export const getGuestGoals = () => readJson(STORAGE_KEYS.guestGoals, [])
export const setGuestGoals = (goals) => writeJson(STORAGE_KEYS.guestGoals, goals)

export const getGuestSessions = () => readJson(STORAGE_KEYS.guestSessions, [])
export const setGuestSessions = (sessions) => writeJson(STORAGE_KEYS.guestSessions, sessions)

export const clearGuestData = () => {
  localStorage.removeItem(STORAGE_KEYS.guestTasks)
  localStorage.removeItem(STORAGE_KEYS.guestGoals)
  localStorage.removeItem(STORAGE_KEYS.guestSessions)
}

export const createClientId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
