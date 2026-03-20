import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { createSession } from '../services/apiService'
import { createClientId, getGuestSessions, setGuestSessions } from '../utils/localStorage'
import { useAuth } from './AuthContext'
import { useGoals } from './GoalsContext'
import { useStats } from './StatsContext'
import { useToast } from './ToastContext'

const TimerContext = createContext(null)

const SESSION_LENGTHS = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 }
const FOCUS_SESSION_MINUTES = SESSION_LENGTHS.focus / 60
const getElapsedFocusMinutes = (timeRemaining) => Math.max(0, FOCUS_SESSION_MINUTES - timeRemaining / 60)

export function TimerProvider({ children }) {
  const { isGuest } = useAuth()
  const { refreshStats } = useStats()
  const { fetchGoals } = useGoals()
  const { showError, showSuccess } = useToast()
  const [sessionType, setSessionType] = useState('focus')
  const [timeRemaining, setTimeRemaining] = useState(SESSION_LENGTHS.focus)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const persistSession = useCallback(
    async (duration) => {
      if (duration <= 0) {
        return
      }

      const sessionData = { id: createClientId(), duration, type: 'focus', completedAt: new Date().toISOString() }

      try {
        if (isGuest) {
          const sessions = [sessionData, ...getGuestSessions()]
          setGuestSessions(sessions)
        } else {
          await createSession(sessionData)
        }

        await refreshStats()
        await fetchGoals()
      } catch (requestError) {
        showError(requestError.response?.data?.message ?? requestError.message ?? 'Unable to save your focus session.')
      }
    },
    [fetchGoals, isGuest, refreshStats, showError]
  )

  const resetTimer = useCallback(
    (nextType = sessionType) => {
      if (sessionType === 'focus' && nextType === 'focus') {
        const elapsedDuration = getElapsedFocusMinutes(timeRemaining)

        if (elapsedDuration > 0) {
          void persistSession(elapsedDuration)
        }
      }

      setIsRunning(false)
      setSessionType(nextType)
      setTimeRemaining(SESSION_LENGTHS[nextType])
    },
    [persistSession, sessionType, timeRemaining]
  )

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      setTimeRemaining((currentTime) => {
        if (currentTime > 1) {
          return currentTime - 1
        }

        setIsRunning(false)

        if (sessionType === 'focus') {
          const nextCount = sessionCount + 1
          const nextType = nextCount % 4 === 0 ? 'longBreak' : 'shortBreak'
          setSessionCount(nextCount)
          setSessionType(nextType)
          showSuccess('Focus session complete! Time for a break.')
          void persistSession(FOCUS_SESSION_MINUTES)
          return SESSION_LENGTHS[nextType]
        }

        setSessionType('focus')
        return SESSION_LENGTHS.focus
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [isRunning, persistSession, sessionCount, sessionType, showSuccess])

  const startTimer = useCallback(() => setIsRunning(true), [])
  const pauseTimer = useCallback(() => setIsRunning(false), [])
  const openTimerModal = useCallback(() => setIsModalOpen(true), [])
  const closeTimerModal = useCallback(() => setIsModalOpen(false), [])

  const value = useMemo(
    () => ({
      timeRemaining,
      isRunning,
      sessionType,
      sessionCount,
      isModalOpen,
      startTimer,
      pauseTimer,
      resetTimer,
      openTimerModal,
      closeTimerModal,
      totalDuration: SESSION_LENGTHS[sessionType],
    }),
    [
      closeTimerModal,
      isModalOpen,
      isRunning,
      openTimerModal,
      pauseTimer,
      resetTimer,
      sessionCount,
      sessionType,
      timeRemaining,
    ]
  )

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

export const useTimer = () => {
  const context = useContext(TimerContext)

  if (!context) {
    throw new Error('useTimer must be used within TimerProvider')
  }

  return context
}
