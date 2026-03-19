import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useTimer } from '../../context/TimerContext'
import { formatTimer } from '../../utils/dateUtils'

function PomodoroCard() {
  const { timeRemaining, openTimerModal } = useTimer()

  return (
    <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dce4ee', backgroundColor: '#ffffffea' }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#15364f' }}>
          Pomodoro Timer
        </Typography>

        <Box
          sx={{
            height: 140,
            borderRadius: 3,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #e6f6ff 0%, #e9fff3 100%)',
          }}
        >
          <Stack spacing={1} alignItems="center">
            <TimerRoundedIcon sx={{ fontSize: 54, color: '#0d6e8a' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0d6e8a' }}>
              {formatTimer(timeRemaining)}
            </Typography>
          </Stack>
        </Box>

        <Button
          startIcon={<PlayArrowRoundedIcon />}
          variant="contained"
          sx={{ backgroundColor: '#0d6e8a' }}
          onClick={openTimerModal}
        >
          Start Focus Session
        </Button>
      </Stack>
    </Card>
  )
}

export default PomodoroCard
