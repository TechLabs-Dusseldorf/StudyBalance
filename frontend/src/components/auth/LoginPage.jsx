import { useState } from 'react'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

function LoginPage() {
  const { login, loginAsGuest } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(form)
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 4 }}>
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: '1px solid #dce4ee',
          backgroundColor: '#fffffff2',
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AutoStoriesRoundedIcon sx={{ color: '#0d6e8a' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#15364f' }}>
                StudyBalance
              </Typography>
            </Stack>
            <Typography color="#4d667a">Log in to manage tasks, goals, and focused study sessions.</Typography>
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <LoginRoundedIcon />}
              sx={{ backgroundColor: '#0d6e8a' }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Stack>

          <Button
            variant="outlined"
            startIcon={<PersonOutlineRoundedIcon />}
            onClick={loginAsGuest}
            sx={{ borderColor: '#0d6e8a', color: '#0d6e8a' }}
          >
            Continue as Guest
          </Button>

          <Typography color="#4d667a">
            New user?{' '}
            <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 700 }}>
              Register
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  )
}

export default LoginPage
