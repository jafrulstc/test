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
  Card,
  CardContent,
  Grid,
  Divider,
  OutlinedInput,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { Edit, Delete, Add, Close, Remove } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  selectAcademicState,
  selectClassGroupMappings,
  selectAcademicClasses,
  selectAcademicGroups,
  selectAcademicYears,
  selectShifts,
  selectSections,
  setFilters,
  setPagination,
  fetchClassGroupMappings,
  fetchAcademicClasses,
  fetchAcademicGroups,
  fetchAcademicYears,
  fetchShifts,
  fetchSections,
  createClassGroupMapping,
  updateClassGroupMapping,
  deleteClassGroupMapping,
} from '~/features/core/store/academicSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { classGroupMappingSchema } from '~/features/core/schemas/academicSchemas';
import type { ClassGroupMapping, ShiftSectionMapping } from '~/features/core/types/academic';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';

type FormData = {
  academicClassId: string;
  academicGroupId: string;
  academicYearId: string;
  shiftSectionMapping: ShiftSectionMapping[];
};

/**
 * Class Group Mapping section component
 */
const ClassGroupMappingSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectAcademicState);
  const classGroupMappings = useAppSelector(selectClassGroupMappings);
  const academicClasses = useAppSelector(selectAcademicClasses);
  const academicGroups = useAppSelector(selectAcademicGroups);
  const academicYears = useAppSelector(selectAcademicYears);
  const shifts = useAppSelector(selectShifts);
  const sections = useAppSelector(selectSections);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClassGroupMapping | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ClassGroupMapping | null>(null);

  const isEdit = Boolean(selectedItem);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(classGroupMappingSchema),
    defaultValues: { 
      academicClassId: '',
      academicGroupId: '',
      academicYearId: '',
      shiftSectionMapping: [{ shiftId: '', sectionIds: [] }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shiftSectionMapping',
  });

  const selectedClassId = watch('academicClassId');

  // Fetch required data for dropdowns
  useEffect(() => {
    const fetchParams = { page: 1, limit: 1000, filters: {} };
    
    if (academicClasses.length === 0) {
      dispatch(fetchAcademicClasses(fetchParams));
    }
    if (academicGroups.length === 0) {
      dispatch(fetchAcademicGroups(fetchParams));
    }
    if (academicYears.length === 0) {
      dispatch(fetchAcademicYears(fetchParams));
    }
    if (shifts.length === 0) {
      dispatch(fetchShifts(fetchParams));
    }
    if (sections.length === 0) {
      dispatch(fetchSections(fetchParams));
    }
  }, [dispatch, academicClasses.length, academicGroups.length, academicYears.length, shifts.length, sections.length]);

  // Fetch data when pagination or filters change
  useEffect(() => {
    // Only fetch if we have the required data loaded
    if (academicClasses.length === 0 || academicGroups.length === 0 || academicYears.length === 0) {
      return;
    }
    
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchClassGroupMappings(fetchParams));
  }, [dispatch, pagination.page, pagination.limit, filters, academicClasses.length, academicGroups.length, academicYears.length]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (formModalOpen) {
      reset({ 
        academicClassId: selectedItem?.academicClassId || '',
        academicGroupId: selectedItem?.academicGroupId || '',
        academicYearId: selectedItem?.academicYearId || '',
        shiftSectionMapping: selectedItem?.shiftSectionMapping || [{ shiftId: '', sectionIds: [] }]
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
  const handleEdit = useCallback((item: ClassGroupMapping) => {
    setSelectedItem(item);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: ClassGroupMapping) => {
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
          academicClassId: selectedItem.academicClassId,
          academicGroupId: selectedItem.academicGroupId,
          academicYearId: selectedItem.academicYearId,
          shiftSectionMapping: selectedItem.shiftSectionMapping,
        };
        
        const changedFields = getChangedFields(originalData, data);
        
        if (Object.keys(changedFields).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        await dispatch(updateClassGroupMapping({ id: selectedItem.id, data: changedFields })).unwrap();
        showToast(`Class Group Mapping ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createClassGroupMapping(data)).unwrap();
        showToast(`Class Group Mapping ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleFormModalClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} class group mapping`, 'error');
    }
  };

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteClassGroupMapping(itemToDelete.id)).unwrap();
      showToast(`Class Group Mapping ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete class group mapping', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null);
    reset({ 
      academicClassId: '',
      academicGroupId: '',
      academicYearId: '',
      shiftSectionMapping: [{ shiftId: '', sectionIds: [] }]
    });
  }, [reset]);

  /**
   * Get entity name by ID
   */
  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Unknown';
  };

  /**
   * Get filtered academic groups based on selected class
   */
  const getFilteredAcademicGroups = () => {
    if (!selectedClassId) return [];
    const selectedClass = academicClasses.find(cls => cls.id === selectedClassId);
    if (!selectedClass) return [];
    
    return academicGroups.filter(group => 
      selectedClass.academicGroupIds.includes(group.id)
    );
  };

  /**
   * Add new shift-section mapping
   */
  const addShiftSectionMapping = () => {
    append({ shiftId: '', sectionIds: [] });
  };

  if (loading && classGroupMappings.length === 0) {
    return <LoadingSpinner message="Loading class group mappings..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Class Group Mapping Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Class Group Mapping
        </Button>
      </Box>

      {/* Data Table */}
      {classGroupMappings.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Academic Class</TableCell>
                  <TableCell>Academic Group</TableCell>
                  <TableCell>Academic Year</TableCell>
                  <TableCell>Shift-Section Mappings</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classGroupMappings.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Chip
                        label={getEntityName(academicClasses, item.academicClassId)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getEntityName(academicGroups, item.academicGroupId)}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getEntityName(academicYears, item.academicYearId)}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {item.shiftSectionMapping.map((mapping, index) => (
                          <Box key={index} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            <Chip
                              label={getEntityName(shifts, mapping.shiftId)}
                              size="small"
                              color="warning"
                            />
                            <Typography variant="caption">→</Typography>
                            <Box sx={{ display: 'flex', gap: 0.25 }}>
                              {mapping.sectionIds.map((sectionId) => (
                                <Chip
                                  key={sectionId}
                                  label={getEntityName(sections, sectionId)}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        ))}
                      </Box>
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
          title="No class group mappings found"
          description="No class group mappings available. Add some to get started."
          actionLabel="Add Class Group Mapping"
          onAction={handleAddNew}
        />
      )}

      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {selectedItem ? 'Edit Class Group Mapping' : 'Add Class Group Mapping'}
            </Typography>
            <IconButton onClick={handleFormModalClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid size={{xs: 12}}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid size={{xs: 12, md: 4}}>
                <Controller
                  name="academicClassId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.academicClassId}>
                      <InputLabel>Academic Class *</InputLabel>
                      <Select {...field} label="Academic Class *">
                        <MenuItem value="">Select Academic Class</MenuItem>
                        {academicClasses.map((cls) => (
                          <MenuItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.academicClassId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.academicClassId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{xs: 12, md: 4}}>
                <Controller
                  name="academicGroupId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.academicGroupId}>
                      <InputLabel>Academic Group *</InputLabel>
                      <Select 
                        {...field} 
                        label="Academic Group *"
                        disabled={!selectedClassId}
                      >
                        <MenuItem value="">Select Academic Group</MenuItem>
                        {getFilteredAcademicGroups().map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.academicGroupId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.academicGroupId.message}
                        </Typography>
                      )}
                      {!selectedClassId && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                          Please select an academic class first
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{xs: 12, md: 4}}>
                <Controller
                  name="academicYearId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.academicYearId}>
                      <InputLabel>Academic Year *</InputLabel>
                      <Select {...field} label="Academic Year *">
                        <MenuItem value="">Select Academic Year</MenuItem>
                        {academicYears.map((year) => (
                          <MenuItem key={year.id} value={year.id}>
                            {year.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.academicYearId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.academicYearId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Shift-Section Mappings */}
              <Grid size={{xs: 12}}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Shift-Section Mappings
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={addShiftSectionMapping}
                  >
                    Add Mapping
                  </Button>
                </Box>
              </Grid>

              {fields.map((field, index) => (
                <Grid size={{xs: 12}} key={field.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2">
                          Mapping {index + 1}
                        </Typography>
                        {fields.length > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => remove(index)}
                          >
                            <Remove />
                          </IconButton>
                        )}
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 4}}>
                          <Controller
                            name={`shiftSectionMapping.${index}.shiftId`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!(errors.shiftSectionMapping?.[index]?.shiftId)}>
                                <InputLabel>Shift *</InputLabel>
                                <Select {...field} label="Shift *">
                                  <MenuItem value="">Select Shift</MenuItem>
                                  {shifts.map((shift) => (
                                    <MenuItem key={shift.id} value={shift.id}>
                                      {shift.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors.shiftSectionMapping?.[index]?.shiftId && (
                                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                    {errors.shiftSectionMapping[index]?.shiftId?.message}
                                  </Typography>
                                )}
                              </FormControl>
                            )}
                          />
                        </Grid>

                        <Grid size={{xs: 12, md: 8}} >
                          <Controller
                            name={`shiftSectionMapping.${index}.sectionIds`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!(errors.shiftSectionMapping?.[index]?.sectionIds)}>
                                <InputLabel>Sections *</InputLabel>
                                <Select
                                  {...field}
                                  multiple
                                  input={<OutlinedInput label="Sections *" />}
                                  renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {(selected as string[]).map((value) => (
                                        <Chip
                                          key={value}
                                          label={getEntityName(sections, value)}
                                          size="small"
                                        />
                                      ))}
                                    </Box>
                                  )}
                                >
                                  {sections.map((section) => (
                                    <MenuItem key={section.id} value={section.id}>
                                      <Checkbox checked={field.value.indexOf(section.id) > -1} />
                                      <ListItemText primary={section.name} />
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors.shiftSectionMapping?.[index]?.sectionIds && (
                                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                    {errors.shiftSectionMapping[index]?.sectionIds?.message}
                                  </Typography>
                                )}
                              </FormControl>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
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
        title="Delete Class Group Mapping"
        message="Are you sure you want to delete this class group mapping? This action cannot be undone."
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

ClassGroupMappingSection.displayName = 'ClassGroupMappingSection';

export { ClassGroupMappingSection };