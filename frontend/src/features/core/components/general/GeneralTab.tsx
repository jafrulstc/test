import React, { useState, useEffect, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  setActiveEntity,
  clearError,
  selectGeneralState,
  selectGeneralError,
} from '~/features/core/store/generalSlice';
import type { GeneralEntityType } from '~/features/core/types/general';
import { GENERAL_ENTITIES, GENERAL_ENTITY_DISPLAY_NAMES } from '~/features/core/const/generalConst';
import { NameCrudSection } from './NameCrudSection';
import { GuardiansSection } from './GuardiansSection';
import { EducationalMentorsSection } from './EducationalMentorsSection';
import DesignationSection from './DesignationSection';

/**
 * General tab component
 * Manages general master data with different entity types
 */
const GeneralTab = memo(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { activeEntity, loading } = useAppSelector(selectGeneralState);
  const error = useAppSelector(selectGeneralError);

  // Entity tabs configuration
  const entityTabs: { key: GeneralEntityType; label: string }[] = [
    { key: GENERAL_ENTITIES.GENDER, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.GENDER] },
    { key: GENERAL_ENTITIES.PERSON_CATEGORY, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.PERSON_CATEGORY] },
    { key: GENERAL_ENTITIES.BLOOD_GROUP, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.BLOOD_GROUP] },
    { key: GENERAL_ENTITIES.RESIDENTIAL_STATUS, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.RESIDENTIAL_STATUS] },
    { key: GENERAL_ENTITIES.RELIGION, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.RELIGION] },
    { key: GENERAL_ENTITIES.DESIGNATION, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.DESIGNATION] },
    { key: GENERAL_ENTITIES.DESIGNATION_CATEGORY, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.DESIGNATION_CATEGORY] },
    { key: GENERAL_ENTITIES.JOB_RULE, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.JOB_RULE] },
    { key: GENERAL_ENTITIES.GUARDIAN, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.GUARDIAN] },
    { key: GENERAL_ENTITIES.EDUCATIONAL_MENTOR, label: GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.EDUCATIONAL_MENTOR] },
  ];

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch, showToast]);

  /**
   * Handle entity tab change
   */
  const handleEntityChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    const entity = entityTabs[newValue].key;
    dispatch(setActiveEntity(entity));
  }, [dispatch, entityTabs]);

  /**
   * Get current entity tab index
   */
  const currentTabIndex = entityTabs.findIndex(tab => tab.key === activeEntity);

  /**
   * Render content based on active entity
   */
  const renderContent = () => {
    switch (activeEntity) {
      case GENERAL_ENTITIES.GENDER:
        return <NameCrudSection entityType={GENERAL_ENTITIES.GENDER} title={GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.GENDER]} />;
      case GENERAL_ENTITIES.PERSON_CATEGORY:
        return <NameCrudSection entityType={GENERAL_ENTITIES.PERSON_CATEGORY} title={GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.PERSON_CATEGORY]} />;
      case GENERAL_ENTITIES.BLOOD_GROUP:
        return <NameCrudSection entityType={GENERAL_ENTITIES.BLOOD_GROUP} title={GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.BLOOD_GROUP]} />;
      case GENERAL_ENTITIES.RESIDENTIAL_STATUS:
        return <NameCrudSection entityType={GENERAL_ENTITIES.RESIDENTIAL_STATUS} title={GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.RESIDENTIAL_STATUS]} />;
      case GENERAL_ENTITIES.RELIGION:
        return <NameCrudSection entityType={GENERAL_ENTITIES.RELIGION} title={GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.RELIGION]} />;
      case GENERAL_ENTITIES.DESIGNATION:
        return <DesignationSection />;
      case GENERAL_ENTITIES.DESIGNATION_CATEGORY:
        return <NameCrudSection entityType={GENERAL_ENTITIES.DESIGNATION_CATEGORY} title={GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.DESIGNATION_CATEGORY]} />;
      case GENERAL_ENTITIES.JOB_RULE:
        return <NameCrudSection entityType={GENERAL_ENTITIES.JOB_RULE} title={GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.JOB_RULE]} />;
      case GENERAL_ENTITIES.GUARDIAN:
        return <GuardiansSection />;
      case GENERAL_ENTITIES.EDUCATIONAL_MENTOR:
        return <EducationalMentorsSection />;
      default:
        return <NameCrudSection entityType={GENERAL_ENTITIES.GENDER} title={GENERAL_ENTITY_DISPLAY_NAMES[GENERAL_ENTITIES.GENDER]} />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          General Data Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage basic information categories used throughout the system
        </Typography>
      </Box>

      {/* Content */}
      <Paper sx={{ width: '100%' }}>
        {/* Entity Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTabIndex}
            onChange={handleEntityChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {entityTabs.map((tab) => (
              <Tab key={tab.key} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {renderContent()}
        </Box>
      </Paper>
    </Box>
  );
});

GeneralTab.displayName = 'GeneralTab';

export { GeneralTab };