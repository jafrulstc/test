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
  fetchBoardingMenuItems,
  createBoardingMenuItem,
  updateBoardingMenuItem,
  deleteBoardingMenuItem,
  selectMasterBoardingMenuItems,
  fetchBoardingSubMenuCategories, // To get sub menu categories for dropdown
  selectMasterBoardingSubMenuCategories, // To get sub menu categories for dropdown
} from '~/features/boarding/core/store/masterBoardingSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { boardingMenuItemSchema, type BoardingMenuItemFormData } from '~/features/boarding/core/schemas/masterBoardingSchema';
import type { BoardingMenuItem, BoardingMenuItemFilters } from '~/features/boarding/core/types/masterBoardingType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';
import { MultiSelectChips } from '~/shared/components/ui/MultiSelectChips'; // For multi-select
import { Status } from '~/shared/types/common';
import { getStatusColor } from './utils/masterBoardingUtils';
import { STATUSES, STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

/**
 * Boarding Menu Item section component
 */
const BoardingMenuItemSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectMasterBoardingState);
  const boardingMenuItems = useAppSelector(selectMasterBoardingMenuItems);
  const subMenuCategories = useAppSelector(selectMasterBoardingSubMenuCategories); // For dropdown

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [subMenuCategoryFilter, setSubMenuCategoryFilter] = useState<string[]>([]); // New filter for sub menu categories
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BoardingMenuItem | null>(null);
  const [originalItem, setOriginalItem] = useState<BoardingMenuItemFormData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BoardingMenuItem | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BoardingMenuItemFormData>({
    resolver: zodResolver(boardingMenuItemSchema),
    defaultValues: {
      name: '',
      status: "ACTIVE",
      subMenuCategoryIds: [],
    },
  });

  // Update filters when search term, status, or sub menu categories change
  useEffect(() => {
    const newFilters: BoardingMenuItemFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      subMenuCategoryIds: subMenuCategoryFilter.length > 0 ? subMenuCategoryFilter : undefined,
    };

    if (JSON.stringify(newFilters) !== JSON.stringify(filters.menuItems)) {
      dispatch(setFilters({ section: 'menuItems', filters: newFilters }));
    }
  }, [debouncedSearchTerm, statusFilter, subMenuCategoryFilter, dispatch, filters.menuItems]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters: filters.menuItems,
    };
    dispatch(fetchBoardingMenuItems(fetchParams));
  }, [pagination.page, pagination.limit, filters.menuItems, dispatch]);

  // Fetch sub menu categories for dropdown
  useEffect(() => {
    dispatch(fetchBoardingSubMenuCategories({}));
  }, [dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({
        name: selectedItem?.name || '',
        status: selectedItem?.status || 'PENDING',
        subMenuCategoryIds: selectedItem?.subMenuCategoryIds || [],
      });
      setOriginalItem(selectedItem ? { name: selectedItem.name, status: selectedItem.status, subMenuCategoryIds: selectedItem.subMenuCategoryIds } : null);
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
  const handleEdit = useCallback((item: BoardingMenuItem) => {
    setSelectedItem(item);
    setOriginalItem({ name: item.name, status: item.status, subMenuCategoryIds: item.subMenuCategoryIds });
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: BoardingMenuItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: BoardingMenuItemFormData) => {
    try {
      if (isEdit && selectedItem && originalItem) {
        const updatedFields = getChangedFields(originalItem, data);

        if (Object.keys(updatedFields).length > 0) {
          await dispatch(updateBoardingMenuItem({ id: selectedItem.id, data: updatedFields })).unwrap();
          showToast(`Menu Item ${SUCCESS_MESSAGES.UPDATED}`, 'success');
        } else {
          showToast('No changes detected', 'info');
        }
      } else if (!isEdit) {
        await dispatch(createBoardingMenuItem(data)).unwrap();
        showToast(`Menu Item ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} menu item`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteBoardingMenuItem(itemToDelete.id)).unwrap();
      showToast(`Menu Item ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete menu item', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ name: '', status: STATUSES_OBJECT.ACTIVE, subMenuCategoryIds: [] });
  }, [reset]);


  if (loading && boardingMenuItems.length === 0) {
    return <LoadingSpinner message="Loading menu items..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Menu Item Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Menu Item
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
            placeholder="Search menu items..."
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

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sub Menu Categories</InputLabel>
            <Select
              multiple
              value={subMenuCategoryFilter}
              onChange={(e) => setSubMenuCategoryFilter(e.target.value as string[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={subMenuCategories.find(cat => cat.id === value)?.name || ''} />
                  ))}
                </Box>
              )}
              label="Sub Menu Categories"
            >
              {subMenuCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Data Table */}
      {boardingMenuItems.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Sub Menu Categories</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boardingMenuItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {item.subMenuCategoryIds.map(id => (
                          <Chip
                            key={id}
                            label={subMenuCategories.find(cat => cat.id === id)?.name || 'N/A'}
                            size="small"
                            variant="outlined"
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
          title="No menu items found"
          description="No menu items available. Add some to get started."
          actionLabel="Add Menu Item"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}
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
                    placeholder="e.g., Chicken Curry, Rice"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                  />
                )}
              />

              <Controller
                name="subMenuCategoryIds"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.subMenuCategoryIds}>
                    <InputLabel>Sub Menu Categories *</InputLabel>
                    <Select
                      {...field}
                      multiple
                      label="Sub Menu Categories *"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={subMenuCategories.find(cat => cat.id === value)?.name || ''} />
                          ))}
                        </Box>
                      )}
                    >
                      {subMenuCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subMenuCategoryIds && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.subMenuCategoryIds.message}
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
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

BoardingMenuItemSection.displayName = 'BoardingMenuItemSection';

export { BoardingMenuItemSection };
