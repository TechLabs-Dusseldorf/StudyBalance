import { useMutation } from '@tanstack/react-query'

export const AUTH_TOKEN_KEY = 'authToken'

const parseErrorMessage = async (response) => {
  try {
    const data = await response.json()
    return data?.message || data?.error?.message || 'Registration failed. Please try again.'
  } catch {
    return 'Registration failed. Please try again.'
  }
}

export const registerUser = async ({ email, password }) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}

export const extractToken = (responseData) =>
  responseData?.token || responseData?.jwt || responseData?.data?.token || responseData?.data?.jwt || null

export const useRegisterMutation = () => useMutation({ mutationFn: registerUser })
