import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function PomodoroCard() {
  return (
    <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dce4ee', backgroundColor: '#ffffffea' }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#15364f' }}>
          Pomodoro
        </Typography>

        <Box
          sx={{
            height: 120,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #e6f6ff 0%, #e9fff3 100%)',
          }}
        >
          <TimerRoundedIcon sx={{ fontSize: 54, color: '#0d6e8a' }} />
        </Box>

        <Button startIcon={<PlayArrowRoundedIcon />} variant="contained" sx={{ backgroundColor: '#0d6e8a' }}>
          Start
        </Button>
      </Stack>
    </Card>
  )
}

export default PomodoroCard
