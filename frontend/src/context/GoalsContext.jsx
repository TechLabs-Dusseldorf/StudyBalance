import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  createGoal as createGoalRequest,
  deleteGoal as deleteGoalRequest,
  getGoals as getGoalsRequest,
  updateGoal as updateGoalRequest,
} from '../services/apiService'
import { createClientId, getGuestGoals, getGuestSessions, setGuestGoals } from '../utils/localStorage'
import { useAuth } from './AuthContext'
import { useStats } from './StatsContext'
import { useToast } from './ToastContext'

const GoalsContext = createContext(null)

const normalizeGoals = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.goals)) {
    return payload.goals
  }

  return []
}

const decorateGoal = (goal, sessions) => {
  const totalFocusHours = sessions.reduce((sum, session) => sum + (session.duration ?? 0), 0) / 60
  const progressHours = goal.progressHours ?? totalFocusHours
  const targetHours = Number(goal.targetHours ?? 0)
  const progressPercent = targetHours > 0 ? Math.min(100, Math.round((progressHours / targetHours) * 100)) : 0

  return { ...goal, progressHours, progressPercent }
}

export function GoalsProvider({ children }) {
  const { isAuthenticated, isGuest } = useAuth()
  const { refreshStats } = useStats()
  const { showError, showSuccess } = useToast()
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchGoals = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      if (isGuest) {
        const sessions = getGuestSessions()
        setGoals(getGuestGoals().map((goal) => decorateGoal(goal, sessions)))
        return
      }

      if (isAuthenticated) {
        const response = await getGoalsRequest()
        setGoals(normalizeGoals(response).map((goal) => decorateGoal(goal, [])))
        return
      }

      setGoals([])
    } catch (fetchError) {
      const message = fetchError.response?.data?.message ?? fetchError.message ?? 'Unable to load goals.'
      setError(message)
      showError(message)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, isGuest, showError])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const createGoal = useCallback(
    async (goalData) => {
      try {
        if (isGuest) {
          const newGoal = { id: createClientId(), createdAt: new Date().toISOString(), ...goalData }
          const nextGoals = [newGoal, ...getGuestGoals()]
          setGuestGoals(nextGoals)
        } else {
          await createGoalRequest(goalData)
        }

        await fetchGoals()
        await refreshStats()
        showSuccess('Goal saved.')
      } catch (requestError) {
        const message = requestError.response?.data?.message ?? requestError.message ?? 'Unable to save goal.'
        setError(message)
        showError(message)
        throw requestError
      }
    },
    [fetchGoals, isGuest, refreshStats, showError, showSuccess]
  )

  const updateGoal = useCallback(
    async (id, goalData) => {
      try {
        if (isGuest) {
          const nextGoals = getGuestGoals().map((goal) => (goal.id === id ? { ...goal, ...goalData } : goal))
          setGuestGoals(nextGoals)
        } else {
          await updateGoalRequest(id, goalData)
        }

        await fetchGoals()
        await refreshStats()
        showSuccess('Goal updated.')
      } catch (requestError) {
        const message = requestError.response?.data?.message ?? requestError.message ?? 'Unable to update goal.'
        setError(message)
        showError(message)
        throw requestError
      }
    },
    [fetchGoals, isGuest, refreshStats, showError, showSuccess]
  )

  const deleteGoal = useCallback(
    async (id) => {
      try {
        if (isGuest) {
          const nextGoals = getGuestGoals().filter((goal) => goal.id !== id)
          setGuestGoals(nextGoals)
        } else {
          await deleteGoalRequest(id)
        }

        await fetchGoals()
        await refreshStats()
        showSuccess('Goal deleted.')
      } catch (requestError) {
        const message = requestError.response?.data?.message ?? requestError.message ?? 'Unable to delete goal.'
        setError(message)
        showError(message)
        throw requestError
      }
    },
    [fetchGoals, isGuest, refreshStats, showError, showSuccess]
  )

  const value = useMemo(
    () => ({ goals, isLoading, error, fetchGoals, createGoal, updateGoal, deleteGoal }),
    [createGoal, deleteGoal, error, fetchGoals, goals, isLoading, updateGoal]
  )

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
}

export const useGoals = () => {
  const context = useContext(GoalsContext)

  if (!context) {
    throw new Error('useGoals must be used within GoalsProvider')
  }

  return context
}
