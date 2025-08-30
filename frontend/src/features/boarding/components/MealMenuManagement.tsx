import React, { memo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Construction } from '@mui/icons-material';

/**
 * Meal Menu Management Component
 * Manages daily meal schedules and menu items
 */
const MealMenuManagement = memo(() => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Meal Schedule & Menu Management
      </Typography>

      {/* Coming Soon Notice */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Meal schedule and menu management functionality is under development.
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Planned Features:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Define daily meal schedules (Breakfast, Lunch, Dinner)</li>
            <li>Set specific times for each meal</li>
            <li>Create and manage menu items</li>
            <li>Configure separate menus for Normal and Premium packages</li>
            <li>Daily menu planning and preparation guidelines</li>
          </ul>
        </Alert>
      </Paper>
    </Box>
  );
});

MealMenuManagement.displayName = 'MealMenuManagement';

export { MealMenuManagement };