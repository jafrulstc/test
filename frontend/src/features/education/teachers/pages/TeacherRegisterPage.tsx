// features/education/teachers/pages/TeacherRegisterPage.tsx
import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';

// Import the new RegisterForm component
import { TeacherRegisterForm } from '~/features/education/teachers/components/TeacherRegisterForm'; // আপনার ফাইলের কাঠামোর উপর ভিত্তি করে পথটি সামঞ্জস্য করুন

const TeacherRegisterPage = memo(() => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Add Teacher
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Register a new teacher by assigning a staff person and adding teacher-specific info
        </Typography>
      </Box>

      {/* Render the RegisterForm component */}
      {/* RegisterForm কম্পোনেন্ট তার নিজস্ব লোডিং অবস্থা (যেমন, assignable persons) এবং ত্রুটিগুলি পরিচালনা করবে */}
      <TeacherRegisterForm />
    </Box>
  );
});

TeacherRegisterPage.displayName = 'TeacherRegisterPage';
export { TeacherRegisterPage };