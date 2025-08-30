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
  selectSections,
  setFilters,
  setPagination,
  fetchSections,
  createSection,
  updateSection,
  deleteSection,
} from '~/features/core/store/academicSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { sectionSchema } from '~/features/core/schemas/academicSchemas';
import type { Section } from '~/features/core/types/academic';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';

type FormData = {
  name: string;
  capacity?: number;
  status: 'Active' | 'Inactive';
};

/**
 * Section section component
 */
const SectionSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectAcademicState);
  const sections = useAppSelector(selectSections);

  const [searchTerm, setSearchTerm] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Section | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Section | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { 
      name: '', 
      capacity: 1,
      status: 'Active' 
    },
  });

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
    dispatch(fetchSections(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({ 
        name: selectedItem?.name || '', 
        capacity: selectedItem?.capacity ?? 1,
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
  const handleEdit = useCallback((item: Section) => {
    setSelectedItem(item);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: Section) => {
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
          capacity: selectedItem.capacity,
          status: selectedItem.status,
        };
        
        const changedFields = getChangedFields(originalData, data);
        
        if (Object.keys(changedFields).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        await dispatch(updateSection({ id: selectedItem.id, data: changedFields })).unwrap();
        showToast(`Section ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createSection(data)).unwrap();
        showToast(`Section ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} section`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteSection(itemToDelete.id)).unwrap();
      showToast(`Section ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete section', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ name: '', capacity: undefined, status: 'Active' });
  }, [reset]);

  /**
   * Get status color
   */
  const getStatusColor = (status: string): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading && sections.length === 0) {
    return <LoadingSpinner message="Loading sections..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Section Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Section
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search sections..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Data Table */}
      {sections.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sections.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.capacity || 'Not specified'}
                      </Typography>
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
          title="No sections found"
          description="No sections available. Add some to get started."
          actionLabel="Add Section"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Section' : 'Add Section'}
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
                    placeholder="e.g., A, B, C"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                  />
                )}
              />

              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Capacity"
                    type="number"
                    placeholder="e.g., 40"
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                    value={field.value ?? 1}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === '' ? 1 : Number(v));
                    }}
                  />
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
        title="Delete Section"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

SectionSection.displayName = 'SectionSection';

export { SectionSection };