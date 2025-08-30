import React, { memo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Construction } from '@mui/icons-material';

/**
 * Meal Attendance Component
 * Manages daily meal attendance tracking
 */
const MealAttendance = memo(() => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Daily Meal Attendance System
      </Typography>

      {/* Coming Soon Notice */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Meal attendance tracking functionality is under development.
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Planned Features:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Daily tracking of student meal participation</li>
            <li>Checkbox/toggle interface for attendance marking</li>
            <li>Meal-wise summary (breakfast/lunch/dinner)</li>
            <li>Real-time attendance counts</li>
            <li>Automatic meal preparation planning reports</li>
          </ul>
        </Alert>
      </Paper>
    </Box>
  );
});

MealAttendance.displayName = 'MealAttendance';

export { MealAttendance };