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
} from '@mui/material';
import { Edit, Delete, Search, Add, Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectGeneralState,
  selectGenders,
  selectBloodGroups,
  selectResidentialStatuses,
  selectReligions,
  selectDesignationCategories,
  selectJobRules,
  setFilters,
  setPagination,
  fetchGenders,
  fetchBloodGroups,
  fetchResidentialStatuses,
  fetchReligions,
  fetchDesignationCategories,
  fetchJobRules,
  createGender,
  createBloodGroup,
  createResidentialStatus,
  createReligion,
  createDesignationCategory,
  createJobRule,
  updateGender,
  updateBloodGroup,
  updateResidentialStatus,
  updateReligion,
  updateDesignationCategory,
  updateJobRule,
  deleteGender,
  deleteBloodGroup,
  deleteResidentialStatus,
  deleteReligion,
  deleteDesignationCategory,
  deleteJobRule,
  selectPersonCategories,
  deletePersonCategory,
  createPersonCategory,
  fetchPersonCategories,
  updatePersonCategory,
} from '~/features/core/store/generalSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { nameEntitySchema } from '~/features/core/schemas/generalSchemas';
import type { GeneralEntityType, GeneralEntity } from '~/features/core/types/general';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { GENERAL_ENTITIES } from '~/features/core/const/generalConst';
import { getChangedFields } from '~/shared/utils/getChangedFields';

interface NameCrudSectionProps {
  entityType: Exclude<GeneralEntityType, 'guardian' | 'educationalMentor' | 'designation'>;
  title: string;
}

type FormData = { name: string };

/**
 * Reusable CRUD section for name-based entities
 */
