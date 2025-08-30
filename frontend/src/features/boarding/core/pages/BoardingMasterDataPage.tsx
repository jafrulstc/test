import React, { useState, memo } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BoardingPackageTypeSection } from '~/features/boarding/core/components/BoardingPackageTypeSection';
import { BoardingMenuCategorySection } from '~/features/boarding/core/components/BoardingMenuCategorySection';
import { BoardingSubMenuCategorySection } from '~/features/boarding/core/components/BoardingSubMenuCategorySection';
import { BoardingMealTypeSection } from '~/features/boarding/core/components/BoardingMealTypeSection';
import { BoardingMenuItemSection } from '~/features/boarding/core/components/BoardingMenuItemSection';
import { BoardingPackageSection } from '~/features/boarding/core/components/BoardingPackageSection';
import { BoardingPackageMenuItemSection } from '~/features/boarding/core/components/BoardingPackageMenuItemSection';
import { FullDayMealPackageSection } from '~/features/boarding/core/components/FullDayMealPackageSection';

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
      id={`boarding-master-data-tabpanel-${index}`}
      aria-labelledby={`boarding-master-data-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Boarding Master Data page component
 * Contains tabs for managing boarding-related master data
 */
const BoardingMasterDataPage = memo(() => {
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
      id: `boarding-master-data-tab-${index}`,
      'aria-controls': `boarding-master-data-tabpanel-${index}`,
    };
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Boarding Master Data
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage core boarding data that will be used across the boarding system
        </Typography>
      </Box>

      {/* Tabs Container */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="boarding master data tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {/* <Tab label="Package Types" {...a11yProps(0)} />
            <Tab label="Menu Categories" {...a11yProps(1)} />
            <Tab label="Sub Menu Categories" {...a11yProps(2)} />
            <Tab label="Meal Types" {...a11yProps(3)} /> */}
            <Tab label="Boarding Meal Types" {...a11yProps(0)} />
            <Tab label="Boarding Package Types" {...a11yProps(1)} />
            <Tab label="Boarding Packages" {...a11yProps(2)} />
            <Tab label="Boarding Menu Categories" {...a11yProps(3)} />
            <Tab label="Boarding Sub Menu Categories" {...a11yProps(4)} />
            <Tab label="Boarding Menu " {...a11yProps(5)} />
            <Tab label="Boarding Package Menu" {...a11yProps(6)} />
            <Tab label="Full Day Meal Package"  {...a11yProps(7)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <BoardingMealTypeSection />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <BoardingPackageTypeSection />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <BoardingPackageSection />

        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <BoardingMenuCategorySection />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <BoardingSubMenuCategorySection />
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <BoardingMenuItemSection />
        </TabPanel>

        {/* <TabPanel value={activeTab} index={6}>
          <BoardingPackageMenuItemSection />
        </TabPanel> */}

        <TabPanel value={activeTab} index={7}>
          <FullDayMealPackageSection />
        </TabPanel>

      </Paper>
    </Box>
  );
});

BoardingMasterDataPage.displayName = 'BoardingMasterDataPage';

export { BoardingMasterDataPage };
