import { useState } from 'react'
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

import { useStats } from '../../context/StatsContext'
import { formatMinutes } from '../../utils/dateUtils'

function TotalStudyTimeCard() {
  const { stats, statsByPeriod } = useStats()
  const [period, setPeriod] = useState('allTime')

  const selectedStats = statsByPeriod[period] ?? stats
  const periodLabel = period === 'today' ? 'Today' : period === 'thisWeek' ? 'This Week' : 'All Time'
  const goalsLabel = period === 'allTime' ? 'active goals' : 'goals added'

  return (
    <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dce4ee', backgroundColor: '#ffffffea' }}>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#15364f' }}>
            Total Study Time
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={period}
            onChange={(_, nextPeriod) => {
              if (nextPeriod) {
                setPeriod(nextPeriod)
              }
            }}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            <ToggleButton value="today">Today</ToggleButton>
            <ToggleButton value="thisWeek">This Week</ToggleButton>
            <ToggleButton value="allTime">All Time</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QueryBuilderRoundedIcon sx={{ color: '#0d6e8a' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0d6e8a' }}>
            {formatMinutes(selectedStats.totalStudyMinutes)}
          </Typography>
        </Box>

        <Typography variant="body2" color="#607487">
          {periodLabel} - {selectedStats.completedTasksCount} completed tasks -{' '}
          {period === 'allTime' ? selectedStats.activeGoalsCount : selectedStats.goalsAddedCount} {goalsLabel}
        </Typography>
      </Stack>
    </Card>
  )
}

export default TotalStudyTimeCard
