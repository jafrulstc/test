import React, { useState, useEffect, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ViewList, AccountTree, Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  setViewMode,
  setActiveEntity,
  clearError,
  selectGeographyState,
  selectGeographyError,
  fetchAllGeographyData,
} from '~/features/core/store/geographySlice';
import type { ViewMode } from '~/features/core/types/geography';
import type { GeographyEntityType } from '~/app/constants/index'
import { GeographyNormalView } from './GeographyNormalView';
import { GeographyTreeView } from './GeographyTreeView';
import { GeographyFormModal } from './GeographyFormModal';

/**
 * Geography tab component
 * Manages geography data with normal and tree view modes
 */
const GeographyTab = memo(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const {
    viewMode,
    activeEntity,
    loading,
  } = useAppSelector(selectGeographyState);
  const error = useAppSelector(selectGeographyError);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Entity tabs configuration
  const entityTabs: { key: GeographyEntityType; label: string }[] = [
    { key: 'nationality', label: 'Nationality' },
    { key: 'division', label: 'Division' },
    { key: 'district', label: 'District' },
    { key: 'sub_district', label: 'Sub District' },
    { key: 'post_office', label: 'Post Office' },
    { key: 'village', label: 'Village' },
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

  // Fetch data when view mode changes to tree
  useEffect(() => {
    if (viewMode === 'tree') {
      dispatch(fetchAllGeographyData());
    }
  }, [viewMode, dispatch]);

  /**
   * Handle view mode change
   */
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    dispatch(setViewMode(mode));
  }, [dispatch]);

  /**
   * Handle entity tab change
   */
  const handleEntityChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    const entity = entityTabs[newValue].key;
    dispatch(setActiveEntity(entity));
  }, [dispatch, entityTabs]);

  /**
   * Handle add new item
   */
  const handleAddNew = useCallback(() => {
    setSelectedItem(null);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle edit item
   */
  const handleEdit = useCallback((item: any) => {
    setSelectedItem(item);
    setFormModalOpen(true);
  }, []);


  const handleTreeEdit = useCallback((item: any, type: GeographyEntityType) => {
    dispatch(setActiveEntity(type));
    setSelectedItem(item);
    setFormModalOpen(true);
  }, [dispatch]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
  }, []);

  /**
   * Get current entity tab index
   */

  
  const currentTabIndex = entityTabs.findIndex(tab => tab.key === activeEntity);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Geography Data Management
        </Typography>
        
        {/* View Mode Toggle */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ButtonGroup variant="outlined" size="small">
            <Button
              variant={viewMode === 'normal' ? 'contained' : 'outlined'}
              startIcon={<ViewList />}
              onClick={() => handleViewModeChange('normal')}
            >
              Normal View
            </Button>
            <Button
              variant={viewMode === 'tree' ? 'contained' : 'outlined'}
              startIcon={<AccountTree />}
              onClick={() => handleViewModeChange('tree')}
            >
              Tree View
            </Button>
          </ButtonGroup>

          {/* Add Button */}
          {viewMode === 'normal' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddNew}
              disabled={loading}
            >
              Add {entityTabs.find(tab => tab.key === activeEntity)?.label}
            </Button>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Paper sx={{ width: '100%' }}>
        {viewMode === 'normal' ? (
          <>
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

            {/* Normal View Content */}
            <GeographyNormalView onEdit={handleEdit} />
          </>
        ) : (
          /* Tree View Content */
          <GeographyTreeView onEdit={handleTreeEdit} />
        )}
      </Paper>

      {/* Form Modal */}
      <GeographyFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        item={selectedItem}
        entityType={activeEntity}
      />
    </Box>
  );
});

GeographyTab.displayName = 'GeographyTab';

export { GeographyTab };
