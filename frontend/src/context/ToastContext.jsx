import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [queue, setQueue] = useState([])
  const [currentToast, setCurrentToast] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const showToast = useCallback(({ message, severity = 'info', duration = 4000 }) => {
    if (!message) {
      return
    }

    const toast = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, message, severity, duration }

    setQueue((currentQueue) => [...currentQueue, toast])
  }, [])

  const handleClose = useCallback((_, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setIsOpen(false)
  }, [])

  const handleExited = useCallback(() => {
    setCurrentToast(null)
  }, [])

  useEffect(() => {
    if (currentToast || queue.length === 0) {
      return
    }

    setCurrentToast(queue[0])
    setQueue((currentQueue) => currentQueue.slice(1))
    setIsOpen(true)
  }, [currentToast, queue])

  const value = useMemo(
    () => ({
      showToast,
      showSuccess: (message, duration) => showToast({ message, severity: 'success', duration }),
      showError: (message, duration) => showToast({ message, severity: 'error', duration }),
      showWarning: (message, duration) => showToast({ message, severity: 'warning', duration }),
      showInfo: (message, duration) => showToast({ message, severity: 'info', duration }),
    }),
    [showToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={isOpen}
        autoHideDuration={currentToast?.duration ?? 4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert
          onClose={handleClose}
          severity={currentToast?.severity ?? 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {currentToast?.message ?? ''}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
