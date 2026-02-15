import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { registerSchema } from '../schemas/AuthSchemas'
import { AUTH_TOKEN_KEY, extractToken, useRegisterMutation } from '../services/AuthApi'
import { getPasswordStrength } from '../utils/PasswordStrength'

const DEFAULT_VALUES = { fullName: '', email: '', password: '', confirmPassword: '' }

export const useRegisterForm = () => {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const registerMutation = useRegisterMutation()

  const form = useForm({ resolver: zodResolver(registerSchema), defaultValues: DEFAULT_VALUES, mode: 'onChange' })
  const password = form.watch('password')
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  const submit = form.handleSubmit(async ({ email, password: rawPassword }) => {
    setApiError('')

    try {
      const response = await registerMutation.mutateAsync({ email, password: rawPassword })
      const token = extractToken(response)

      if (!token) {
        throw new Error('Registration succeeded but no token was returned. Please log in manually.')
      }

      localStorage.setItem(AUTH_TOKEN_KEY, token)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setApiError(error?.message || 'Registration failed. Please try again.')
    }
  })

  return { form, submit, apiError, isPending: registerMutation.isPending, passwordStrength }
}
