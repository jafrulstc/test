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
  selectMasterBoardingState,
  setFilters,
  setPagination,
  fetchBoardingMealTypes,
  createBoardingMealType,
  updateBoardingMealType,
  deleteBoardingMealType,
  selectMasterBoardingMealTypes,
} from '~/features/boarding/core/store/masterBoardingSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { boardingMealTypeSchema, type BoardingMealTypeFormData } from '~/features/boarding/core/schemas/masterBoardingSchema';
import type { BoardingMealType, BoardingMealTypeFilters } from '~/features/boarding/core/types/masterBoardingType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';
import { getStatusColor } from './utils/masterBoardingUtils';
import { STATUSES, STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

/**
 * Boarding Meal Type section component
 */
const BoardingMealTypeSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectMasterBoardingState);
  const boardingMealTypes = useAppSelector(selectMasterBoardingMealTypes);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BoardingMealType | null>(null);
  const [originalItem, setOriginalItem] = useState<BoardingMealTypeFormData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BoardingMealType | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BoardingMealTypeFormData>({
    resolver: zodResolver(boardingMealTypeSchema),
    defaultValues: {
      name: '',
      status: STATUSES_OBJECT.ACTIVE
    },
  });

  // Update filters when search term or status changes
  useEffect(() => {
    const newFilters: BoardingMealTypeFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
    };

    if (JSON.stringify(newFilters) !== JSON.stringify(filters.mealTypes)) {
      dispatch(setFilters({ section: 'mealTypes', filters: newFilters }));
    }
  }, [debouncedSearchTerm, statusFilter, dispatch, filters.mealTypes]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters: filters.mealTypes,
    };
    dispatch(fetchBoardingMealTypes(fetchParams));
  }, [pagination.page, pagination.limit, filters.mealTypes, dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({
        name: selectedItem?.name || '',
        status: selectedItem?.status || 'PENDING'
      });
      setOriginalItem(selectedItem ? { name: selectedItem.name, status: selectedItem.status } : null);
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
  const handleEdit = useCallback((item: BoardingMealType) => {
    setSelectedItem(item);
    setOriginalItem({ name: item.name, status: item.status });
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: BoardingMealType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: BoardingMealTypeFormData) => {
    try {
      if (isEdit && selectedItem && originalItem) {
        const updatedFields = getChangedFields(originalItem, data);

        if (Object.keys(updatedFields).length > 0) {
          await dispatch(updateBoardingMealType({ id: selectedItem.id, data: updatedFields })).unwrap();
          showToast(`Meal Type ${SUCCESS_MESSAGES.UPDATED}`, 'success');
        } else {
          showToast('No changes detected', 'info');
        }
      } else if (!isEdit) {
        await dispatch(createBoardingMealType(data)).unwrap();
        showToast(`Meal Type ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} meal type`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteBoardingMealType(itemToDelete.id)).unwrap();
      showToast(`Meal Type ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete meal type', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ name: '', status: "ACTIVE" });
  }, [reset]);



  if (loading && boardingMealTypes.length === 0) {
    return <LoadingSpinner message="Loading meal types..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Meal Type Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Meal Type
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search meal types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 300 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              {STATUSES.map((item, index) => (
                <MenuItem key={index} value={item}>{item}</MenuItem>
              ))

              }
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Data Table */}
      {boardingMealTypes.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boardingMealTypes.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
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
          title="No meal types found"
          description="No meal types available. Add some to get started."
          actionLabel="Add Meal Type"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Meal Type' : 'Add Meal Type'}
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
                    placeholder="e.g., Breakfast, Lunch, Dinner"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
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
                      {STATUSES.map((item: string, index: number) => (
                        <MenuItem key={index} value={item}>{item}</MenuItem>
                      ))

                      }
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
        title="Delete Meal Type"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

BoardingMealTypeSection.displayName = 'BoardingMealTypeSection';

export { BoardingMealTypeSection };
