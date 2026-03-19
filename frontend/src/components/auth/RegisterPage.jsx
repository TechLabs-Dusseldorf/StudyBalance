import { useMemo, useState } from 'react'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

const getPasswordStrength = (password) => {
  if (password.length < 6) {
    return { label: 'Weak', value: 25, color: 'error' }
  }

  if (password.length < 10 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return { label: 'Medium', value: 60, color: 'warning' }
  }

  return { label: 'Strong', value: 100, color: 'success' }
}

function RegisterPage() {
  const { register, isGuest } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password])
  const emailError = form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Enter a valid email.' : ''
  const passwordError = form.confirmPassword && form.password !== form.confirmPassword ? 'Passwords do not match.' : ''

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (emailError || passwordError) {
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await register({ email: form.email, password: form.password })
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Registration failed. Please try again.')
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
          maxWidth: 520,
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
                Create account
              </Typography>
            </Stack>
            <Typography color="#4d667a">
              {isGuest
                ? 'Register to save your guest progress to your account.'
                : 'Register to keep your study data synced.'}
            </Typography>
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={Boolean(emailError)}
              helperText={emailError || ' '}
              required
            />
            <Stack spacing={1}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <LinearProgress
                variant="determinate"
                value={strength.value}
                color={strength.color}
                sx={{ height: 8, borderRadius: 999 }}
              />
              <Typography variant="caption" color="#4d667a">
                Strength: {strength.label}
              </Typography>
            </Stack>
            <TextField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={Boolean(passwordError)}
              helperText={passwordError || ' '}
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading || Boolean(emailError) || Boolean(passwordError)}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <HowToRegRoundedIcon />}
              sx={{ backgroundColor: '#0d6e8a' }}
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </Stack>

          <Typography color="#4d667a">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700 }}>
              Login
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  )
}

export default RegisterPage
