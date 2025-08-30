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
  selectMasterBoardingPackageTypes,
  setFilters,
  setPagination,
  fetchBoardingPackageTypes,
  createBoardingPackageType,
  updateBoardingPackageType,
  deleteBoardingPackageType,
} from '~/features/boarding/core/store/masterBoardingSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { boardingPackageTypeSchema, type BoardingPackageTypeFormData } from '~/features/boarding/core/schemas/masterBoardingSchema';
import type { BoardingPackageType, BoardingPackageTypeFilters } from '~/features/boarding/core/types/masterBoardingType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';
import { getStatusColor } from './utils/masterBoardingUtils';
import { STATUSES, STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

/**
 * Boarding Package Type section component
 */
const BoardingPackageTypeSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectMasterBoardingState);
  const boardingPackageTypes = useAppSelector(selectMasterBoardingPackageTypes);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BoardingPackageType | null>(null);
  const [originalItem, setOriginalItem] = useState<BoardingPackageTypeFormData | null>(null); // New state for original data
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BoardingPackageType | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BoardingPackageTypeFormData>({
    resolver: zodResolver(boardingPackageTypeSchema),
    defaultValues: {
      name: '',
      status: STATUSES_OBJECT.ACTIVE
    },
  });

  // Update filters when search term or status changes
  useEffect(() => {
    const newFilters: BoardingPackageTypeFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
    };

    if (JSON.stringify(newFilters) !== JSON.stringify(filters.packageTypes)) {
      dispatch(setFilters({ section: 'packageTypes', filters: newFilters }));
    }
  }, [debouncedSearchTerm, statusFilter, dispatch, filters.packageTypes]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters: filters.packageTypes,
    };
    dispatch(fetchBoardingPackageTypes(fetchParams));
  }, [pagination.page, pagination.limit, filters.packageTypes, dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({
        name: selectedItem?.name || '',
        status: selectedItem?.status || 'PENDING',
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
  const handleEdit = useCallback((item: BoardingPackageType) => {
    setSelectedItem(item);
    setOriginalItem({ name: item.name, status: item.status }); // Set original data
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: BoardingPackageType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle form submission
   */
  // const onSubmit = async (data: BoardingPackageTypeFormData) => {
  //   try {
  //     if (isEdit && selectedItem) {
  //       const updatedFields: Partial<BoardingPackageTypeFormData> = {};
  //       if (originalItem?.name !== data.name) {
  //         updatedFields.name = data.name;
  //       }
  //       if (originalItem?.status !== data.status) {
  //         updatedFields.status = data.status;
  //       }

  //       if (Object.keys(updatedFields).length > 0) {
  //         await dispatch(updateBoardingPackageType({ id: selectedItem.id, data: updatedFields })).unwrap();
  //         showToast(`Package Type ${SUCCESS_MESSAGES.UPDATED}`, 'success');
  //       } else {
  //         showToast('No changes detected', 'info');
  //       }
  //     } else {
  //       await dispatch(createBoardingPackageType(data)).unwrap();
  //       showToast(`Package Type ${SUCCESS_MESSAGES.CREATED}`, 'success');
  //     }
  //     handleFormModalClose();
  //   } catch (error: any) {
  //     showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} package type`, 'error');
  //   }
  // };

  const onSubmit = async (data: BoardingPackageTypeFormData) => {
    try {
      if (isEdit && selectedItem && originalItem) {
        const changes = getChangedFields(originalItem, data);

        if (Object.keys(changes).length === 0) {
          showToast('No changes detected', 'info');
          handleFormModalClose();
          return;
        }

        await dispatch(updateBoardingPackageType({ id: selectedItem.id, data: changes })).unwrap();
        showToast(`Package Type ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createBoardingPackageType(data)).unwrap();
        showToast(`Package Type ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }

      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} package type`, 'error');
    }
  };
  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteBoardingPackageType(itemToDelete.id)).unwrap();
      showToast(`Package Type ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete package type', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ name: '', status: STATUSES_OBJECT.ACTIVE });
  }, [reset]);


  if (loading && boardingPackageTypes.length === 0) {
    return <LoadingSpinner message="Loading package types..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Package Type Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Package Type
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
            placeholder="Search package types..."
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
      {boardingPackageTypes.length > 0 ? (
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
                {boardingPackageTypes.map((item) => (
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
          title="No package types found"
          description="No package types available. Add some to get started."
          actionLabel="Add Package Type"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Package Type' : 'Add Package Type'}
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
                    placeholder="e.g., Normal, Premium, VIP"
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
                      {STATUSES.map((item, index) => (
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
        // onConfirm={ ()=> console.log('delete action coming soon')  }
        title="Delete Package Type"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

BoardingPackageTypeSection.displayName = 'BoardingPackageTypeSection';

export { BoardingPackageTypeSection };
