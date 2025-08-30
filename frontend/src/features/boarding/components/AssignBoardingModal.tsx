import React, { useEffect, useState, memo, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Alert,
  Chip
} from '@mui/material';
import { Close, Person, Receipt } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  selectMasterBoardingPackageTypes,
  selectMasterBoardingPackages,
  selectMasterFullDayMealPackages,
  fetchBoardingPackageTypes,
  fetchBoardingPackages,
  fetchFullDayMealPackages,
} from '~/features/boarding/core/store/masterBoardingSlice';
import {
  createBoardingAssignment,
  updateBoardingAssignment,
  selectBoardingAssignmentState,
} from '../store/boardingAssignmentSlice';
import { assignmentFormSchema, type AssignmentFormData } from '../schemas/boardingAssignmentSchema';
import type { AssignableUser, BoardingAssignment, CreateBoardingAssignmentDto, UpdateBoardingAssignmentDto } from '../types/boardingAssignmentType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

interface AssignBoardingModalProps {
  open: boolean;
  onClose: () => void;
  user?: AssignableUser | null; // For create mode: this already has full details
  assignment?: BoardingAssignment | null; // For edit mode: this already has full populated details
  mode: 'create' | 'edit';
}

/**
 * Assign Boarding Modal Component
 * Modal for assigning users to boarding packages or editing existing assignments
 */
