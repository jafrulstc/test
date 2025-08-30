import { useEffect, memo, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  fetchNationalities,
  fetchDivisions,
  fetchDistricts,
  fetchSubDistricts,
  fetchPostOffices,

  selectGeographyState,
  selectNationalities,
  selectDivisions,
  selectDistricts,
  selectSubDistricts,
  selectPostOffices,
  createNationality,
  createDivision,
  createDistrict,
  createSubDistrict,
  createPostOffice,
  createVillage,
  updateNationality,
  updateDivision,
  updateDistrict,
  updateSubDistrict,
  updatePostOffice,
  updateVillage,
} from '~/features/core/store/geographySlice';
import type { GeographyEntity } from '~/features/core/types/geography';
import { GEOGRAPHY_ENTITY, GeographyEntityType, SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';

interface GeographyFormModalProps {
  open: boolean;
  onClose: () => void;
  item?: GeographyEntity | null;
  entityType: GeographyEntityType;
}

// Validation schemas
const nationalitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

const divisionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  nationalityId: z.string().min(1, 'Nationality is required'),
});

const districtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  divisionId: z.string().min(1, 'Division is required'),
});

const subDistrictSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  districtId: z.string().min(1, 'District is required'),
});

const postOfficeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  subDistrictId: z.string().min(1, 'Sub District is required'),
});

const villageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  postOfficeId: z.string().min(1, 'Post Office is required'),
});

type FormData = z.infer<typeof nationalitySchema> |
  z.infer<typeof divisionSchema> |
  z.infer<typeof districtSchema> |
  z.infer<typeof subDistrictSchema> |
  z.infer<typeof postOfficeSchema> |
  z.infer<typeof villageSchema>;

/**
 * Geography form modal component
 * Handles create and update operations for all geography entities
 */
