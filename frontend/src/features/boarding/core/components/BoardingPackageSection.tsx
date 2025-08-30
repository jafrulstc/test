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
  fetchBoardingPackages, // নতুন অ্যাকশন
  createBoardingPackage, // নতুন অ্যাকশন
  updateBoardingPackage, // নতুন অ্যাকশন
  deleteBoardingPackage, // নতুন অ্যাকশন
  selectMasterBoardingPackages, // নতুন সিলেক্টর
  fetchBoardingMealTypes, // ড্রপডাউনের জন্য
  selectMasterBoardingMealTypes, // ড্রপডাউনের জন্য
  fetchBoardingPackageTypes, // ড্রপডাউনের জন্য
  selectMasterBoardingPackageTypes, // ড্রপডাউনের জন্য
} from '~/features/boarding/core/store/masterBoardingSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { boardingPackageSchema, type BoardingPackageFormData } from '~/features/boarding/core/schemas/masterBoardingSchema';
import type { BoardingPackage, BoardingPackageFilters } from '~/features/boarding/core/types/masterBoardingType'; // 'BoardingPackage' এবং 'BoardingPackageFilters' টাইপ যোগ করুন masterBoardingType.ts এ।
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';
import { Status } from '~/shared/types/common'; // Assuming Status type exists here
import { getStatusColor } from './utils/masterBoardingUtils';
import { STATUSES, STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

/**
 * Boarding Package section component
 */
const BoardingPackageSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectMasterBoardingState);
  const boardingPackages = useAppSelector(selectMasterBoardingPackages);
  const packageTypes = useAppSelector(selectMasterBoardingPackageTypes); // Package types for dropdown

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>(''); // New filter for Package Type

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BoardingPackage | null>(null);
  const [originalItem, setOriginalItem] = useState<BoardingPackageFormData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BoardingPackage | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BoardingPackageFormData>({
    resolver: zodResolver(boardingPackageSchema),
    defaultValues: {
      name: '',
      status: STATUSES_OBJECT.ACTIVE,
      packageTypeId: '',
    },
  });

  // Update filters when search term, status, meal type, or package type changes
  useEffect(() => {
    const newFilters: BoardingPackageFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      packageTypeId: packageTypeFilter || undefined,
    };

    if (JSON.stringify(newFilters) !== JSON.stringify(filters.packages)) {
      dispatch(setFilters({ section: 'packages', filters: newFilters }));
    }
  }, [debouncedSearchTerm, statusFilter, packageTypeFilter, dispatch, filters.packages]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters: filters.packages,
    };
    dispatch(fetchBoardingPackages(fetchParams));
  }, [pagination.page, pagination.limit, filters.packages, dispatch]);

  // Fetch meal types and package types for dropdowns
  useEffect(() => {
    dispatch(fetchBoardingMealTypes({}));
    dispatch(fetchBoardingPackageTypes({}));
  }, [dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({
        name: selectedItem?.name || '',
        status: selectedItem?.status || 'PENDING',
        packageTypeId: selectedItem?.packageTypeId || '',
      });
      setOriginalItem(selectedItem ? {
        name: selectedItem.name,
        status: selectedItem.status,
        packageTypeId: selectedItem.packageTypeId,
      } : null);
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
  const handleEdit = useCallback((item: BoardingPackage) => {
    setSelectedItem(item);
    setOriginalItem({ name: item.name, status: item.status, packageTypeId: item.packageTypeId });
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: BoardingPackage) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: BoardingPackageFormData) => {
    try {
      if (isEdit && selectedItem && originalItem) {
        const updatedFields = getChangedFields(originalItem, data);

        if (Object.keys(updatedFields).length > 0) {
          await dispatch(updateBoardingPackage({ id: selectedItem.id, data: updatedFields })).unwrap();
          showToast(`Package ${SUCCESS_MESSAGES.UPDATED}`, 'success');
        } else {
          showToast('No changes detected', 'info');
        }
      } else if (!isEdit) {
        await dispatch(createBoardingPackage(data)).unwrap();
        showToast(`Package ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} package`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteBoardingPackage(itemToDelete.id)).unwrap();
      showToast(`Package ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete package', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ name: '', status: STATUSES_OBJECT.ACTIVE, packageTypeId: '' });
  }, [reset]);


  if (loading && boardingPackages.length === 0) {
    return <LoadingSpinner message="Loading packages..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Package Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Package
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as Status)}
            >
              <MenuItem value="">All Status</MenuItem>
              {STATUSES.map((item, index) => (
                <MenuItem key={index} value={item}>{item}</MenuItem>
              ))

              }
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Package Type</InputLabel>
            <Select
              value={packageTypeFilter}
              label="Package Type"
              onChange={(e) => setPackageTypeFilter(e.target.value)}
            >
              <MenuItem value="">All Package Types</MenuItem>
              {packageTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Data Table */}
      {boardingPackages.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Package Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boardingPackages.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={packageTypes.find(type => type.id === item.packageTypeId)?.name || 'N/A'}
                        size="small"
                        variant="outlined"
                      />
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
          title="No packages found"
          description="No packages available. Add some to get started."
          actionLabel="Add Package"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Package' : 'Add Package'}
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
                    placeholder="e.g., Premium Veg Plan, Standard Non-Veg"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                  />
                )}
              />

              <Controller
                name="packageTypeId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.packageTypeId}>
                    <InputLabel>Package Type *</InputLabel>
                    <Select {...field} label="Package Type *">
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {packageTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.packageTypeId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.packageTypeId.message}
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
        title="Delete Package"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

BoardingPackageSection.displayName = 'BoardingPackageSection';

export { BoardingPackageSection };