const AssignBoardingModal = memo(({ open, onClose, user, assignment, mode }: AssignBoardingModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading } = useAppSelector(selectBoardingAssignmentState);
  const packageTypes = useAppSelector(selectMasterBoardingPackageTypes);
  const packages = useAppSelector(selectMasterBoardingPackages);
  const fullDayMealPackages = useAppSelector(selectMasterFullDayMealPackages);

  const [selectedPackageTypeId, setSelectedPackageTypeId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');

  const isEdit = mode === 'edit';

  // For create mode, 'user' prop is AssignableUser.
  // For edit mode, 'assignment' prop is BoardingAssignment, which has 'user' (populated).
  // We need the 'id' and 'userType' from the top-level of BoardingAssignment for the DTO
  // and the nested 'user' for display.
  const userForCreationOrEditLogic = isEdit ? assignment : user; // This gives us userId, userType directly
  const userDetailsForDisplay = isEdit ? assignment?.user : user; // This gives us firstName, lastName, photoUrl, email

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      packageTypeId: '',
      packageId: '',
      fullDayMealPackageId: '',
      discountPercentage: 0,
      notes: '',
    },
  });

  const watchedPackageTypeId = watch('packageTypeId');
  const watchedPackageId = watch('packageId');
  const watchedFullDayMealPackageId = watch('fullDayMealPackageId');
  const watchedDiscountPercentage = watch('discountPercentage');

  // Fetch required data for dropdowns
  useEffect(() => {
    if (open) {
      if (packageTypes.length === 0) {
        dispatch(fetchBoardingPackageTypes({}));
      }
      if (packages.length === 0) {
        dispatch(fetchBoardingPackages({}));
      }
      if (fullDayMealPackages.length === 0) {
        dispatch(fetchFullDayMealPackages({}));
      }
    }
  }, [open, dispatch, packageTypes.length, packages.length, fullDayMealPackages.length]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (isEdit && assignment) {
        // Find the package type and package for the assignment
        const mealPackage = fullDayMealPackages.find(mp => mp.id === assignment.fullDayMealPackageId);
        // It's possible mealPackage.packageId is undefined, fallback to assignment.fullDayMealPackage?.packageId if needed
        const packageItem = packages.find(p => p.id === mealPackage?.packageId); // This lookup assumes mealPackage has packageId
        const packageType = packageTypes.find(pt => pt.id === packageItem?.packageTypeId);

        reset({
          packageTypeId: packageType?.id || '',
          packageId: packageItem?.id || '',
          fullDayMealPackageId: assignment.fullDayMealPackageId,
          discountPercentage: assignment.discountPercentage,
          notes: assignment.notes || '',
        });

        setSelectedPackageTypeId(packageType?.id || '');
        setSelectedPackageId(packageItem?.id || '');
      } else {
        reset({
          packageTypeId: '',
          packageId: '',
          fullDayMealPackageId: '',
          discountPercentage: 0,
          notes: '',
        });
        setSelectedPackageTypeId('');
        setSelectedPackageId('');
      }
    }
  }, [open, isEdit, assignment, reset, fullDayMealPackages, packages, packageTypes]); // Added dependencies for useEffect

  // Update local state when form values change
  useEffect(() => {
    setSelectedPackageTypeId(watchedPackageTypeId);
  }, [watchedPackageTypeId]);

  useEffect(() => {
    setSelectedPackageId(watchedPackageId);
  }, [watchedPackageId]);

  // Clear dependent fields when package type changes
  useEffect(() => {
    if (watchedPackageTypeId !== selectedPackageTypeId) {
      setValue('packageId', '');
      setValue('fullDayMealPackageId', '');
      setSelectedPackageId('');
    }
  }, [watchedPackageTypeId, selectedPackageTypeId, setValue]);

  // Clear meal package when package changes
  useEffect(() => {
    if (watchedPackageId !== selectedPackageId) {
      setValue('fullDayMealPackageId', '');
    }
  }, [watchedPackageId, selectedPackageId, setValue]);

  /**
   * Get filtered packages based on selected package type
   */
  const filteredPackages = useMemo(() => {
    if (!watchedPackageTypeId) return [];
    return packages.filter(pkg => pkg.packageTypeId === watchedPackageTypeId);
  }, [packages, watchedPackageTypeId]);

  /**
   * Get filtered meal packages based on selected package
   */
  const filteredMealPackages = useMemo(() => {
    if (!watchedPackageId) return [];
    return fullDayMealPackages.filter(mp => mp.packageId === watchedPackageId);
  }, [fullDayMealPackages, watchedPackageId]);

  /**
   * Calculate price details
   */
  const priceDetails = useMemo(() => {
    const selectedMealPackage = fullDayMealPackages.find(mp => mp.id === watchedFullDayMealPackageId);
    const originalPrice = selectedMealPackage?.price || 0;
    const discountAmount = (originalPrice * watchedDiscountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;

    return {
      originalPrice,
      discountAmount,
      finalPrice,
      selectedMealPackage,
    };
  }, [fullDayMealPackages, watchedFullDayMealPackageId, watchedDiscountPercentage]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: AssignmentFormData) => {
    try {
      if (!userForCreationOrEditLogic || !userForCreationOrEditLogic.id || !userForCreationOrEditLogic.userType || !userDetailsForDisplay || !priceDetails.selectedMealPackage) {
        showToast('Missing required user or package information.', 'error');
        return;
      }

      // Prepare the DTO with the full user and fullDayMealPackage details
      const createDto: CreateBoardingAssignmentDto = {
        userId: userForCreationOrEditLogic.id,
        userType: userForCreationOrEditLogic.userType,
        fullDayMealPackageId: data.fullDayMealPackageId,
        assignedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        discountPercentage: data.discountPercentage,
        originalPrice: priceDetails.originalPrice,
        discountAmount: priceDetails.discountAmount,
        finalPrice: priceDetails.finalPrice,
        status: STATUSES_OBJECT.ACTIVE, // Assuming it's active upon creation
        assignedBy: 'admin1', // This should come from auth context
        notes: data.notes,
        // Pass the populated user and fullDayMealPackage directly
        user: {
          id: userDetailsForDisplay.id,
          firstName: userDetailsForDisplay.firstName,
          lastName: userDetailsForDisplay.lastName,
          email: userDetailsForDisplay.email,
          photoUrl: userDetailsForDisplay.photoUrl,
        },
        fullDayMealPackage: {
          id: priceDetails.selectedMealPackage.id,
          name: priceDetails.selectedMealPackage.name,
          price: priceDetails.selectedMealPackage.price,
          // packageTypes থেকে নাম খুঁজে বের করুন
          packageTypeName: packageTypes.find(pt => pt.id === priceDetails.selectedMealPackage?.packageTypeId)?.name || '',
          // packages থেকে নাম খুঁজে বের করুন
          packageName: packages.find(pkg => pkg.id === priceDetails.selectedMealPackage?.packageId)?.name || '',
        },
      };


      if (isEdit && assignment) {
        // For edit, we only pass what UpdateBoardingAssignmentDto allows.
        // If fullDayMealPackageId changes, the API will re-resolve its details based on its own data logic.
        // For this mock API, the `fullDayMealPackage` object within the stored `BoardingAssignment` will *not*
        // automatically update its `name`, `price`, etc. if only the `fullDayMealPackageId` is changed in the DTO.
        // The API would need a lookup mechanism (e.g., to `masterBoardingSlice` data or a real backend).
        // Since you explicitly said "no mock data" in the API service, I am not adding that lookup here.
        // If you need the populated package details to update on edit, `UpdateBoardingAssignmentDto`
        // should also contain the full `fullDayMealPackage` object.
        const updateDto: UpdateBoardingAssignmentDto = {
          fullDayMealPackageId: data.fullDayMealPackageId,
          discountPercentage: data.discountPercentage,
          originalPrice: priceDetails.originalPrice,
          discountAmount: priceDetails.discountAmount,
          finalPrice: priceDetails.finalPrice,
          notes: data.notes,
          status: assignment.status, // Preserve existing status or allow change if needed
        };
        await dispatch(updateBoardingAssignment({
          id: assignment.id,
          data: updateDto
        })).unwrap();
        showToast(`Boarding Assignment ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createBoardingAssignment(createDto)).unwrap();
        showToast(`Boarding Assignment ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }

      onClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} boarding assignment`, 'error');
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    reset();
    setSelectedPackageTypeId('');
    setSelectedPackageId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {isEdit ? 'Edit Boarding Assignment' : 'Assign to Boarding'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* User Information */}
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    User Information
                  </Typography>
                  {userDetailsForDisplay && userForCreationOrEditLogic?.userType ? ( // Check both for robust rendering
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={userDetailsForDisplay.photoUrl}
                        sx={{ width: 60, height: 60 }}
                      >
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {userDetailsForDisplay.firstName} {userDetailsForDisplay.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userDetailsForDisplay.email}
                        </Typography>
                        <Chip
                          label={userForCreationOrEditLogic.userType} // Use userType from the logic object
                          size="small"
                          color={userForCreationOrEditLogic.userType === 'student' ? 'primary' : userForCreationOrEditLogic.userType === 'teacher' ? 'secondary' : 'success'}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="warning">User details could not be loaded.</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Package Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="packageTypeId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.packageTypeId}>
                    <InputLabel>Package Type *</InputLabel>
                    <Select {...field} label="Package Type *" disabled={isEdit}>
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
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="packageId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.packageId}>
                    <InputLabel>Package *</InputLabel>
                    <Select
                      {...field}
                      label="Package *"
                      disabled={!watchedPackageTypeId || isEdit}
                    >
                      <MenuItem value="">Select Package</MenuItem>
                      {filteredPackages.map((pkg) => (
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
                    {!watchedPackageTypeId && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        Please select a package type first
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="fullDayMealPackageId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.fullDayMealPackageId}>
                    <InputLabel>Full Day Meal Package *</InputLabel>
                    <Select
                      {...field}
                      label="Full Day Meal Package *"
                      disabled={!watchedPackageId}
                    >
                      <MenuItem value="">Select Meal Package</MenuItem>
                      {filteredMealPackages.map((mp) => (
                        <MenuItem key={mp.id} value={mp.id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography>{mp.name}</Typography>
                            <Typography color="primary" fontWeight={600}>
                              ৳{mp.price.toLocaleString()}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.fullDayMealPackageId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.fullDayMealPackageId.message}
                      </Typography>
                    )}
                    {!watchedPackageId && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        Please select a package first
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Discount and Price Calculation */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="discountPercentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Discount (%)"
                    type="number"
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    error={!!errors.discountPercentage}
                    helperText={errors.discountPercentage?.message || "0 to 100 percent"}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange(0);
                      } else {
                        const num = Math.min(100, Math.max(0, parseFloat(value)));
                        field.onChange(num);
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Final Price (৳)"
                type="number"
                value={priceDetails.finalPrice.toFixed(2)}
                disabled
                helperText="Automatically calculated"
              />
            </Grid>

            {/* Price Breakdown */}
            {priceDetails.selectedMealPackage && (
              <Grid size={{ xs: 12 }}>
                <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Receipt color="primary" />
                      <Typography variant="h6" color="primary" fontWeight={600}>
                        Price Breakdown
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            🍽️ {priceDetails.selectedMealPackage.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Original Price: ৳{priceDetails.originalPrice.toFixed(2)}
                          </Typography>
                          {watchedDiscountPercentage > 0 && (
                            <Typography variant="body2" color="error.main">
                              Discount ({watchedDiscountPercentage}%): -৳{priceDetails.discountAmount.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 2, boxShadow: 1 }}>
                          <Typography variant="h6" fontWeight={600} color="success.main">
                            💰 Final Price: ৳{priceDetails.finalPrice.toFixed(2)}
                          </Typography>
                          {watchedDiscountPercentage > 0 && (
                            <Typography variant="body2" color="success.main">
                              You save ৳{priceDetails.discountAmount.toFixed(2)}!
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Notes */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                    placeholder="Add any additional notes about this assignment..."
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
            disabled={loading || isSubmitting || !priceDetails.selectedMealPackage}
            sx={{ minWidth: 120 }}
          >
            {loading || isSubmitting
              ? t('common.loading')
              : isEdit
                ? 'Update Assignment'
                : 'Assign to Boarding'
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

AssignBoardingModal.displayName = 'AssignBoardingModal';

export { AssignBoardingModal };