const GeographyFormModal = memo(({ open, onClose, item, entityType }: GeographyFormModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const { loading } = useAppSelector(selectGeographyState);
  const nationalities = useAppSelector(selectNationalities);
  const divisions = useAppSelector(selectDivisions);
  const districts = useAppSelector(selectDistricts);
  const subDistricts = useAppSelector(selectSubDistricts);
  const postOffices = useAppSelector(selectPostOffices);

  const isEdit = Boolean(item);

  /**
   * Get validation schema based on entity type
   */

  const getSchema = () => {
    switch (entityType) {
      case GEOGRAPHY_ENTITY.NATIONALITY:
        return nationalitySchema;
      case GEOGRAPHY_ENTITY.DIVISION:
        return divisionSchema;
      case GEOGRAPHY_ENTITY.DISTRICT:
        return districtSchema;
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return subDistrictSchema;
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return postOfficeSchema;
      case GEOGRAPHY_ENTITY.VILLAGE:
        return villageSchema;
      default:
        return nationalitySchema;
    }
  };
  /**
   * Get default values based on entity type and item
   */
  const getDefaultValues = (): any => {
    const baseValues = { name: item?.name || '' };

    if (!isEdit) {
      switch (entityType) {
        case GEOGRAPHY_ENTITY.DIVISION:
          return { ...baseValues, nationalityId: '' };
        case GEOGRAPHY_ENTITY.DISTRICT:
          return { ...baseValues, divisionId: '' };
        case GEOGRAPHY_ENTITY.SUB_DISTRICT:
          return { ...baseValues, districtId: '' };
        case GEOGRAPHY_ENTITY.POST_OFFICE:
          return { ...baseValues, subDistrictId: '' };
        case GEOGRAPHY_ENTITY.VILLAGE:
          return { ...baseValues, postOfficeId: '' };
        default:
          return baseValues;
      }
    }

    // Edit mode - populate with existing values
    switch (entityType) {
      case GEOGRAPHY_ENTITY.DIVISION:
        return { ...baseValues, nationalityId: (item as any)?.nationalityId || '' };
      case GEOGRAPHY_ENTITY.DISTRICT:
        return { ...baseValues, divisionId: (item as any)?.divisionId || '' };
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return { ...baseValues, districtId: (item as any)?.districtId || '' };
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return { ...baseValues, subDistrictId: (item as any)?.subDistrictId || '' };
      case GEOGRAPHY_ENTITY.VILLAGE:
        return { ...baseValues, postOfficeId: (item as any)?.postOfficeId || '' };
      default:
        return baseValues;
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(getSchema()),
    defaultValues: getDefaultValues(),
  });


  useEffect(() => {
    if (open) {
      const fetchParams = { page: 1, limit: 1000, filters: {} }; // ড্রপডাউনের জন্য অনেকগুলো আইটেম আনুন

      switch (entityType) {
        case GEOGRAPHY_ENTITY.DIVISION:
          if (nationalities.length === 0) dispatch(fetchNationalities(fetchParams));
          break;
        case GEOGRAPHY_ENTITY.DISTRICT:
          if (divisions.length === 0) dispatch(fetchDivisions(fetchParams));
          break;
        case GEOGRAPHY_ENTITY.SUB_DISTRICT:
          if (districts.length === 0) dispatch(fetchDistricts(fetchParams));
          break;
        case GEOGRAPHY_ENTITY.POST_OFFICE:
          if (subDistricts.length === 0) dispatch(fetchSubDistricts(fetchParams));
          break;
        case GEOGRAPHY_ENTITY.VILLAGE:
          if (postOffices.length === 0) dispatch(fetchPostOffices(fetchParams));
          break;
        default:
          break;
      }
    }
  }, [open, entityType, dispatch, nationalities.length, divisions.length, districts.length, subDistricts.length, postOffices.length]);

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (open) {
      reset(getDefaultValues());
      // Focus first field after a short delay
      setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 100);
    }
  }, [open, item, entityType, reset]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && item) {
        // Check for changes
        const originalData = getDefaultValues();
        const changedFields = getChangedFields(originalData, data);
        
        if (Object.keys(changedFields).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        // Update operation
        switch (entityType) {
          case GEOGRAPHY_ENTITY.NATIONALITY:
            await dispatch(updateNationality({ id: item.id, data: changedFields })).unwrap();
            break;
          case GEOGRAPHY_ENTITY.DIVISION:
            await dispatch(updateDivision({ id: item.id, data: changedFields as any })).unwrap();
            break;
          case GEOGRAPHY_ENTITY.DISTRICT:
            await dispatch(updateDistrict({ id: item.id, data: changedFields as any })).unwrap();
            break;
          case GEOGRAPHY_ENTITY.SUB_DISTRICT:
            await dispatch(updateSubDistrict({ id: item.id, data: changedFields as any })).unwrap();
            break;
          case GEOGRAPHY_ENTITY.POST_OFFICE:
            await dispatch(updatePostOffice({ id: item.id, data: changedFields as any })).unwrap();
            break;
          case GEOGRAPHY_ENTITY.VILLAGE:
            await dispatch(updateVillage({ id: item.id, data: changedFields as any })).unwrap();
            break;
        }
        showToast(`${getEntityDisplayName()} ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        // Create operation
        switch (entityType) {
          case GEOGRAPHY_ENTITY.NATIONALITY:
            await dispatch(createNationality(data)).unwrap();
            break;
          case GEOGRAPHY_ENTITY.DIVISION:
            await dispatch(createDivision(data as any)).unwrap();
            break;
          case GEOGRAPHY_ENTITY.DISTRICT:
            await dispatch(createDistrict(data as any)).unwrap();
            break;
          case GEOGRAPHY_ENTITY.SUB_DISTRICT:
            await dispatch(createSubDistrict(data as any)).unwrap();
            break;
          case GEOGRAPHY_ENTITY.POST_OFFICE:
            await dispatch(createPostOffice(data as any)).unwrap();
            break;
          case GEOGRAPHY_ENTITY.VILLAGE:
            await dispatch(createVillage(data as any)).unwrap();
            break;
        }
        showToast(`${getEntityDisplayName()} ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }

      handleClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} ${getEntityDisplayName().toLowerCase()}`, 'error');
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    reset();
    onClose();
  };

  /**
   * Get entity display name
   */
  const getEntityDisplayName = (): string => {
    const names = {
      nationality: 'Nationality',
      division: 'Division',
      district: 'District',
      sub_district: 'Sub District',
      post_office: 'Post Office',
      village: 'Village',
    };
    return names[entityType];
  };

  /**
   * Get parent options based on entity type
   */
  const getParentOptions = () => {
    switch (entityType) {
      case GEOGRAPHY_ENTITY.DIVISION:
        return nationalities;
      case GEOGRAPHY_ENTITY.DISTRICT:
        return divisions;
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return districts;
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return subDistricts;
      case GEOGRAPHY_ENTITY.VILLAGE:
        return postOffices;
      default:
        return [];
    }
  };

  /**
   * Get parent field name
   */
  const getParentFieldName = (): string => {
    switch (entityType) {
      case GEOGRAPHY_ENTITY.DIVISION:
        return 'nationalityId';
      case GEOGRAPHY_ENTITY.DISTRICT:
        return 'divisionId';
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return 'districtId';
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return 'subDistrictId';
      case GEOGRAPHY_ENTITY.VILLAGE:
        return 'postOfficeId';
      default:
        return '';
    }
  };

  /**
   * Get parent label
   */
  const getParentLabel = (): string => {
    switch (entityType) {
      case GEOGRAPHY_ENTITY.DIVISION:
        return 'Nationality';
      case GEOGRAPHY_ENTITY.DISTRICT:
        return 'Division';
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return 'District';
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return 'Sub District';
      case GEOGRAPHY_ENTITY.VILLAGE:
        return 'Post Office';
      default:
        return '';
    }
  };

  const parentOptions = getParentOptions();
  const parentFieldName = getParentFieldName();
  const parentLabel = getParentLabel();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {isEdit ? `Edit ${getEntityDisplayName()}` : `Add ${getEntityDisplayName()}`}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Name Field */}
            <Grid sx={{ gridColumn: { xs: 'span 12' } }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={firstFieldRef}
                    fullWidth
                    label={`${getEntityDisplayName()} Name`}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            {/* Parent Selection Field */}
            {parentFieldName && (
              <Grid sx={{ gridColumn: { xs: 'span 12' } }}>
                <Controller
                  name={parentFieldName as any}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!(errors as any)[parentFieldName]}>
                      <InputLabel>{parentLabel}</InputLabel>
                      <Select {...field} label={parentLabel}>
                        <MenuItem value="">Select {parentLabel}</MenuItem>
                        {parentOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {(errors as any)[parentFieldName] && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {(errors as any)[parentFieldName]?.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading || isSubmitting}>
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
  );
});

GeographyFormModal.displayName = 'GeographyFormModal';

export { GeographyFormModal };