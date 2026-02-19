import Stack from '@mui/material/Stack'

import GoalsCard from './GoalsCard'
import PomodoroCard from './PomodoroCard'
import TotalStudyTimeCard from './TotalStudyTimeCard'

function SidebarCards() {
  return (
    <Stack spacing={2.5}>
      <PomodoroCard />
      <GoalsCard />
      <TotalStudyTimeCard />
    </Stack>
  )
}

export default SidebarCards
