import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import Navbar from './Navbar'
import SidebarCards from './SidebarCards'
import TaskListContainer from './TaskListContainer'

function Dashboard() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, alignItems: 'start' }}>
          <TaskListContainer />
          <SidebarCards />
        </Box>
      </Container>
    </Box>
  )
}

export default Dashboard