const NameCrudSection = memo(({ entityType, title }: NameCrudSectionProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectGeneralState);

  // Get data based on entity type
  const getData = () => {
    switch (entityType) {
      case GENERAL_ENTITIES.GENDER:
        return useAppSelector(selectGenders);
      case GENERAL_ENTITIES.PERSON_CATEGORY:
        return useAppSelector(selectPersonCategories);
      case GENERAL_ENTITIES.BLOOD_GROUP:
        return useAppSelector(selectBloodGroups);
      case GENERAL_ENTITIES.RESIDENTIAL_STATUS:
        return useAppSelector(selectResidentialStatuses);
      case GENERAL_ENTITIES.RELIGION:
        return useAppSelector(selectReligions);
      case GENERAL_ENTITIES.DESIGNATION_CATEGORY:
        return useAppSelector(selectDesignationCategories);
      case GENERAL_ENTITIES.JOB_RULE:
        return useAppSelector(selectJobRules);
      default:
        return [];
    }
  };

  const currentData = getData();

  const [searchTerm, setSearchTerm] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GeneralEntity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GeneralEntity | null>(null);

  const isEdit = Boolean(selectedItem);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(nameEntitySchema),
    defaultValues: { name: '' },
  });

  // Update filters when search term changes
  useEffect(() => {
    dispatch(setFilters({ ...filters, search: debouncedSearchTerm || undefined }));
  }, [debouncedSearchTerm, dispatch]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };

    switch (entityType) {
      case GENERAL_ENTITIES.GENDER:
        dispatch(fetchGenders(fetchParams));
        break;
      case GENERAL_ENTITIES.PERSON_CATEGORY:
        dispatch(fetchPersonCategories(fetchParams));
        break;
      case GENERAL_ENTITIES.BLOOD_GROUP:
        dispatch(fetchBloodGroups(fetchParams));
        break;
      case GENERAL_ENTITIES.RESIDENTIAL_STATUS:
        dispatch(fetchResidentialStatuses(fetchParams));
        break;
      case GENERAL_ENTITIES.RELIGION:
        dispatch(fetchReligions(fetchParams));
        break;
      case GENERAL_ENTITIES.DESIGNATION_CATEGORY:
        dispatch(fetchDesignationCategories(fetchParams));
        break;
      case GENERAL_ENTITIES.JOB_RULE:
        dispatch(fetchJobRules(fetchParams));
        break;
    }
  }, [entityType, pagination.page, pagination.limit, filters, dispatch]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({ name: selectedItem?.name || '' });
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
  const handleEdit = useCallback((item: GeneralEntity) => {
    setSelectedItem(item);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: GeneralEntity) => {
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
        const originalData = { name: selectedItem.name };
        const changedFields = getChangedFields(originalData, data);

        if (Object.keys(changedFields).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        // Update operation
        switch (entityType) {
          case GENERAL_ENTITIES.GENDER:
            await dispatch(updateGender({ id: selectedItem.id, data: changedFields })).unwrap();
            break;
          case GENERAL_ENTITIES.PERSON_CATEGORY:
            await dispatch(updatePersonCategory({ id: selectedItem.id, data: changedFields })).unwrap();
            break;
          case GENERAL_ENTITIES.BLOOD_GROUP:
            await dispatch(updateBloodGroup({ id: selectedItem.id, data: changedFields })).unwrap();
            break;
          case GENERAL_ENTITIES.RESIDENTIAL_STATUS:
            await dispatch(updateResidentialStatus({ id: selectedItem.id, data: changedFields })).unwrap();
            break;
          case GENERAL_ENTITIES.RELIGION:
            await dispatch(updateReligion({ id: selectedItem.id, data: changedFields })).unwrap();
            break;
          case GENERAL_ENTITIES.DESIGNATION_CATEGORY:
            await dispatch(updateDesignationCategory({ id: selectedItem.id, data: changedFields })).unwrap();
            break;
          case GENERAL_ENTITIES.JOB_RULE:
            await dispatch(updateJobRule({ id: selectedItem.id, data: changedFields })).unwrap();
            break;
        }
        showToast(`${title} ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        // Create operation
        switch (entityType) {
          case GENERAL_ENTITIES.GENDER:
            await dispatch(createGender(data)).unwrap();
            break;
          case GENERAL_ENTITIES.PERSON_CATEGORY:
            await dispatch(createPersonCategory(data)).unwrap();
            break;
          case GENERAL_ENTITIES.BLOOD_GROUP:
            await dispatch(createBloodGroup(data)).unwrap();
            break;
          case GENERAL_ENTITIES.RESIDENTIAL_STATUS:
            await dispatch(createResidentialStatus(data)).unwrap();
            break;
          case GENERAL_ENTITIES.RELIGION:
            await dispatch(createReligion(data)).unwrap();
            break;
          case GENERAL_ENTITIES.DESIGNATION_CATEGORY:
            await dispatch(createDesignationCategory(data)).unwrap();
            break;
          case GENERAL_ENTITIES.JOB_RULE:
            await dispatch(createJobRule(data)).unwrap();
            break;
        }
        showToast(`${title} ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }

      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} ${title.toLowerCase()}`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      switch (entityType) {
        case GENERAL_ENTITIES.GENDER:
          await dispatch(deleteGender(itemToDelete.id)).unwrap();
          break;
        case GENERAL_ENTITIES.PERSON_CATEGORY:
          await dispatch(deletePersonCategory(itemToDelete.id)).unwrap();
          break;
        case GENERAL_ENTITIES.BLOOD_GROUP:
          await dispatch(deleteBloodGroup(itemToDelete.id)).unwrap();
          break;
        case GENERAL_ENTITIES.RESIDENTIAL_STATUS:
          await dispatch(deleteResidentialStatus(itemToDelete.id)).unwrap();
          break;
        case GENERAL_ENTITIES.RELIGION:
          await dispatch(deleteReligion(itemToDelete.id)).unwrap();
          break;
        case GENERAL_ENTITIES.DESIGNATION_CATEGORY:
          await dispatch(deleteDesignationCategory(itemToDelete.id)).unwrap();
          break;
        case GENERAL_ENTITIES.JOB_RULE:
          await dispatch(deleteJobRule(itemToDelete.id)).unwrap();
          break;
      }

      showToast(`${title} ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error');
    }
  }, [itemToDelete, entityType, dispatch, showToast, title]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ name: '' });
  }, [reset]);

  if (loading && currentData.length === 0) {
    return <LoadingSpinner message={`Loading ${title.toLowerCase()}s...`} />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          {title} Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add {title}
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder={`Search ${title.toLowerCase()}s...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Data Table */}
      {currentData.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
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
          title={`No ${title.toLowerCase()}s found`}
          description={`No ${title.toLowerCase()}s available. Add some to get started.`}
          actionLabel={`Add ${title}`}
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? `Edit ${title}` : `Add ${title}`}
            </Typography>
            <IconButton onClick={handleFormModalClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={`${title} Name`}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  autoFocus
                />
              )}
            />
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
        title={`Delete ${title}`}
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

NameCrudSection.displayName = 'NameCrudSection';

export { NameCrudSection };