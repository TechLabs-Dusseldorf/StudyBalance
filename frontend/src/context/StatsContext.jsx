import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { getGoals, getStats, getTasks } from '../services/apiService'
import { getGuestGoals, getGuestSessions, getGuestTasks } from '../utils/localStorage'
import { useAuth } from './AuthContext'

const StatsContext = createContext(null)

const normalizeList = (payload, key) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.[key])) {
    return payload[key]
  }

  return []
}

const deriveTotalStudyMinutes = (statsPayload) => {
  if (typeof statsPayload?.totalStudyMinutes === 'number') {
    return statsPayload.totalStudyMinutes
  }

  if (typeof statsPayload?.totalStudyTime === 'number') {
    return statsPayload.totalStudyTime
  }

  if (typeof statsPayload?.totalStudyHours === 'number') {
    return Math.round(statsPayload.totalStudyHours * 60)
  }

  return 0
}

export function StatsProvider({ children }) {
  const { isAuthenticated, isGuest } = useAuth()
  const [stats, setStats] = useState({
    totalStudyMinutes: 0,
    completedTasksCount: 0,
    activeTasksCount: 0,
    activeGoalsCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const refreshStats = useCallback(async () => {
    setIsLoading(true)

    try {
      if (isGuest) {
        const tasks = getGuestTasks()
        const goals = getGuestGoals()
        const sessions = getGuestSessions()

        setStats({
          totalStudyMinutes: sessions.reduce((sum, session) => sum + (session.duration ?? 0), 0),
          completedTasksCount: tasks.filter((task) => task.isCompleted).length,
          activeTasksCount: tasks.filter((task) => !task.isCompleted).length,
          activeGoalsCount: goals.length,
        })
        return
      }

      if (isAuthenticated) {
        const [statsResult, tasksResult, goalsResult] = await Promise.allSettled([getStats(), getTasks(), getGoals()])
        const tasks = tasksResult.status === 'fulfilled' ? normalizeList(tasksResult.value, 'tasks') : []
        const goals = goalsResult.status === 'fulfilled' ? normalizeList(goalsResult.value, 'goals') : []
        const statsPayload = statsResult.status === 'fulfilled' ? statsResult.value : {}

        setStats({
          totalStudyMinutes: deriveTotalStudyMinutes(statsPayload),
          completedTasksCount:
            typeof statsPayload.completedTasksCount === 'number'
              ? statsPayload.completedTasksCount
              : tasks.filter((task) => task.isCompleted).length,
          activeTasksCount:
            typeof statsPayload.activeTasksCount === 'number'
              ? statsPayload.activeTasksCount
              : tasks.filter((task) => !task.isCompleted).length,
          activeGoalsCount:
            typeof statsPayload.activeGoalsCount === 'number' ? statsPayload.activeGoalsCount : goals.length,
        })
        return
      }

      setStats({ totalStudyMinutes: 0, completedTasksCount: 0, activeTasksCount: 0, activeGoalsCount: 0 })
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, isGuest])

  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  const value = useMemo(() => ({ stats, refreshStats, isLoading }), [isLoading, refreshStats, stats])
  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

export const useStats = () => {
  const context = useContext(StatsContext)

  if (!context) {
    throw new Error('useStats must be used within StatsProvider')
  }

  return context
}
