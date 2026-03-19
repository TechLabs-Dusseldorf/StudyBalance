import { useEffect, useMemo, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useTasks } from '../../context/TasksContext'
import TaskItem from './TaskItem'
import TaskModal from './TaskModal'

function TaskListContainer() {
  const {
    filteredTasks,
    availableTags,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    completionFilter,
    setCompletionFilter,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTasks()
  const [searchDraft, setSearchDraft] = useState(searchQuery)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearchQuery(searchDraft), 300)
    return () => window.clearTimeout(timeoutId)
  }, [searchDraft, setSearchQuery])

  const selectedTagText = useMemo(
    () => (selectedTags.length > 0 ? selectedTags.join(', ') : 'All Tags'),
    [selectedTags]
  )

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
    } else {
      await createTask(taskData)
    }

    setEditingTask(null)
    setIsModalOpen(false)
  }

  const handleDeleteTask = async (task) => {
    const shouldDelete = window.confirm(`Delete "${task.title}"?`)

    if (shouldDelete) {
      await deleteTask(task.id)
    }
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #dce4ee', backgroundColor: '#ffffffea' }}
      >
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#15364f' }}>
                My Tasks
              </Typography>
              <Typography color="#607487">Search, filter, and manage your current study work.</Typography>
            </Stack>
            <Button
              startIcon={<AddRoundedIcon />}
              variant="contained"
              sx={{ backgroundColor: '#0d6e8a' }}
              onClick={() => {
                setEditingTask(null)
                setIsModalOpen(true)
              }}
            >
              Add Task
            </Button>
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search tasks"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
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
            <TextField
              select
              size="small"
              label="Status"
              value={completionFilter}
              onChange={(event) => setCompletionFilter(event.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2" sx={{ color: '#607487', fontWeight: 600 }}>
              Tags: {selectedTagText}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label="All Tags"
                clickable
                variant={selectedTags.length === 0 ? 'filled' : 'outlined'}
                color={selectedTags.length === 0 ? 'primary' : 'default'}
                onClick={() => setSelectedTags([])}
              />
              {availableTags.map((tag) => {
                const active = selectedTags.includes(tag)
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    clickable
                    variant={active ? 'filled' : 'outlined'}
                    color={active ? 'primary' : 'default'}
                    onClick={() =>
                      setSelectedTags((current) =>
                        current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
                      )
                    }
                  />
                )
              })}
            </Stack>
          </Stack>

          <Box>
            {isLoading ? <Typography color="#607487">Loading tasks...</Typography> : null}

            {!isLoading && filteredTasks.length === 0 ? (
              <Card
                variant="outlined"
                sx={{ p: 3, borderStyle: 'dashed', textAlign: 'center', backgroundColor: '#fbfdff' }}
              >
                <Typography sx={{ fontWeight: 700, color: '#15364f' }}>No tasks found</Typography>
                <Typography color="#607487">Add a task or change your filters to see results.</Typography>
              </Card>
            ) : null}

            <List disablePadding>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={(item) => {
                    setEditingTask(item)
                    setIsModalOpen(true)
                  }}
                  onDelete={handleDeleteTask}
                  onToggleComplete={toggleTaskCompletion}
                />
              ))}
            </List>
          </Box>
        </Stack>
      </Card>

      <TaskModal
        open={isModalOpen}
        task={editingTask}
        onClose={() => {
          setEditingTask(null)
          setIsModalOpen(false)
        }}
        onSave={handleSaveTask}
      />
    </>
  )
}

export default TaskListContainer
