import React, { useEffect, useState, memo, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  Avatar,
  FormControlLabel,
  Checkbox,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Close, Person, CloudUpload } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  selectGeneralState,
  createGuardian,
  updateGuardian,
  fetchRelations,
} from '~/features/core/store/generalSlice';
import { AddressFields } from './AddressFields';
import { guardianSchema } from '~/features/core/schemas/generalSchemas';
import { uploadPhoto, validatePhotoFile } from '~/shared/utils/photoUpload';
import { studentApi } from '~/features/education/students/services/studentApi';
import type { Guardian, CreateGuardianDto, Relation } from '~/features/core/types/general';
import type { Address } from '~/features/core/types/geography';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getChangedFields } from '~/shared/utils/getChangedFields';

interface GuardianFormModalProps {
  open: boolean;
  onClose: () => void;
  guardian?: Guardian | null;
}

type FormData = {
  name: string;
  phone: number;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  student_id: string;
  relation: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
};

/**
 * Guardian form modal component
 */
const GuardianFormModal = memo(({ open, onClose, guardian }: GuardianFormModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { loading, relations } = useAppSelector(selectGeneralState);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [students, setStudents] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);

  const isEdit = Boolean(guardian);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      name: '',
      phone: 0,
      email: '',
      occupation: '',
      photoUrl: '',
      student_id: '',
      relation: '',
      presentAddress: {},
      permanentAddress: {},
      sameAsPresent: false,
      details: '',
    },
  });

  const sameAsPresent = watch('sameAsPresent');
  const presentAddress = watch('presentAddress');

  // Fetch relations for dropdown
  useEffect(() => {
    if (open) {
      dispatch(fetchRelations({}));
    }
  }, [open, dispatch]);

  // Fetch students for dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      if (open) {
        try {
          const studentList = await studentApi.getAllStudentsForDropdown();
          setStudents(studentList);
        } catch (error) {
          console.error('Failed to fetch students:', error);
        }
      }
    };
    fetchStudents();
  }, [open]);

  // Reset form when modal opens or guardian changes
  useEffect(() => {
    if (open) {
      const defaultValues: FormData = {
        name: guardian?.name || '',
        phone: guardian?.phone || 0,
        email: guardian?.email || '',
        occupation: guardian?.occupation || '',
        photoUrl: guardian?.photoUrl || '',
        student_id: guardian?.student_id || '',
        relation: guardian?.relation || '',
        presentAddress: guardian?.presentAddress || {},
        permanentAddress: guardian?.permanentAddress || {},
        sameAsPresent: guardian?.sameAsPresent || false,
        details: guardian?.details || '',
      };
      reset(defaultValues);
      setPhotoPreview(guardian?.photoUrl || null);
    }
  }, [open, guardian, reset]);

  // Update permanent address when "same as present" is checked
  useEffect(() => {
    if (sameAsPresent && presentAddress) {
      setValue('permanentAddress', presentAddress);
    }
  }, [sameAsPresent, presentAddress, setValue]);

  /**
   * Handle photo upload
   */
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validatePhotoFile(file);
    if (!validation.valid) {
      showToast(validation.error!, 'error');
      return;
    }

    setPhotoUploading(true);
    try {
      const result = await uploadPhoto(file);
      if (result.success && result.url) {
        setValue('photoUrl', result.url);
        setPhotoPreview(result.url);
        showToast('Photo uploaded successfully', 'success');
      } else {
        showToast(result.error || 'Failed to upload photo', 'error');
      }
    } catch (error) {
      showToast('Failed to upload photo', 'error');
    } finally {
      setPhotoUploading(false);
    }
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && guardian) {
        // Check for changes
        const originalData: FormData = {
          name: guardian.name,
          phone: guardian.phone,
          email: guardian.email,
          occupation: guardian.occupation,
          photoUrl: guardian.photoUrl,
          student_id: guardian.student_id,
          relation: guardian.relation,
          presentAddress: guardian.presentAddress,
          permanentAddress: guardian.permanentAddress,
          sameAsPresent: guardian.sameAsPresent,
          details: guardian.details,
        };
        
        const changedFields = getChangedFields(originalData, data);
        
        if (Object.keys(changedFields).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        await dispatch(updateGuardian({ id: guardian.id, data: changedFields as CreateGuardianDto })).unwrap();
        showToast(`Guardian ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createGuardian(data as CreateGuardianDto)).unwrap();
        showToast(`Guardian ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} guardian`, 'error');
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    reset();
    setPhotoPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {isEdit ? 'Edit Guardian' : 'Add Guardian'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Photo Upload */}
            <Grid size={{xs: 12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={photoPreview || undefined}
                  sx={{ width: 80, height: 80 }}
                >
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoUploading}
                  >
                    {photoUploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    Max 5MB. JPEG, PNG, GIF supported.
                  </Typography>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Basic Information */}
            <Grid size={{xs: 12}}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Name *"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone *"
                    type="number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="occupation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Occupation"
                    error={!!errors.occupation}
                    helperText={errors.occupation?.message}
                  />
                )}
              />
            </Grid>

            {/* Student Selection */}
            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="student_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.student_id}>
                    <InputLabel>Student *</InputLabel>
                    <Select
                      {...field}
                      label="Student *"
                      value={field.value || ''}
                    >
                      {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.student_id && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.student_id.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Relation Selection */}
            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="relation"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.relation}>
                    <InputLabel>Relation *</InputLabel>
                    <Select
                      {...field}
                      label="Relation *"
                      value={field.value || ''}
                    >
                      {relations?.map((relation) => (
                        <MenuItem key={relation.id} value={relation.id}>
                          {relation.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.relation && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.relation.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Present Address */}
            <Grid size={{xs: 12}}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Present Address
              </Typography>
            </Grid>

            <Grid size={{xs: 12}}>
              <Controller
                name="presentAddress"
                control={control}
                render={({ field }) => (
                  <AddressFields
                    value={field.value || {}}
                    onChange={field.onChange}
                    error={errors.presentAddress}
                  />
                )}
              />
            </Grid>

            {/* Permanent Address */}
            <Grid size={{xs: 12}}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Permanent Address
                </Typography>
                <Controller
                  name="sameAsPresent"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value || false}
                          onChange={field.onChange}
                        />
                      }
                      label="Same as Present"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid size={{xs: 12}}>
              {sameAsPresent ? (
                <Alert severity="info">
                  Permanent address will be same as present address
                </Alert>
              ) : (
                <Controller
                  name="permanentAddress"
                  control={control}
                  render={({ field }) => (
                    <AddressFields
                      value={field.value || {}}
                      onChange={field.onChange}
                      error={errors.permanentAddress}
                    />
                  )}
                />
              )}
            </Grid>

            {/* Details */}
            <Grid size={{xs: 12}}>
              <Controller
                name="details"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Additional Details"
                    multiline
                    rows={3}
                    error={!!errors.details}
                    helperText={errors.details?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading || isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || isSubmitting || photoUploading}
            sx={{ minWidth: 100 }}
          >
            {loading || isSubmitting ? t('common.loading') : isEdit ? t('common.save') : t('common.add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

GuardianFormModal.displayName = 'GuardianFormModal';

export { GuardianFormModal };
