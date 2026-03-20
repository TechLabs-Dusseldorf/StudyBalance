import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { getGoals, getStats, getTasks } from '../services/apiService'
import { getGuestGoals, getGuestSessions, getGuestTasks } from '../utils/localStorage'
import { useAuth } from './AuthContext'

const StatsContext = createContext(null)

const EMPTY_STATS = {
  totalStudyMinutes: 0,
  completedTasksCount: 0,
  activeTasksCount: 0,
  activeGoalsCount: 0,
  goalsAddedCount: 0,
}

const PERIODS = ['today', 'thisWeek', 'allTime']

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

const getValidDate = (value) => {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const isWithinPeriod = (value, period) => {
  if (period === 'allTime') {
    return true
  }

  const date = getValidDate(value)
  if (!date) {
    return false
  }

  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  if (period === 'today') {
    return date >= startOfToday
  }

  const startOfWeek = new Date(startOfToday)
  const weekdayOffset = (startOfWeek.getDay() + 6) % 7
  startOfWeek.setDate(startOfWeek.getDate() - weekdayOffset)
  return date >= startOfWeek
}

const getNestedNumber = (payload, path) => {
  const value = path.reduce((current, key) => current?.[key], payload)
  return typeof value === 'number' ? value : null
}

const deriveStudyMinutesForPeriod = (statsPayload, period) => {
  if (period === 'allTime') {
    return deriveTotalStudyMinutes(statsPayload)
  }

  const candidatePaths =
    period === 'today'
      ? [
          ['studyMinutesByPeriod', 'today'],
          ['periods', 'today', 'totalStudyMinutes'],
          ['today', 'totalStudyMinutes'],
          ['todayStudyMinutes'],
          ['totalStudyMinutesToday'],
          ['studyMinutesToday'],
        ]
      : [
          ['studyMinutesByPeriod', 'thisWeek'],
          ['periods', 'thisWeek', 'totalStudyMinutes'],
          ['thisWeek', 'totalStudyMinutes'],
          ['thisWeekStudyMinutes'],
          ['weeklyStudyMinutes'],
          ['totalStudyMinutesThisWeek'],
          ['studyMinutesThisWeek'],
        ]

  for (const path of candidatePaths) {
    const value = getNestedNumber(statsPayload, path)
    if (value !== null) {
      return value
    }
  }

  const sessions = normalizeList(statsPayload?.sessions ?? statsPayload?.studySessions ?? [], 'sessions')
  if (sessions.length > 0) {
    return sessions.reduce(
      (sum, session) =>
        isWithinPeriod(session.completedAt ?? session.createdAt, period) ? sum + (session.duration ?? 0) : sum,
      0
    )
  }

  return deriveTotalStudyMinutes(statsPayload)
}

const buildPeriodStats = ({ tasks, goals, sessions, statsPayload }) => {
  const activeGoalsCount =
    typeof statsPayload?.activeGoalsCount === 'number'
      ? statsPayload.activeGoalsCount
      : goals.filter((goal) => !goal.isCompleted).length

  return PERIODS.reduce((accumulator, period) => {
    const completedTasks =
      period === 'allTime'
        ? tasks.filter((task) => task.isCompleted)
        : tasks.filter(
            (task) => task.isCompleted && isWithinPeriod(task.completedAt ?? task.updatedAt ?? task.createdAt, period)
          )

    const activeTasks =
      period === 'allTime'
        ? tasks.filter((task) => !task.isCompleted)
        : tasks.filter((task) => !task.isCompleted && isWithinPeriod(task.createdAt ?? task.updatedAt, period))

    const goalsAdded =
      period === 'allTime'
        ? goals
        : goals.filter((goal) => isWithinPeriod(goal.createdAt ?? goal.targetDate ?? goal.updatedAt, period))

    return {
      ...accumulator,
      [period]: {
        totalStudyMinutes:
          sessions.length > 0
            ? sessions.reduce(
                (sum, session) =>
                  isWithinPeriod(session.completedAt ?? session.createdAt, period)
                    ? sum + (session.duration ?? 0)
                    : sum,
                0
              )
            : deriveStudyMinutesForPeriod(statsPayload, period),
        completedTasksCount:
          period === 'allTime' && typeof statsPayload?.completedTasksCount === 'number'
            ? statsPayload.completedTasksCount
            : completedTasks.length,
        activeTasksCount:
          period === 'allTime' && typeof statsPayload?.activeTasksCount === 'number'
            ? statsPayload.activeTasksCount
            : activeTasks.length,
        activeGoalsCount,
        goalsAddedCount: goalsAdded.length,
      },
    }
  }, {})
}

export function StatsProvider({ children }) {
  const { isAuthenticated, isGuest } = useAuth()
  const [stats, setStats] = useState(EMPTY_STATS)
  const [statsByPeriod, setStatsByPeriod] = useState({
    today: EMPTY_STATS,
    thisWeek: EMPTY_STATS,
    allTime: EMPTY_STATS,
  })
  const [isLoading, setIsLoading] = useState(true)

  const refreshStats = useCallback(async () => {
    setIsLoading(true)

    try {
      if (isGuest) {
        const tasks = getGuestTasks()
        const goals = getGuestGoals()
        const sessions = getGuestSessions()
        const nextStatsByPeriod = buildPeriodStats({ tasks, goals, sessions, statsPayload: {} })

        setStatsByPeriod(nextStatsByPeriod)
        setStats(nextStatsByPeriod.allTime)
        return
      }

      if (isAuthenticated) {
        const [statsResult, tasksResult, goalsResult] = await Promise.allSettled([getStats(), getTasks(), getGoals()])
        const tasks = tasksResult.status === 'fulfilled' ? normalizeList(tasksResult.value, 'tasks') : []
        const goals = goalsResult.status === 'fulfilled' ? normalizeList(goalsResult.value, 'goals') : []
        const statsPayload = statsResult.status === 'fulfilled' ? statsResult.value : {}
        const nextStatsByPeriod = buildPeriodStats({ tasks, goals, sessions: [], statsPayload })

        setStatsByPeriod(nextStatsByPeriod)
        setStats(nextStatsByPeriod.allTime)
        return
      }

      setStats(EMPTY_STATS)
      setStatsByPeriod({ today: EMPTY_STATS, thisWeek: EMPTY_STATS, allTime: EMPTY_STATS })
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, isGuest])

  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  const value = useMemo(
    () => ({ stats, statsByPeriod, refreshStats, isLoading }),
    [isLoading, refreshStats, stats, statsByPeriod]
  )
  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

export const useStats = () => {
  const context = useContext(StatsContext)

  if (!context) {
    throw new Error('useStats must be used within StatsProvider')
  }

  return context
}
