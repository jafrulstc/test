import { memo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Construction } from '@mui/icons-material';

/**
 * Boarding Reports Component
 * Generates various reports and analytics
 */
const BoardingReports = memo(() => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Boarding Reports & Analytics
      </Typography>

      {/* Coming Soon Notice */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Boarding reports and analytics functionality is under development.
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Planned Features:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Meal attendance reports (daily, monthly)</li>
            <li>Student-wise meal participation reports</li>
            <li>Billing and payment summary reports</li>
            <li>Food quantity vs. waste analysis</li>
            <li>Export options (CSV/Excel/PDF)</li>
            <li>Financial reports for Accounts Department</li>
          </ul>
        </Alert>
      </Paper>
    </Box>
  );
});

BoardingReports.displayName = 'BoardingReports';

export { BoardingReports };