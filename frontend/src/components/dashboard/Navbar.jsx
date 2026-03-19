import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { useAuth } from '../../context/AuthContext'

const getAvatarLetter = (user, isGuest) => {
  if (isGuest) {
    return 'G'
  }

  return (user?.name || user?.email || 'U').charAt(0).toUpperCase()
}

function Navbar() {
  const { user, isGuest, logout } = useAuth()

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
            StudyBalance
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {isGuest ? <Chip label="Guest Mode" size="small" color="warning" variant="outlined" /> : null}
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#0d6e8a' }}>{getAvatarLetter(user, isGuest)}</Avatar>
          <Stack spacing={0} sx={{ maxWidth: { xs: 120, sm: 220 }, display: { xs: 'none', sm: 'flex' } }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: '#12324a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isGuest ? 'Guest User' : user?.name || 'Study User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#4d667a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {isGuest ? 'Local-only progress' : user?.email || 'No email provided'}
            </Typography>
          </Stack>
          <Button
            startIcon={<ExitToAppRoundedIcon />}
            variant="outlined"
            size="small"
            sx={{ borderColor: '#0d6e8a', color: '#0d6e8a' }}
            onClick={() => logout()}
          >
            {isGuest ? 'Exit Guest' : 'Logout'}
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
