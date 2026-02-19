import AddRoundedIcon from '@mui/icons-material/AddRounded'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const GOALS = ['3 Pomodoro sessions', 'Finish lab report', 'Review 20 flashcards']

function GoalsCard() {
  return (
    <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dce4ee', backgroundColor: '#ffffffea' }}>
      <Stack spacing={1.5}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#15364f' }}>
          Goals
        </Typography>

        <Button
          startIcon={<AddRoundedIcon />}
          variant="outlined"
          sx={{ alignSelf: 'start', borderColor: '#0d6e8a', color: '#0d6e8a' }}
        >
          Add Goal
        </Button>

        <List disablePadding>
          {GOALS.map((goal) => (
            <ListItem key={goal} disableGutters sx={{ py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 34 }}>
                <FlagRoundedIcon fontSize="small" sx={{ color: '#0d6e8a' }} />
              </ListItemIcon>
              <ListItemText primary={goal} primaryTypographyProps={{ fontSize: '0.95rem' }} />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Card>
  )
}

export default GoalsCard
