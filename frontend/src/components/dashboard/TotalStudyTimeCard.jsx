import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useStats } from '../../context/StatsContext'
import { formatMinutes } from '../../utils/dateUtils'

function TotalStudyTimeCard() {
  const { stats } = useStats()

  return (
    <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dce4ee', backgroundColor: '#ffffffea' }}>
      <Stack spacing={1.5}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#15364f' }}>
          Total Study Time
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QueryBuilderRoundedIcon sx={{ color: '#0d6e8a' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0d6e8a' }}>
            {formatMinutes(stats.totalStudyMinutes)}
          </Typography>
        </Box>

        <Typography variant="body2" color="#607487">
          All time - {stats.completedTasksCount} completed tasks - {stats.activeGoalsCount} active goals
        </Typography>
      </Stack>
    </Card>
  )
}

export default TotalStudyTimeCard
