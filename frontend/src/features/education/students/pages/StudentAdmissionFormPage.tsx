import React, { useState, memo, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StudentForm } from '../components/StudentForm';
import { AdmissionForm } from '../components/AdmissionForm';
import type { Student, Admission } from '../types';
import { fetchStudents, selectStudents } from '../store/studentSlice';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { fetchEducationalMentors, selectEducationalMentors } from '~/features/core/store/generalSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Tab panel component for displaying tab content
 */
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Student Admission Form page component
 * Contains tabs for Student Form and Admission Form
 */
const StudentAdmissionFormPage = memo(() => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [lastCreatedStudent, setLastCreatedStudent] = useState<Student | null>(null);

  const dispatch = useAppDispatch();
  const students = useAppSelector(selectStudents);
  const educationalMentors = useAppSelector(selectEducationalMentors);
  /**
   * Handle tab change
   */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  useEffect(() => {
    if (!students.length) {
      dispatch(fetchStudents({ page: 1, limit: 1000, filters: { status: 'ACTIVE' } }));
    }
    // 🔽 নতুন অংশ: mentors ফেচ
    if (!educationalMentors.length) {
      // Dropdown-এর জন্য নির্দিষ্ট params দিন — টেবিলের pagination/filters-এর ওপর নির্ভর করবেন না
      dispatch(fetchEducationalMentors({ page: 1, limit: 1000, filters: {} }));
    }
  }, [dispatch, students.length, educationalMentors.length]);
  /**
   * Generate tab props for accessibility
   */
  const a11yProps = (index: number) => {
    return {
      id: `student-tab-${index}`,
      'aria-controls': `student-tabpanel-${index}`,
    };
  };

  /**
   * Handle successful student creation
   */
  const handleStudentSuccess = (student: Student) => {
    setLastCreatedStudent(student);
    // Optionally switch to admission tab after student creation
    // setActiveTab(1);
  };

  /**
   * Handle successful admission creation
   */
  const handleAdmissionSuccess = (admission: Admission) => {
    setLastCreatedStudent(null);
    // Optionally switch back to student tab or show success message
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Student & Admission Forms
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add new students and manage their admissions
        </Typography>
      </Box>

      {/* Success Alert for Student Creation */}
      {lastCreatedStudent && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="body1">
              ✅ Student "{lastCreatedStudent.firstName} {lastCreatedStudent.lastName}" has been created successfully!
              You can now proceed to the Admission Form to admit this student.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Tabs Container */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="student admission tabs"
          >
            <Tab label="Student Form" {...a11yProps(0)} />
            <Tab label="Admission Form" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <StudentForm onSuccess={handleStudentSuccess} />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <AdmissionForm onSuccess={handleAdmissionSuccess} />
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
});

StudentAdmissionFormPage.displayName = 'StudentAdmissionFormPage';

export { StudentAdmissionFormPage };