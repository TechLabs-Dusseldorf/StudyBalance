import { useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useGoals } from '../../context/GoalsContext'
import GoalModal from './GoalModal'

function GoalsCard() {
  const { goals, isLoading, createGoal, updateGoal, deleteGoal } = useGoals()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isListOpen, setIsListOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const visibleGoals = goals.slice(0, 3)

  const handleSave = async (goalData) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData)
    } else {
      await createGoal(goalData)
    }

    setEditingGoal(null)
    setIsModalOpen(false)
  }

  const handleDelete = async (goal) => {
    if (!goal) {
      return
    }

    const shouldDelete = window.confirm(`Delete "${goal.title}"?`)
    if (!shouldDelete) {
      return
    }

    await deleteGoal(goal.id)
    setEditingGoal(null)
    setIsModalOpen(false)
  }

  return (
    <>
      <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dce4ee', backgroundColor: '#ffffffea' }}>
        <Stack spacing={1.75}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#15364f' }}>
              Goals
            </Typography>
            <Button
              startIcon={<AddRoundedIcon />}
              variant="outlined"
              sx={{ borderColor: '#0d6e8a', color: '#0d6e8a' }}
              onClick={() => {
                setEditingGoal(null)
                setIsModalOpen(true)
              }}
            >
              Add Goal
            </Button>
          </Stack>

          {isLoading ? <Typography color="#607487">Loading goals...</Typography> : null}

          {!isLoading && visibleGoals.length === 0 ? (
            <Typography color="#607487">No goals yet. Add one to track your study target.</Typography>
          ) : null}

          <Stack spacing={1.5}>
            {visibleGoals.map((goal) => (
              <Card
                key={goal.id}
                variant="outlined"
                sx={{ p: 1.5, borderRadius: 3, cursor: 'pointer' }}
                onClick={() => {
                  setEditingGoal(goal)
                  setIsModalOpen(true)
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FlagRoundedIcon fontSize="small" sx={{ color: '#0d6e8a' }} />
                    <Typography sx={{ fontWeight: 700, color: '#15364f' }}>{goal.title}</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progressPercent ?? 0}
                    sx={{ height: 8, borderRadius: 999 }}
                  />
                  <Typography variant="body2" color="#607487">
                    {Math.round(goal.progressHours ?? 0)} / {goal.targetHours || 0} hours - {goal.progressPercent ?? 0}%
                    complete
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Stack>

          {goals.length > 3 ? (
            <Typography
              component="button"
              type="button"
              variant="body2"
              onClick={() => setIsListOpen(true)}
              sx={{
                border: 0,
                background: 'none',
                p: 0,
                width: 'fit-content',
                color: '#0d6e8a',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View All ({goals.length})
            </Typography>
          ) : null}
        </Stack>
      </Card>

      <Dialog open={isListOpen} onClose={() => setIsListOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>All Goals</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            {goals.map((goal) => (
              <Card
                key={`expanded-${goal.id}`}
                variant="outlined"
                sx={{ p: 1.5, borderRadius: 3, cursor: 'pointer' }}
                onClick={() => {
                  setIsListOpen(false)
                  setEditingGoal(goal)
                  setIsModalOpen(true)
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FlagRoundedIcon fontSize="small" sx={{ color: '#0d6e8a' }} />
                    <Typography sx={{ fontWeight: 700, color: '#15364f' }}>{goal.title}</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progressPercent ?? 0}
                    sx={{ height: 8, borderRadius: 999 }}
                  />
                  <Typography variant="body2" color="#607487">
                    {Math.round(goal.progressHours ?? 0)} / {goal.targetHours || 0} hours - {goal.progressPercent ?? 0}%
                    complete
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      <GoalModal
        open={isModalOpen}
        goal={editingGoal}
        onClose={() => {
          setEditingGoal(null)
          setIsModalOpen(false)
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  )
}

export default GoalsCard
