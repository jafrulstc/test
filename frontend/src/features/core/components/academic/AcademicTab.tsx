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
  selectAcademicState,
  selectAcademicError,
} from '~/features/core/store/academicSlice';
import type { AcademicEntityType } from '~/features/core/types/academic';
import { ACADEMIC_ENTITIES, ACADEMIC_ENTITY_DISPLAY_NAMES } from '~/features/core/const/academicConst';
import { EducationLevelSection } from './EducationLevelSection';
import { AcademicYearSection } from './AcademicYearSection';
import { AcademicGroupSection } from './AcademicGroupSection';
import { AcademicClassSection } from './AcademicClassSection';
import { ClassGroupMappingSection } from './ClassGroupMappingSection';
import { ShiftSection } from './ShiftSection';
import { SectionSection } from './SectionSection';

/**
 * Academic tab component
 * Manages academic master data with different entity types
 */
const AcademicTab = memo(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { activeEntity, loading } = useAppSelector(selectAcademicState);
  const error = useAppSelector(selectAcademicError);

  // Entity tabs configuration
  const entityTabs: { key: AcademicEntityType; label: string }[] = [
    { key: ACADEMIC_ENTITIES.EDUCATION_LEVEL, label: ACADEMIC_ENTITY_DISPLAY_NAMES[ACADEMIC_ENTITIES.EDUCATION_LEVEL] },
    { key: ACADEMIC_ENTITIES.ACADEMIC_YEAR, label: ACADEMIC_ENTITY_DISPLAY_NAMES[ACADEMIC_ENTITIES.ACADEMIC_YEAR] },
    { key: ACADEMIC_ENTITIES.ACADEMIC_GROUP, label: ACADEMIC_ENTITY_DISPLAY_NAMES[ACADEMIC_ENTITIES.ACADEMIC_GROUP] },
    { key: ACADEMIC_ENTITIES.ACADEMIC_CLASS, label: ACADEMIC_ENTITY_DISPLAY_NAMES[ACADEMIC_ENTITIES.ACADEMIC_CLASS] },
    { key: ACADEMIC_ENTITIES.SHIFT, label: ACADEMIC_ENTITY_DISPLAY_NAMES[ACADEMIC_ENTITIES.SHIFT] },
    { key: ACADEMIC_ENTITIES.SECTION, label: ACADEMIC_ENTITY_DISPLAY_NAMES[ACADEMIC_ENTITIES.SECTION] },
    { key: ACADEMIC_ENTITIES.CLASS_GROUP_MAPPING, label: ACADEMIC_ENTITY_DISPLAY_NAMES[ACADEMIC_ENTITIES.CLASS_GROUP_MAPPING] },
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
      case ACADEMIC_ENTITIES.EDUCATION_LEVEL:
        return <EducationLevelSection />;
      case ACADEMIC_ENTITIES.ACADEMIC_YEAR:
        return <AcademicYearSection />;
      case ACADEMIC_ENTITIES.ACADEMIC_GROUP:
        return <AcademicGroupSection />;
      case ACADEMIC_ENTITIES.ACADEMIC_CLASS:
        return <AcademicClassSection />;
      case ACADEMIC_ENTITIES.SHIFT:
        return <ShiftSection />;
      case ACADEMIC_ENTITIES.SECTION:
        return <SectionSection />;
      case ACADEMIC_ENTITIES.CLASS_GROUP_MAPPING:
        return <ClassGroupMappingSection />;
      default:
        return <EducationLevelSection />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Academic Data Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage academic information categories used throughout the education system
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

AcademicTab.displayName = 'AcademicTab';

export { AcademicTab };