import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useTimer } from '../../context/TimerContext'
import { formatTimer } from '../../utils/dateUtils'

const LABELS = { focus: 'Focus Session', shortBreak: 'Short Break', longBreak: 'Long Break' }

function TimerModal() {
  const {
    isModalOpen,
    closeTimerModal,
    timeRemaining,
    totalDuration,
    sessionType,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer()
  const progressValue = ((totalDuration - timeRemaining) / totalDuration) * 100

  return (
    <Dialog open={isModalOpen} onClose={closeTimerModal} fullWidth maxWidth="xs">
      <DialogTitle>{LABELS[sessionType]}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ py: 1, alignItems: 'center' }}>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#15364f' }}>
              {formatTimer(timeRemaining)}
            </Typography>
            <Typography color="#607487">Stay focused until the countdown ends.</Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{ width: '100%', height: 10, borderRadius: 999 }}
          />

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<PlayArrowRoundedIcon />}
              onClick={startTimer}
              disabled={isRunning}
              sx={{ backgroundColor: '#0d6e8a' }}
            >
              Start
            </Button>
            <Button variant="outlined" startIcon={<PauseRoundedIcon />} onClick={pauseTimer} disabled={!isRunning}>
              Pause
            </Button>
            <Button variant="outlined" startIcon={<RestartAltRoundedIcon />} onClick={() => resetTimer()}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default TimerModal
