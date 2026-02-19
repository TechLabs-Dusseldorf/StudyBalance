import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const TAGS = ['All', 'Exam', 'Reading', 'Project', 'Review']

const TASKS = [
  { id: 1, title: 'Review chapter 5 notes', subtitle: 'Physics | due today' },
  { id: 2, title: 'Complete practice quiz', subtitle: 'Math | 35 min estimate' },
  { id: 3, title: 'Write summary for article', subtitle: 'English | high priority' },
]

function TaskSearchField() {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search tasks"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

function TaskFilterChips() {
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {TAGS.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          clickable
          color={tag === 'All' ? 'primary' : 'default'}
          variant={tag === 'All' ? 'filled' : 'outlined'}
        />
      ))}
    </Stack>
  )
}

function TaskItemsList() {
  return (
    <List disablePadding>
      {TASKS.map((task) => (
        <ListItem
          key={task.id}
          disableGutters
          secondaryAction={
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" aria-label={`edit ${task.title}`}>
                <EditNoteRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label={`complete ${task.title}`}>
                <CheckCircleOutlineRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label={`delete ${task.title}`}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          }
          sx={{ py: 1.2, pr: 14, borderBottom: '1px dashed #dbe3ec' }}
        >
          <Box sx={{ pr: 2 }}>
            <ListItemText primary={task.title} secondary={task.subtitle} primaryTypographyProps={{ fontWeight: 600 }} />
          </Box>
        </ListItem>
      ))}
    </List>
  )
}

function TaskListContainer() {
  return (
    <Card
      elevation={0}
      sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #dce4ee', backgroundColor: '#ffffffea' }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#15364f' }}>
          Tasks
        </Typography>
        <TaskSearchField />
        <TaskFilterChips />
        <TaskItemsList />
      </Stack>
    </Card>
  )
}

export default TaskListContainer
