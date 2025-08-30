import React, { memo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Construction } from '@mui/icons-material';

/**
 * Billing and Payments Component
 * Manages monthly billing and payment tracking
 */
const BillingAndPayments = memo(() => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Monthly Billing & Payment Tracking
      </Typography>

      {/* Coming Soon Notice */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Billing and payment management functionality is under development.
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Planned Features:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Monthly fee calculation based on packages</li>
            <li>Percentage-based discount management</li>
            <li>Payment status tracking (Paid, Due, Overdue)</li>
            <li>Payment recording and receipt generation</li>
            <li>Invoice generation and printing</li>
            <li>Integration with Accounts Department</li>
          </ul>
        </Alert>
      </Paper>
    </Box>
  );
});

BillingAndPayments.displayName = 'BillingAndPayments';

export { BillingAndPayments };