import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { Edit, Delete, Search, Add, Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectAcademicState,
  selectAcademicClasses,
  selectEducationLevels,
  selectAcademicGroups,
  setFilters,
  setPagination,
  fetchAcademicClasses,
  fetchEducationLevels,
  fetchAcademicGroups,
  createAcademicClass,
  updateAcademicClass,
  deleteAcademicClass,
} from '~/features/core/store/academicSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { academicClassSchema } from '~/features/core/schemas/academicSchemas';
import type { AcademicClass } from '~/features/core/types/academic';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';

type FormData = {
  name: string;
  educationLevelId: string;
  academicGroupIds: string[];
  status: 'Active' | 'Inactive' | 'Archived';
};

/**
 * Academic Class section component
 */
const AcademicClassSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectAcademicState);
  const academicClasses = useAppSelector(selectAcademicClasses);
  const educationLevels = useAppSelector(selectEducationLevels);
  const academicGroups = useAppSelector(selectAcademicGroups);

  const [searchTerm, setSearchTerm] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AcademicClass | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AcademicClass | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(academicClassSchema),
    defaultValues: { 
      name: '', 
      educationLevelId: '',
      academicGroupIds: [],
      status: 'Active' 
    },
  });

  const selectedEducationLevelId = watch('educationLevelId');

  // Fetch required data for dropdowns
  useEffect(() => {
    if (educationLevels.length === 0) {
      dispatch(fetchEducationLevels({ page: 1, limit: 1000, filters: {} }));
    }
    if (academicGroups.length === 0) {
      dispatch(fetchAcademicGroups({ page: 1, limit: 1000, filters: {} }));
    }
  }, [dispatch, educationLevels.length, academicGroups.length]);

  // Update filters when search term changes
  useEffect(() => {
    const newFilters = { ...filters, search: debouncedSearchTerm || undefined };
    // Only dispatch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, dispatch]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchAcademicClasses(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({ 
        name: selectedItem?.name || '', 
        educationLevelId: selectedItem?.educationLevelId || '',
        academicGroupIds: selectedItem?.academicGroupIds || [],
        status: selectedItem?.status || 'Active'
      });
    }
  }, [formModalOpen, selectedItem, reset]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

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
  const handleEdit = useCallback((item: AcademicClass) => {
    setSelectedItem(item);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: AcademicClass) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && selectedItem) {
        // Check for changes
        const originalData: FormData = {
          name: selectedItem.name,
          educationLevelId: selectedItem.educationLevelId,
          academicGroupIds: selectedItem.academicGroupIds,
          status: selectedItem.status,
        };
        
        const changedFields = getChangedFields(originalData, data);
        
        if (Object.keys(changedFields).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        await dispatch(updateAcademicClass({ id: selectedItem.id, data: changedFields })).unwrap();
        showToast(`Academic Class ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createAcademicClass(data)).unwrap();
        showToast(`Academic Class ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} academic class`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteAcademicClass(itemToDelete.id)).unwrap();
      showToast(`Academic Class ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete academic class', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ name: '', educationLevelId: '', academicGroupIds: [], status: 'Active' });
  }, [reset]);

  /**
   * Get status color
   */
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Archived':
        return 'error';
      default:
        return 'default';
    }
  };

  /**
   * Get education level name from ID
   */
  const getEducationLevelName = (levelId: string): string => {
    const level = educationLevels.find(el => el.id === levelId);
    return level ? level.name : 'Unknown';
  };

  /**
   * Get academic group names from IDs
   */
  const getAcademicGroupNames = (groupIds: string[]): string[] => {
    return groupIds.map(id => {
      const group = academicGroups.find(ag => ag.id === id);
      return group ? group.name : 'Unknown';
    });
  };

  /**
   * Get filtered academic groups based on selected education level
   */
  const getFilteredAcademicGroups = () => {
    if (!selectedEducationLevelId) return [];
    return academicGroups.filter(group => 
      group.educationLevelIds.includes(selectedEducationLevelId)
    );
  };

  if (loading && academicClasses.length === 0) {
    return <LoadingSpinner message="Loading academic classes..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Academic Class Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Academic Class
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search academic classes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Data Table */}
      {academicClasses.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Education Level</TableCell>
                  <TableCell>Academic Groups</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {academicClasses.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getEducationLevelName(item.educationLevelId)}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getAcademicGroupNames(item.academicGroupIds).map((groupName, index) => (
                          <Chip
                            key={index}
                            label={groupName}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        color={getStatusColor(item.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(item)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState
          title="No academic classes found"
          description="No academic classes available. Add some to get started."
          actionLabel="Add Academic Class"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Academic Class' : 'Add Academic Class'}
            </Typography>
            <IconButton onClick={handleFormModalClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Name *"
                    placeholder="e.g., Class 9, XI, XII"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                  />
                )}
              />

              <Controller
                name="educationLevelId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.educationLevelId}>
                    <InputLabel>Education Level *</InputLabel>
                    <Select {...field} label="Education Level *">
                      <MenuItem value="">Select Education Level</MenuItem>
                      {educationLevels.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          {level.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.educationLevelId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.educationLevelId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="academicGroupIds"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.academicGroupIds}>
                    <InputLabel>Academic Groups *</InputLabel>
                    <Select
                      {...field}
                      multiple
                      disabled={!selectedEducationLevelId}
                      input={<OutlinedInput label="Academic Groups *" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => {
                            const group = academicGroups.find(ag => ag.id === value);
                            return (
                              <Chip
                                key={value}
                                label={group?.name || 'Unknown'}
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {getFilteredAcademicGroups().map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          <Checkbox checked={field.value.indexOf(group.id) > -1} />
                          <ListItemText primary={group.name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.academicGroupIds && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.academicGroupIds.message}
                      </Typography>
                    )}
                    {!selectedEducationLevelId && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        Please select an education level first
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status *</InputLabel>
                    <Select {...field} label="Status *">
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Archived">Archived</MenuItem>
                    </Select>
                    {errors.status && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.status.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleFormModalClose} disabled={loading || isSubmitting}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || isSubmitting}
              sx={{ minWidth: 100 }}
            >
              {loading || isSubmitting ? t('common.loading') : isEdit ? t('common.save') : t('common.add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Academic Class"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

AcademicClassSection.displayName = 'AcademicClassSection';

export { AcademicClassSection };