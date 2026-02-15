import { Link as RouterLink } from 'react-router'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Controller } from 'react-hook-form'
import { useRegisterForm } from '../hooks/UseRegisterForm'

const COLORS = {
  page: '#10221c',
  panel: '#19332b',
  panelBorder: '#326755',
  muted: '#92c9b7',
  heading: '#f4fbf8',
  primary: '#13eca4',
}

const getStrengthMeta = (value) => {
  if (value >= 100) return { filledBars: 4, label: 'Strong' }
  if (value >= 66) return { filledBars: 3, label: 'Medium' }
  if (value >= 33) return { filledBars: 2, label: 'Weak' }
  return { filledBars: 0, label: 'Weak' }
}

const TopNav = () => (
  <Box
    component="header"
    sx={{
      height: 65,
      borderBottom: `1px solid ${COLORS.panelBorder}4D`,
      px: { xs: 2, md: 4 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      backdropFilter: 'blur(10px)',
      zIndex: 5,
      bgcolor: 'rgba(16, 34, 28, 0.75)',
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <SchoolRoundedIcon sx={{ color: COLORS.primary }} />
      <Typography fontWeight={800} sx={{ color: COLORS.heading, letterSpacing: '-0.01em' }}>
        Studybalance
      </Typography>
    </Stack>

    <Stack direction="row" spacing={1.25} alignItems="center">
      <Typography sx={{ color: COLORS.muted, display: { xs: 'none', sm: 'block' }, fontSize: 13 }}>
        Already have an account?
      </Typography>
      <Button
        component={RouterLink}
        to="/login"
        sx={{
          bgcolor: '#23483c',
          color: '#fff',
          px: 2,
          py: 1,
          fontWeight: 700,
          borderRadius: 2,
          '&:hover': { bgcolor: '#2d5c4d' },
        }}
      >
        Log in
      </Button>
    </Stack>
  </Box>
)

const FormField = ({ control, name, label, placeholder, type, autoComplete, icon }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <Box>
        <Typography sx={{ color: COLORS.heading, fontSize: 13, mb: 0.5, fontWeight: 600 }}>{label}</Typography>
        <TextField
          {...field}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
          fullWidth
          error={Boolean(error)}
          helperText={error?.message || ' '}
          FormHelperTextProps={{ sx: { m: 0, minHeight: 20 } }}
          InputProps={{
            startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
            sx: {
              color: COLORS.heading,
              bgcolor: COLORS.panel,
              borderRadius: 2,
              '& fieldset': { borderColor: COLORS.panelBorder },
              '&:hover fieldset': { borderColor: '#3b7c66' },
              '&.Mui-focused fieldset': { borderColor: COLORS.primary },
            },
          }}
        />
      </Box>
    )}
  />
)

const PasswordStrengthMeter = ({ value }) => {
  const { filledBars, label } = getStrengthMeta(value)

  return (
    <Box sx={{ mt: -1 }}>
      <Stack direction="row" spacing={1}>
        {[0, 1, 2, 3].map((item) => (
          <Box
            key={item}
            sx={{
              height: 4,
              flex: 1,
              borderRadius: 999,
              bgcolor: item < filledBars ? COLORS.primary : 'rgba(50, 103, 85, 0.3)',
              transition: 'background-color 220ms ease',
            }}
          />
        ))}
      </Stack>
      <Typography sx={{ color: COLORS.muted, fontSize: 12, mt: 0.75 }}>{label}</Typography>
    </Box>
  )
}

const HeroPanel = () => (
  <Box
    sx={{
      width: '50%',
      display: { xs: 'none', lg: 'flex' },
      flexDirection: 'column',
      justifyContent: 'center',
      px: 8,
      background: 'linear-gradient(135deg, #11221c 0%, #1a3d32 100%)',
      borderRight: `1px solid ${COLORS.panelBorder}4D`,
    }}
  >
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${COLORS.primary}33`,
          boxShadow: '0 22px 40px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTjHmF-2hpehyE4NEjWF-HavuNWIRHqENFXU8_rwj-7SLxLDVUlyMHedCCWYjLXz30LuB-9CDW98CR_k8HVvvXq2eoAsf_TGCFGrKlDpuKg-2r0yS4AmkprYWmNqlPh7Q3k83K_V5Dv_whN1K6LLFpyltZVtm5MPfn7y6bSksHWbFSOHGfESMlQaC4b-CJxYtc4GJzO5_Q1tYC8_zduy-pjmJsVQkx1bzn3NY6iWiMagveGm-Gj7FjM-wdxuLu07kq_5zHLAvvOKkr"
          alt="Student learning illustration"
          sx={{ width: '100%', display: 'block' }}
        />
      </Box>

      <Typography sx={{ color: COLORS.heading, fontSize: 48, fontWeight: 900, lineHeight: 1.05, mb: 2 }}>
        Your future self will <Box component="span" sx={{ color: COLORS.primary }}>thank you.</Box>
      </Typography>

      <Typography sx={{ color: COLORS.muted, fontSize: 20, lineHeight: 1.6 }}>
        Join students mastering new skills today. Unlock your full potential with curated learning paths.
      </Typography>
    </Box>
  </Box>
)

const ProgressHeader = () => (
  <Stack spacing={1.25}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={{ color: COLORS.heading, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>
        STEP 1: ACCOUNT DETAILS
      </Typography>
      <Typography sx={{ color: COLORS.primary, fontSize: 13, fontWeight: 800 }}>33%</Typography>
    </Stack>
    <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'rgba(50, 103, 85, 0.3)' }}>
      <Box
        sx={{
          width: '33%',
          height: '100%',
          borderRadius: 999,
          bgcolor: COLORS.primary,
          boxShadow: '0 0 16px rgba(19, 236, 164, 0.55)',
        }}
      />
    </Box>
    <Typography sx={{ color: COLORS.muted, fontSize: 12, fontStyle: 'italic' }}>
      Just a few moments to get you started!
    </Typography>
  </Stack>
)

const RegisterFormPanel = ({ form, submit, apiError, isPending, passwordStrength }) => (
  <Box sx={{ width: { xs: '100%', lg: '50%' }, display: 'flex', justifyContent: 'center', px: { xs: 2, md: 4 }, py: 4 }}>
    <Box sx={{ width: '100%', maxWidth: 490 }}>
      <Stack spacing={3}>
        <ProgressHeader />

        <Box>
          <Typography sx={{ color: COLORS.heading, fontSize: 34, fontWeight: 800, lineHeight: 1.2 }}>
            Create your account
          </Typography>
        </Box>

        {apiError ? (
          <Alert severity="error" sx={{ bgcolor: 'rgba(211, 47, 47, 0.14)', color: '#ffd9d9' }}>
            {apiError}
          </Alert>
        ) : null}

        <Box component="form" onSubmit={submit} noValidate>
          <Stack spacing={0.5}>
            <FormField
              control={form.control}
              name="fullName"
              label="Full Name"
              type="text"
              placeholder="Alex Johnson"
              autoComplete="name"
              icon={<PersonOutlineRoundedIcon sx={{ color: COLORS.muted }} />}
            />

            <FormField
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              autoComplete="email"
              icon={<MailOutlineRoundedIcon sx={{ color: COLORS.muted }} />}
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              icon={<LockOutlinedIcon sx={{ color: COLORS.muted }} />}
            />
            <PasswordStrengthMeter value={passwordStrength.value} />

            <FormField
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              icon={<LockOutlinedIcon sx={{ color: COLORS.muted }} />}
            />

            <Button
              type="submit"
              disabled={isPending}
              endIcon={!isPending ? <ArrowForwardRoundedIcon /> : null}
              sx={{
                mt: 2,
                py: 1.4,
                borderRadius: 2,
                fontWeight: 800,
                bgcolor: COLORS.primary,
                color: '#11221c',
                textTransform: 'none',
                '&:hover': { bgcolor: '#0fe09c' },
              }}
            >
              {isPending ? <CircularProgress size={20} sx={{ color: '#11221c' }} /> : 'Join the Journey'}
            </Button>
          </Stack>
        </Box>

        <Typography sx={{ color: COLORS.muted, fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
          By joining, you agree to our{' '}
          <Link href="#" sx={{ color: COLORS.primary, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" sx={{ color: COLORS.primary, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Privacy Policy
          </Link>
          .
        </Typography>
      </Stack>
    </Box>
  </Box>
)

const RegisterPage = () => {
  const { form, submit, apiError, isPending, passwordStrength } = useRegisterForm()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: COLORS.page }}>
      <TopNav />
      <Box sx={{ minHeight: 'calc(100vh - 65px)', display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
        <HeroPanel />
        <RegisterFormPanel
          form={form}
          submit={submit}
          apiError={apiError}
          isPending={isPending}
          passwordStrength={passwordStrength}
        />
      </Box>
    </Box>
  )
}

export default RegisterPage
