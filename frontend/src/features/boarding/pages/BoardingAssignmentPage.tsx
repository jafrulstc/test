import React, { useState, memo } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AssignedUsersTab } from '../components/AssignedUsersTab';
import { AssignUsersTab } from '../components/AssignUsersTab';

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
      id={`boarding-assignment-tabpanel-${index}`}
      aria-labelledby={`boarding-assignment-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Boarding Assignment page component
 * Contains tabs for managing boarding assignments
 */
const BoardingAssignmentPage = memo(() => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  /**
   * Handle tab change
   */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  /**
   * Generate tab props for accessibility
   */
  const a11yProps = (index: number) => {
    return {
      id: `boarding-assignment-tab-${index}`,
      'aria-controls': `boarding-assignment-tabpanel-${index}`,
    };
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Boarding Assignment Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage boarding package assignments for students, teachers, and staff
        </Typography>
      </Box>

      {/* Tabs Container */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="boarding assignment tabs"
          >
            <Tab label="Assigned Users" {...a11yProps(0)} />
            <Tab label="Assign Users" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <AssignedUsersTab />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <AssignUsersTab />
        </TabPanel>
      </Paper>
    </Box>
  );
});

BoardingAssignmentPage.displayName = 'BoardingAssignmentPage';

export { BoardingAssignmentPage };