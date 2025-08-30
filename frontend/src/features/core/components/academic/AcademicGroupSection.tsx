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
  selectAcademicGroups,
  selectEducationLevels,
  setFilters,
  setPagination,
  fetchAcademicGroups,
  fetchEducationLevels,
  createAcademicGroup,
  updateAcademicGroup,
  deleteAcademicGroup,
} from '~/features/core/store/academicSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { academicGroupSchema } from '~/features/core/schemas/academicSchemas';
import type { AcademicGroup } from '~/features/core/types/academic';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';

type FormData = {
  name: string;
  educationLevelIds: string[];
  status: 'Active' | 'Inactive' | 'Archived';
};

/**
 * Academic Group section component
 */
const AcademicGroupSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectAcademicState);
  const academicGroups = useAppSelector(selectAcademicGroups);
  const educationLevels = useAppSelector(selectEducationLevels);

  const [searchTerm, setSearchTerm] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AcademicGroup | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AcademicGroup | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(academicGroupSchema),
    defaultValues: { 
      name: '', 
      educationLevelIds: [],
      status: 'Active' 
    },
  });

  // Fetch education levels for dropdown
  useEffect(() => {
    if (educationLevels.length === 0) {
      dispatch(fetchEducationLevels({ page: 1, limit: 1000, filters: {} }));
    }
  }, [dispatch, educationLevels.length]);

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
    dispatch(fetchAcademicGroups(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({ 
        name: selectedItem?.name || '', 
        educationLevelIds: selectedItem?.educationLevelIds || [],
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
  const handleEdit = useCallback((item: AcademicGroup) => {
    setSelectedItem(item);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: AcademicGroup) => {
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
          educationLevelIds: selectedItem.educationLevelIds,
          status: selectedItem.status,
        };
        
        const changedFields = getChangedFields(originalData, data);
        
        if (Object.keys(changedFields).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        await dispatch(updateAcademicGroup({ id: selectedItem.id, data: changedFields })).unwrap();
        showToast(`Academic Group ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createAcademicGroup(data)).unwrap();
        showToast(`Academic Group ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} academic group`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteAcademicGroup(itemToDelete.id)).unwrap();
      showToast(`Academic Group ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete academic group', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ name: '', educationLevelIds: [], status: 'Active' });
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
   * Get education level names from IDs
   */
  const getEducationLevelNames = (levelIds: string[]): string[] => {
    return levelIds.map(id => {
      const level = educationLevels.find(el => el.id === id);
      return level ? level.name : 'Unknown';
    });
  };

  if (loading && academicGroups.length === 0) {
    return <LoadingSpinner message="Loading academic groups..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Academic Group Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Academic Group
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search academic groups..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Data Table */}
      {academicGroups.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Education Levels</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {academicGroups.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getEducationLevelNames(item.educationLevelIds).map((levelName, index) => (
                          <Chip
                            key={index}
                            label={levelName}
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
          title="No academic groups found"
          description="No academic groups available. Add some to get started."
          actionLabel="Add Academic Group"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Academic Group' : 'Add Academic Group'}
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
                    placeholder="e.g., Science, Commerce, Arts"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                  />
                )}
              />

              <Controller
                name="educationLevelIds"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.educationLevelIds}>
                    <InputLabel>Education Levels *</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Education Levels *" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => {
                            const level = educationLevels.find(el => el.id === value);
                            return (
                              <Chip
                                key={value}
                                label={level?.name || 'Unknown'}
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {educationLevels.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          <Checkbox checked={field.value.indexOf(level.id) > -1} />
                          <ListItemText primary={level.name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.educationLevelIds && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.educationLevelIds.message}
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
        title="Delete Academic Group"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

AcademicGroupSection.displayName = 'AcademicGroupSection';

export { AcademicGroupSection };