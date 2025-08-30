// features/education/staff/pages/StaffRegisterPage.tsx
import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';

// Import the new RegisterForm component
import { StaffRegisterForm } from '~/features/education/staff/components/StaffRegisterForm'; // আপনার ফাইলের কাঠামোর উপর ভিত্তি করে পথটি সামঞ্জস্য করুন

const StaffRegisterPage = memo(() => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Add Staff
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Register a new staff by assigning a staff person and adding staff-specific info
        </Typography>
      </Box>

      {/* Render the RegisterForm component */}
      {/* RegisterForm কম্পোনেন্ট তার নিজস্ব লোডিং অবস্থা (যেমন, assignable persons) এবং ত্রুটিগুলি পরিচালনা করবে */}
      <StaffRegisterForm />
    </Box>
  );
});

StaffRegisterPage.displayName = 'StaffRegisterPage';
export { StaffRegisterPage };