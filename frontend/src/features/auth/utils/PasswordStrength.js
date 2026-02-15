const hasLowercase = (value) => /[a-z]/.test(value)
const hasUppercase = (value) => /[A-Z]/.test(value)
const hasDigit = (value) => /\d/.test(value)
const hasSymbol = (value) => /[^A-Za-z0-9]/.test(value)

const getStrengthScore = (password) => {
  if (!password) {
    return 0
  }

  const checks = [
    password.length >= 8,
    password.length >= 12,
    hasLowercase(password),
    hasUppercase(password),
    hasDigit(password),
    hasSymbol(password),
  ]

  return checks.filter(Boolean).length
}

export const getPasswordStrength = (password) => {
  const score = getStrengthScore(password)

  if (score <= 2) {
    return { label: 'Weak', value: 33, color: 'error' }
  }

  if (score <= 4) {
    return { label: 'Medium', value: 66, color: 'warning' }
  }

  return { label: 'Strong', value: 100, color: 'success' }
}
