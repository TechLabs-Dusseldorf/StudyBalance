import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const LOGIN_ROUTE = '/login'

const readUserSession = () => {
  const isGuestFlag = localStorage.getItem('isGuest') === 'true'
  const userName = localStorage.getItem('userName') ?? localStorage.getItem('name') ?? ''
  const userEmail = localStorage.getItem('userEmail') ?? localStorage.getItem('email') ?? ''
  const isGuest = isGuestFlag || (userName.length === 0 && userEmail.length === 0)
  return { isGuest, userName, userEmail }
}

const getAvatarLetter = (isGuest, userName, userEmail) => {
  if (isGuest) {
    return 'G'
  }

  const reference = userName || userEmail
  return reference.charAt(0).toUpperCase() || 'U'
}

function NavbarUserSection({ isGuest, onLogout, userEmail, userName }) {
  const primaryIdentity = isGuest ? 'Guest User' : userName || 'User'
  const secondaryIdentity = isGuest ? 'Limited access' : userEmail || 'No email provided'
  const logoutLabel = isGuest ? 'Exit Guest' : 'Logout'
  const guestChipDisplay = isGuest ? 'inline-flex' : 'none'

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Chip label="Guest Mode" size="small" color="warning" variant="outlined" sx={{ display: guestChipDisplay }} />
      <Avatar sx={{ width: 34, height: 34, bgcolor: '#0d6e8a' }}>
        {getAvatarLetter(isGuest, userName, userEmail)}
      </Avatar>
      <Stack spacing={0} sx={{ maxWidth: { xs: 110, sm: 220 }, display: { xs: 'none', sm: 'flex' } }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: '#12324a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {primaryIdentity}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: '#4d667a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {secondaryIdentity}
        </Typography>
      </Stack>
      <Button
        startIcon={<ExitToAppRoundedIcon />}
        variant="outlined"
        size="small"
        sx={{ borderColor: '#0d6e8a', color: '#0d6e8a' }}
        onClick={onLogout}
      >
        {logoutLabel}
      </Button>
    </Stack>
  )
}

function Navbar() {
  const { isGuest, userName, userEmail } = readUserSession()

  const handleLogout = () => {
    localStorage.clear()
    window.location.assign(LOGIN_ROUTE)
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffffcc',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #d9e1ea',
        color: '#12324a',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <SchoolRoundedIcon sx={{ color: '#0d6e8a' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Study Dashboard
          </Typography>
        </Stack>
        <NavbarUserSection isGuest={isGuest} onLogout={handleLogout} userEmail={userEmail} userName={userName} />
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
