import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import TimerModal from '../timer/TimerModal'
import GuestBanner from './GuestBanner'
import Navbar from './Navbar'
import SidebarCards from './SidebarCards'
import TaskListContainer from './TaskListContainer'

function Dashboard() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <GuestBanner />
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, alignItems: 'start' }}>
          <TaskListContainer />
          <SidebarCards />
        </Box>
      </Container>
      <TimerModal />
    </Box>
  )
}

export default Dashboard
