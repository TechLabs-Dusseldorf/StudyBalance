import { createBrowserRouter, Navigate } from 'react-router'
import RegisterPage from '@/features/auth/pages/RegisterPage'

const LoginRoutePlaceholder = () => <div>Login page</div>
const DashboardRoutePlaceholder = () => <div>Dashboard page</div>

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/register" replace /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/login', element: <LoginRoutePlaceholder /> },
  { path: '/dashboard', element: <DashboardRoutePlaceholder /> },
])
