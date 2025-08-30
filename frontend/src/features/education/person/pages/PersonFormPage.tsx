import React, { useState, memo } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PersonForm } from '../components/PersonForm';
import type { Person } from '~/features/education/person/types/personType';

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
      id={`person-tabpanel-${index}`}
      aria-labelledby={`person-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Person Form page component
 * Follows the demo structure with tabs; includes a Review tab to show the last created person
 */
const PersonFormPage = memo(() => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [lastCreatedPerson, setLastCreatedPerson] = useState<Person | null>(null);

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
      id: `person-tab-${index}`,
      'aria-controls': `person-tabpanel-${index}`,
    } as const;
  };

  /**
   * Handle successful person creation
   */
  const handlePersonSuccess = (person: Person) => {
    setLastCreatedPerson(person);
    // Optionally switch to the review tab after person creation
    // setActiveTab(1);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t ? t('person.form.title', 'Person Form') : 'Person Form'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t ? t('person.form.subtitle', 'Add a new person and manage their details') : 'Add a new person and manage their details'}
        </Typography>
      </Box>

      {/* Success Alert for Person Creation */}
      {lastCreatedPerson && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="body1">
              ✅ {t ? t('person.form.success', 'Person "{{name}}" has been created successfully! You can review the details in the Review tab.') : 'Person created successfully!'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {(lastCreatedPerson.firstName ?? '') + ' ' + (lastCreatedPerson.lastName ?? '')}
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
            aria-label="person tabs"
          >
            <Tab label={t ? t('person.form.tab.form', 'Person Form') : 'Person Form'} {...a11yProps(0)} />
            <Tab label={t ? t('person.form.tab.review', 'Review') : 'Review'} {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <PersonForm onSuccess={handlePersonSuccess} />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            {lastCreatedPerson ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t ? t('person.form.review.title', 'Last Created Person') : 'Last Created Person'}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{(lastCreatedPerson.firstName ?? '') + ' ' + (lastCreatedPerson.lastName ?? '')}</Typography>
                  </Paper>
                  {'fatherName' in (lastCreatedPerson as any) && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Father's Name</Typography>
                      <Typography variant="body1">{(lastCreatedPerson as any).fatherName}</Typography>
                    </Paper>
                  )}
                  {'motherName' in (lastCreatedPerson as any) && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Mother's Name</Typography>
                      <Typography variant="body1">{(lastCreatedPerson as any).motherName}</Typography>
                    </Paper>
                  )}
                  {'email' in (lastCreatedPerson as any) && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{(lastCreatedPerson as any).email}</Typography>
                    </Paper>
                  )}
                  {'dateOfBirth' in (lastCreatedPerson as any) && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                      <Typography variant="body1">{(lastCreatedPerson as any).dateOfBirth}</Typography>
                    </Paper>
                  )}
                  {'status' in (lastCreatedPerson as any) && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Typography variant="body1">{String((lastCreatedPerson as any).status)}</Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
            ) : (
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {t ? t('person.form.review.empty', 'No person created yet. Create a person first to review the details here.') : 'No person created yet. Create a person first to review the details here.'}
                </Typography>
              </Paper>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
});

PersonFormPage.displayName = 'PersonFormPage';

export { PersonFormPage };
