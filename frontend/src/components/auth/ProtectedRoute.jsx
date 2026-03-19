import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isGuest, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center" spacing={2}>
        <CircularProgress />
        <Typography>Checking session...</Typography>
      </Stack>
    )
  }

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
