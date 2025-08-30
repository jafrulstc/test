import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Close,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectMasterBoardingState,
  selectMasterBoardingPackages,
  selectMasterBoardingPackageTypes,
  fetchBoardingPackages,
  fetchAllMasterBoardingPackageTypes,
  createBoardingPackage,
  updateBoardingPackage,
  deleteBoardingPackage,
  setFilters,
  setPagination,
} from '~/features/boarding/core/store/masterBoardingSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { boardingPackageSchema, type BoardingPackageFormData } from '~/features/boarding/core/schemas/masterBoardingSchema';
import type { BoardingPackage, BoardingPackageFilters } from '../types/boardingType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { BOARDING_STATUS_TYPES, PACKAGE_TYPES, PACKAGE_TYPE_COLORS } from '~/features/boarding/constant/boardingConst';
import { getStatusColor } from '~/shared/utils/colors';

/**
 * Package Management Component
 * Manages boarding packages (Normal/Premium) with meal counts and fees
 */
const PackageManagement = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectMasterBoardingState);
  const boardingPackages = useAppSelector(selectMasterBoardingPackages);
  const boardingPackageTypes = useAppSelector(selectMasterBoardingPackageTypes);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<BoardingPackage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<BoardingPackage | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isEdit = Boolean(selectedPackage);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BoardingPackageFormData>({
    resolver: zodResolver(boardingPackageSchema),
    defaultValues: {
      name: '',
      typeId: '',
      description: '',
      mealCount: 3,
      monthlyFee: 0,
      status: BOARDING_STATUS_TYPES.ACTIVE,
    },
  });

  // Fetch package types for dropdown
  useEffect(() => {
    if (boardingPackageTypes.length === 0) {
      dispatch(fetchAllMasterBoardingPackageTypes());
    }
  }, [dispatch, boardingPackageTypes.length]);

  // Update filters when search term or filter values change
  useEffect(() => {
    const newFilters: BoardingPackageFilters = {
      search: debouncedSearchTerm || undefined,
      typeId: typeFilter || undefined,
      status: statusFilter || undefined,
    };

    if (JSON.stringify(newFilters) !== JSON.stringify(filters.packages)) {
      dispatch(setFilters({ section: 'packages', filters: newFilters }));
    }
  }, [debouncedSearchTerm, typeFilter, statusFilter, dispatch, filters.packages]);

  // Fetch packages when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters: filters.packages,
    };
    dispatch(fetchBoardingPackages(fetchParams));
  }, [pagination.page, pagination.limit, filters.packages, dispatch]);

  // Reset form when modal opens or package changes
  useEffect(() => {
    if (formModalOpen) {
      reset({
        name: selectedPackage?.name || '',
        typeId: selectedPackage?.typeId || '',
        description: selectedPackage?.description || '',
        mealCount: selectedPackage?.mealCount || 3,
        monthlyFee: selectedPackage?.monthlyFee || 0,
        status: selectedPackage?.status || BOARDING_STATUS_TYPES.ACTIVE,
      });
    }
  }, [formModalOpen, selectedPackage, reset]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  /**
   * Handle add new package
   */
  const handleAddNew = useCallback(() => {
    setSelectedPackage(null);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle edit package
   */
  const handleEdit = useCallback((pkg: BoardingPackage) => {
    setSelectedPackage(pkg);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete package
   */
  const handleDelete = useCallback((pkg: BoardingPackage) => {
    setPackageToDelete(pkg);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: BoardingPackageFormData) => {
    try {
      if (isEdit && selectedPackage) {
        await dispatch(updateBoardingPackage({ id: selectedPackage.id, data })).unwrap();
        showToast(`Boarding Package ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createBoardingPackage(data)).unwrap();
        showToast(`Boarding Package ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} boarding package`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!packageToDelete) return;

    try {
      await dispatch(deleteBoardingPackage(packageToDelete.id)).unwrap();
      showToast(`Boarding Package ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setPackageToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete boarding package', 'error');
    }
  }, [packageToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedPackage(null);
    reset();
  }, [reset]);


  /**
   * Get package type color
   */
  const getPackageTypeColor = (typeId: string): 'primary' | 'secondary' | 'default' => {
    const packageType = boardingPackageTypes.find(type => type.id === typeId);
    if (!packageType) return 'default';
    
    switch (packageType.name) {
      case PACKAGE_TYPES.PREMIUM:
        return PACKAGE_TYPE_COLORS[PACKAGE_TYPES.PREMIUM];
      case PACKAGE_TYPES.NORMAL:
        return PACKAGE_TYPE_COLORS[PACKAGE_TYPES.NORMAL];
      default:
        return 'default';
    }
  };

  /**
   * Get package type name by ID
   */
  const getPackageTypeName = (typeId: string): string => {
    const packageType = boardingPackageTypes.find(type => type.id === typeId);
    return packageType ? packageType.name : 'Unknown';
  };

  if (loading && boardingPackages.length === 0) {
    return <LoadingSpinner message="Loading boarding packages..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Boarding Package Management
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
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 6}}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid size={{xs: 12, md: 3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Package Type</InputLabel>
              <Select
                value={typeFilter}
                label="Package Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {boardingPackageTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{xs: 12, md: 3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value={BOARDING_STATUS_TYPES.ACTIVE}>{BOARDING_STATUS_TYPES.ACTIVE}</MenuItem>
                <MenuItem value={BOARDING_STATUS_TYPES.INACTIVE}>{BOARDING_STATUS_TYPES.INACTIVE}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Packages Table */}
      {boardingPackages.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Package Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Meal Count</TableCell>
                  <TableCell>Monthly Fee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boardingPackages.map((pkg) => (
                  <TableRow key={pkg.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {pkg.name}
                        </Typography>
                        {pkg.description && (
                          <Typography variant="body2" color="text.secondary">
                            {pkg.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getPackageTypeName(pkg.typeId)}
                        size="small"
                        color={getPackageTypeColor(pkg.typeId)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pkg.mealCount} meals/day
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        ৳{pkg.monthlyFee.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pkg.status}
                        size="small"
                        color={getStatusColor(pkg.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(pkg.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(pkg)}
                        color="primary"
                        title="Edit Package"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(pkg)}
                        color="error"
                        title="Delete Package"
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
          title="No boarding packages found"
          description="No boarding packages available. Add some to get started."
          actionLabel="Add Package"
          onAction={handleAddNew}
        />
      )}

      {/* Package Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {isEdit ? 'Edit Boarding Package' : 'Add Boarding Package'}
            </Typography>
            <IconButton onClick={handleFormModalClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid size={{xs: 12}}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Package Name *"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      autoFocus
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs: 12, md: 6}}>
                <Controller
                  name="typeId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.typeId}>
                      <InputLabel>Package Type *</InputLabel>
                      <Select {...field} label="Package Type *">
                        <MenuItem value="">Select Package Type</MenuItem>
                        {boardingPackageTypes.map((type) => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.typeId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.typeId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{xs: 12, md: 6}}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Status *</InputLabel>
                      <Select {...field} label="Status *">
                        <MenuItem value={BOARDING_STATUS_TYPES.ACTIVE}>{BOARDING_STATUS_TYPES.ACTIVE}</MenuItem>
                        <MenuItem value={BOARDING_STATUS_TYPES.INACTIVE}>{BOARDING_STATUS_TYPES.INACTIVE}</MenuItem>
                      </Select>
                      {errors.status && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.status.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{xs: 12, md: 6}}>
                <Controller
                  name="mealCount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Meal Count *"
                      type="number"
                      error={!!errors.mealCount}
                      helperText={errors.mealCount?.message}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs: 12, md: 6}}>
                <Controller
                  name="monthlyFee"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Monthly Fee (৳) *"
                      type="number"
                      error={!!errors.monthlyFee}
                      helperText={errors.monthlyFee?.message}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid size={{xs: 12}}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
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
        title="Delete Boarding Package"
        message={`Are you sure you want to delete "${packageToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

PackageManagement.displayName = 'PackageManagement';

export { PackageManagement };