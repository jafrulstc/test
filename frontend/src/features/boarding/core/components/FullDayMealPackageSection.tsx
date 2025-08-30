import React, { useEffect, useState, memo, useCallback, useMemo } from 'react';
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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Edit, Delete, Search, Add, Close, Remove } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectMasterBoardingState,
  setFilters,
  setPagination,
  fetchFullDayMealPackages,
  createFullDayMealPackage,
  updateFullDayMealPackage,
  deleteFullDayMealPackage,
  selectMasterFullDayMealPackages,
  fetchBoardingMealTypes,
  selectMasterBoardingMealTypes,
  fetchBoardingPackages,
  selectMasterBoardingPackages,
  fetchBoardingMenuItems,
  selectMasterBoardingMenuItems,
  fetchBoardingPackageTypes,
  selectMasterBoardingPackageTypes,
} from '~/features/boarding/core/store/masterBoardingSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { fullDayMealPackageSchema, type FullDayMealPackageFormData } from '~/features/boarding/core/schemas/masterBoardingSchema';
import type { FullDayMealPackage, FullDayMealPackageFilters } from '~/features/boarding/core/types/masterBoardingType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';
import { getStatusColor } from './utils/masterBoardingUtils';
import { STATUSES, STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { Status } from '~/shared/types/common';

/**
 * Full Day Meal Package section component
 */
const FullDayMealPackageSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectMasterBoardingState);
  const fullDayMealPackages = useAppSelector(selectMasterFullDayMealPackages);
  const mealTypes = useAppSelector(selectMasterBoardingMealTypes);
  const packages = useAppSelector(selectMasterBoardingPackages);
  const menuItems = useAppSelector(selectMasterBoardingMenuItems);
  const packageTypes = useAppSelector(selectMasterBoardingPackageTypes);

  const [searchTerm, setSearchTerm] = useState('');
  // const [statusFilter, setStatusFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>(''); // Fixed type
  const [packageTypeFilter, setPackageTypeFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FullDayMealPackage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FullDayMealPackage | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FullDayMealPackageFormData>({
    resolver: zodResolver(fullDayMealPackageSchema),
    defaultValues: {
      name: '',
      status: STATUSES_OBJECT.ACTIVE,
      packageTypeId: '',
      packageId: '',
      price: 0,
      note: '',
      meals: [
        {
          mealTypeId: '',
          menuItemId: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'meals',
  });

  const selectedPackageTypeId = watch('packageTypeId');

  // Fetch required data for dropdowns
  useEffect(() => {
    dispatch(fetchBoardingMealTypes({}));
    dispatch(fetchBoardingPackages({}));
    dispatch(fetchBoardingMenuItems({}));
    dispatch(fetchBoardingPackageTypes({}));
  }, [dispatch]);

  // Update filters when search term, status, or package type changes
  useEffect(() => {
    const newFilters: FullDayMealPackageFilters = {
      search: debouncedSearchTerm || undefined,
      // status: statusFilter || undefined,
      status: statusFilter === '' ? undefined : statusFilter,
      packageTypeId: packageTypeFilter || undefined,
    };

    if (JSON.stringify(newFilters) !== JSON.stringify(filters.fullDayMealPackages)) {
      dispatch(setFilters({ section: 'fullDayMealPackages', filters: newFilters }));
    }
  }, [debouncedSearchTerm, statusFilter, packageTypeFilter, dispatch, filters.fullDayMealPackages]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters: filters.fullDayMealPackages,
    };
    dispatch(fetchFullDayMealPackages(fetchParams));
  }, [pagination.page, pagination.limit, filters.fullDayMealPackages, dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      if (selectedItem) {
        reset({
          name: selectedItem.name,
          status: selectedItem.status,
          packageTypeId: selectedItem.packageTypeId,
          packageId: selectedItem.packageId,
          price: selectedItem.price,
          note: selectedItem.note || '',
          meals: selectedItem.meals.map(meal => ({
            // Include meal ID here
            id: meal.id,
            mealTypeId: meal.mealTypeId,
            menuItemId: meal.menuItemId,
          })),
        });
      }
      else {
        reset({
          name: '',
          status: STATUSES_OBJECT.ACTIVE,
          packageTypeId: '',
          packageId: '',
          price: 0,
          note: '',
          meals: [
            {
              mealTypeId: '',
              menuItemId: '',
            },
          ],
        });
      }
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
  const handleEdit = useCallback((item: FullDayMealPackage) => {
    setSelectedItem(item);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: FullDayMealPackage) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Add new meal to the form
   */
  const addMeal = useCallback(() => {
    if (fields.length >= 10) {
      showToast('Maximum 10 meals allowed per package', 'warning');
      return;
    }
    append({
      mealTypeId: '',
      menuItemId: '',
    });
  }, [append, fields.length, showToast]);

  /**
   * Remove meal from the form
   */
  const removeMeal = useCallback((index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  }, [remove, fields.length]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: FullDayMealPackageFormData) => {
    try {
      if (isEdit && selectedItem) {
        // Include meal IDs for existing meals
        const updateData = {
          ...data,
          meals: data.meals.map((meal, index) => ({
            ...meal,
            // Use existing ID or generate a temporary one for new meals
            id: selectedItem.meals[index]?.id || `temp-${Date.now()}-${index}`
          }))
        };

        await dispatch(updateFullDayMealPackage({
          id: selectedItem.id,
          data: updateData
        })).unwrap();
        showToast(`Full Day Meal Package ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createFullDayMealPackage(data)).unwrap();
        showToast(`Full Day Meal Package ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} full day meal package`, 'error');
    }
  };
  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteFullDayMealPackage(itemToDelete.id)).unwrap();
      showToast(`Full Day Meal Package ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete full day meal package', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset();
  }, [reset]);


  // Add dependency array to useMemo:
  const filteredPackages = useMemo(() => {
    if (!selectedPackageTypeId) return packages;
    return packages.filter(pkg => pkg.packageTypeId === selectedPackageTypeId);
  }, [packages, selectedPackageTypeId]); // Added dependencies

  /**
   * Get entity name by ID
   */
  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Unknown';
  };

  /**
   * Get selected meal types to prevent duplicates
   */
  const getSelectedMealTypes = (currentIndex: number, meals: any[]): string[] => {
    return meals
      .map((meal, index) => index !== currentIndex ? meal.mealTypeId : null)
      .filter(Boolean);
  };

  /**
   * Get selected menu items to prevent duplicates
   */
  const getSelectedMenuItems = (currentIndex: number, meals: any[]): string[] => {
    return meals
      .map((meal, index) => index !== currentIndex ? meal.menuItemId : null)
      .filter(Boolean);
  };

  /**
   * Get filtered packages based on selected package type
   */
  const getFilteredPackages = () => {
    if (!selectedPackageTypeId) return packages;
    return packages.filter(pkg => pkg.packageTypeId === selectedPackageTypeId);
  };

  if (loading && fullDayMealPackages.length === 0) {
    return <LoadingSpinner message="Loading full day meal packages..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Full Day Meal Package Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Full Day Package
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
              ))}
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
      {fullDayMealPackages.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Package Name</TableCell>
                  <TableCell>Package Type</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell>Meals Count</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fullDayMealPackages.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
                      {item.note && (
                        <Typography variant="caption" color="text.secondary">
                          {item.note}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getEntityName(packageTypes, item.packageTypeId)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getEntityName(packages, item.packageId)}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.meals.length} meals
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        ৳{item.price.toLocaleString()}
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
          title="No full day meal packages found"
          description="No full day meal packages available. Add some to get started."
          actionLabel="Add Full Day Package"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Full Day Meal Package' : 'Add Full Day Meal Package'}
            </Typography>
            <IconButton onClick={handleFormModalClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Package Details */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Package Name *"
                        placeholder="e.g., Student Complete Day Package"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        autoFocus
                      />
                    )}
                  />
                  {!isEdit &&
                    <>
                      <Controller
                        name="packageTypeId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.packageTypeId}>
                            <InputLabel>Package Type *</InputLabel>

                            <Select
                              {...field}

                              label="Package Type *"
                              value={field.value || ''}
                            >
                              <MenuItem value="">Select Package Type</MenuItem>
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
                        name="packageId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.packageId}>
                            <InputLabel>Package *</InputLabel>
                            <Select
                              {...field}
                              label="Package *"
                              value={field.value || ''}
                              disabled={!selectedPackageTypeId}
                            >
                              <MenuItem value="">Select Package</MenuItem>
                              {getFilteredPackages().map((pkg) => (
                                <MenuItem key={pkg.id} value={pkg.id}>
                                  {pkg.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.packageId && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                {errors.packageId.message}
                              </Typography>
                            )}
                            {!selectedPackageTypeId && (

                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                                Please select a package type first
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                      <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Total Price (৳) *"
                            type="number"
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </>
                  }



                  <Controller
                    name="note"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Note (optional)"
                        multiline
                        rows={2}
                        error={!!errors.note}
                        helperText={errors.note?.message}
                      />
                    )}
                  />

                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel>Status *</InputLabel>
                        <Select
                          {...field}
                          label="Status *"
                          value={field.value || ''}
                        >
                          {STATUSES.map((item, index) => (
                            <MenuItem key={index} value={item}>{item}</MenuItem>
                          ))}

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
              </Grid>

              {/* Meals Section */}
              {!isEdit &&
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Meals ({fields.length})
                    </Typography>
                    <Button
                      variant="outlined"

                      size="small"
                      startIcon={<Add />}
                      onClick={addMeal}
                      disabled={fields.length >= 10}
                    >
                      Add Meal
                    </Button>
                  </Box>

                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {fields.map((field, index) => (
                      <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Meal {index + 1}
                            </Typography>
                            {fields.length > 1 && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeMeal(index)}
                              >
                                <Remove />
                              </IconButton>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Controller
                              name={`meals.${index}.mealTypeId`}
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth size="small" error={!!(errors.meals?.[index]?.mealTypeId)}>
                                  <InputLabel>Meal Type *</InputLabel>
                                  <Select
                                    {...field}
                                    label="Meal Type *"
                                    value={field.value || ''}
                                  >
                                    <MenuItem value="">Select Meal Type</MenuItem>
                                    {mealTypes
                                      .filter(mt => mt &&
                                        !getSelectedMealTypes(index, fields).includes(mt.id) ||
                                        mt.id === field.value
                                      )
                                      .map((mt) => (
                                        <MenuItem key={mt.id} value={mt.id}>
                                          {mt.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                  {errors.meals?.[index]?.mealTypeId && (
                                    <Typography variant="caption" color="error">
                                      {errors.meals[index]?.mealTypeId?.message}
                                    </Typography>
                                  )}

                                </FormControl>
                              )}
                            />

                            <Controller
                              name={`meals.${index}.menuItemId`}
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth size="small" error={!!(errors.meals?.[index]?.menuItemId)}>
                                  <InputLabel>Menu Item *</InputLabel>

                                  <Select
                                    {...field}
                                    label="Menu Item *"
                                    value={field.value || ''}
                                  >
                                    <MenuItem value="">Select Menu Item</MenuItem>
                                    {menuItems
                                      .filter(mi =>
                                        !getSelectedMenuItems(index, fields).includes(mi.id) ||
                                        mi.id === field.value
                                      )
                                      .map((mi) => (
                                        <MenuItem key={mi.id} value={mi.id}>
                                          {mi.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                  {errors.meals?.[index]?.menuItemId && (
                                    <Typography variant="caption" color="error">
                                      {errors.meals[index]?.menuItemId?.message}
                                    </Typography>
                                  )}
                                </FormControl>
                              )}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  {fields.length >= 10 && (
                    <Typography variant="caption" color="text.secondary">
                      Maximum 10 meals allowed per package
                    </Typography>
                  )}
                </Grid>
              }
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
        title="Delete Full Day Meal Package"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

// FullDay
FullDayMealPackageSection.displayName = 'FullDayMealPackageSection';

export { FullDayMealPackageSection };