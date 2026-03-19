import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { toDateInputValue } from '../../utils/dateUtils'

const getInitialState = (goal) => ({
  title: goal?.title ?? '',
  description: goal?.description ?? '',
  targetDate: toDateInputValue(goal?.targetDate),
  targetHours: goal?.targetHours ?? '',
  category: goal?.category ?? '',
})

function GoalModal({ open, goal, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(getInitialState(goal))
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(getInitialState(goal))
    setError('')
  }, [goal])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    await onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      targetDate: form.targetDate ? new Date(form.targetDate).toISOString() : null,
      targetHours: form.targetHours ? Number(form.targetHours) : 0,
      category: form.category.trim(),
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{goal ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
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
          <TextField
            label="Target date"
            name="targetDate"
            type="date"
            value={form.targetDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Target hours"
            name="targetHours"
            type="number"
            value={form.targetHours}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField label="Category" name="category" value={form.category} onChange={handleChange} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button color="error" onClick={() => onDelete(goal)} disabled={!goal}>
          Delete
        </Button>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#0d6e8a' }}>
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default GoalModal
