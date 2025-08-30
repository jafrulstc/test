import React, { useState, memo } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GeographyTab } from '../components/geography/GeographyTab';
import { GeneralTab } from '../components/general/GeneralTab';
import { AcademicTab } from '../components/academic/AcademicTab';

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
      id={`master-data-tabpanel-${index}`}
      aria-labelledby={`master-data-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Master Data page component
 * Contains tabs for General, Geography, and Result data management
 */
const MasterDataPage = memo(() => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(2); // Start with Academic tab

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
      id: `master-data-tab-${index}`,
      'aria-controls': `master-data-tabpanel-${index}`,
    };
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('navigation.masterData')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage core data that will be used across the education system
        </Typography>
      </Box>

      {/* Tabs Container */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="master data tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Geography" {...a11yProps(1)} />
            <Tab label="Academic" {...a11yProps(2)} />
            <Tab label="Result" {...a11yProps(3)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <GeneralTab />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <GeographyTab />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <AcademicTab />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Result Data Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This section will contain Percentage, Grade, and Description data management.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
});

MasterDataPage.displayName = 'MasterDataPage';

export { MasterDataPage };
