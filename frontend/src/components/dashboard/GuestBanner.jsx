import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

function GuestBanner() {
  const { isGuest } = useAuth()
  const navigate = useNavigate()

  if (!isGuest) {
    return null
  }

  return (
    <Card
      elevation={0}
      sx={{
        mx: { xs: 2, md: 3 },
        mt: 2,
        p: 2,
        borderRadius: 3,
        border: '1px solid #f1d29a',
        backgroundColor: '#fff8ea',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CampaignRoundedIcon sx={{ color: '#b77700' }} />
          <Typography sx={{ color: '#6d4b00', fontWeight: 600 }}>
            You're using Guest Mode - data stays on this device until you register.
          </Typography>
        </Stack>
        <Button variant="contained" onClick={() => navigate('/register')} sx={{ backgroundColor: '#b77700' }}>
          Save your progress
        </Button>
      </Stack>
    </Card>
  )
}

export default GuestBanner
