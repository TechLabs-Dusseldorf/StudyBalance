import { useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { toDateInputValue } from '../../utils/dateUtils'

const createInitialState = (task) => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  tags: Array.isArray(task?.tags) ? task.tags.join(', ') : '',
  priority: task?.priority ?? 'medium',
  dueDate: toDateInputValue(task?.dueDate),
  estimatedTime: task?.estimatedTime ?? '',
})

function TaskModal({ open, task, onClose, onSave }) {
  const [form, setForm] = useState(createInitialState(task))
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(createInitialState(task))
    setError('')
  }, [task])

  const isEditMode = useMemo(() => Boolean(task), [task])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    setError('')
    await onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      estimatedTime: form.estimatedTime ? Number(form.estimatedTime) : 0,
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} required />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            minRows={3}
          />
          <TextField label="Tags" name="tags" value={form.tags} onChange={handleChange} helperText="Comma separated" />
          <TextField select label="Priority" name="priority" value={form.priority} onChange={handleChange}>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
          <TextField
            label="Due date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Estimated time (minutes)"
            name="estimatedTime"
            type="number"
            value={form.estimatedTime}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#0d6e8a' }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskModal
