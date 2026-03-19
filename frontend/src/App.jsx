import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from './components/auth/LoginPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RegisterPage from './components/auth/RegisterPage'
import Dashboard from './components/dashboard/Dashboard'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GoalsProvider } from './context/GoalsContext'
import { StatsProvider } from './context/StatsContext'
import { TasksProvider } from './context/TasksContext'
import { TimerProvider } from './context/TimerContext'
import { ToastProvider } from './context/ToastContext'

function PublicOnlyRoute({ children, allowGuest = false }) {
  const { isAuthenticated, isGuest, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated || (isGuest && !allowGuest)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute allowGuest>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StatsProvider>
          <TasksProvider>
            <GoalsProvider>
              <TimerProvider>
                <AppRoutes />
              </TimerProvider>
            </GoalsProvider>
          </TasksProvider>
        </StatsProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
