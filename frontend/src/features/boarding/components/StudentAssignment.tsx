import React, { memo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Construction } from '@mui/icons-material';   

/**
 * Student Assignment Component
 * Manages student boarding assignments and package changes
 */
const StudentAssignment = memo(() => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Student Boarding Assignment
      </Typography>

      {/* Coming Soon Notice */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Student boarding assignment functionality is under development.
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Planned Features:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Assign students to boarding packages</li>
            <li>Select package type (Normal/Premium) with start dates</li>
            <li>Upgrade, downgrade, or remove students from packages</li>
            <li>Package change history tracking</li>
            <li>Student discount management</li>
          </ul>
        </Alert>
      </Paper>
    </Box>
  );
});

StudentAssignment.displayName = 'StudentAssignment';

export { StudentAssignment };