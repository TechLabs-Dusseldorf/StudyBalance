import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { formatDate, formatMinutes } from '../../utils/dateUtils'

const PRIORITY_COLORS = { low: '#2e7d32', medium: '#c27a00', high: '#c62828' }

function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  const priorityColor = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.medium

  return (
    <ListItem disableGutters sx={{ py: 1.5, px: 0, borderBottom: '1px dashed #dbe3ec', alignItems: 'flex-start' }}>
      <Stack direction="row" spacing={1.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
        <IconButton
          size="small"
          onClick={() => onToggleComplete(task)}
          aria-label={`toggle ${task.title}`}
          sx={{ mt: 0.5 }}
        >
          {task.isCompleted ? (
            <CheckCircleOutlineRoundedIcon sx={{ color: '#2e7d32' }} />
          ) : (
            <RadioButtonUncheckedRoundedIcon />
          )}
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
            <Stack spacing={0.8}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: task.isCompleted ? '#7a8a98' : '#15364f',
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#607487' }}>
                {task.description || 'No description added yet.'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" aria-label={`edit ${task.title}`} onClick={() => onEdit(task)}>
                <EditNoteRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label={`delete ${task.title}`} onClick={() => onDelete(task)}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
            <Chip
              size="small"
              label={task.priority || 'medium'}
              sx={{ color: priorityColor, borderColor: priorityColor }}
              variant="outlined"
            />
            <Chip size="small" label={formatDate(task.dueDate)} variant="outlined" />
            <Chip size="small" label={`Estimate ${formatMinutes(task.estimatedTime || 0)}`} variant="outlined" />
            {(task.tags ?? []).map((tag) => (
              <Chip
                key={`${task.id}-${tag}`}
                size="small"
                label={tag}
                sx={{ backgroundColor: '#edf7fb', color: '#0d6e8a' }}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </ListItem>
  )
}

export default TaskItem
