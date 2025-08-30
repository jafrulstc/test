import React, { useEffect, useState, useRef, memo, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { AttachFile, Delete, Add, Remove } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  selectGuardians,
  fetchGuardians,
  selectEducationalMentors,
} from '~/features/core/store/generalSlice';
import {
  selectEducationLevels,
  selectAcademicYears,
  selectAcademicClasses,
  selectAcademicGroups,
  selectShifts,
  selectSections,
  selectClassGroupMappings,
  fetchAllAcademicEntities,
  fetchClassGroupMappings,
} from '~/features/core/store/academicSlice';
import {
  selectTeachers,
  fetchTeachers,
} from '~/features/education/teachers/store/teacherSlice';
import {
  fetchStudentsForDropdown,
  selectStudents,
} from '../store/studentSlice';
import {
  createAdmission,
  updateAdmission,
  fetchNextAdmissionNumber,
  selectNextAdmissionNumber,
  selectAdmissions,
  selectAdmissionState,
  fetchAdmissions,
} from '../store/admissionSlice';
import { admissionSchema, type AdmissionFormData } from '../schemas/admissionSchema';
import type { Admission } from '../types';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

interface AdmissionFormProps {
  admission?: Admission | null;
  onSuccess?: (admission: Admission) => void;
}

/**
 * Admission form component
 */
const AdmissionForm = memo(({ admission, onSuccess }: AdmissionFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const guardians = useAppSelector(selectGuardians);
  const teachers = useAppSelector(selectTeachers);
  const allStudents = useAppSelector(selectStudents);
  const allEducationalMentors = useAppSelector(selectEducationalMentors);
  const educationLevels = useAppSelector(selectEducationLevels);
  const academicYears = useAppSelector(selectAcademicYears);
  const academicClasses = useAppSelector(selectAcademicClasses);
  const academicGroups = useAppSelector(selectAcademicGroups);
  const shifts = useAppSelector(selectShifts);
  const sections = useAppSelector(selectSections);
  const classGroupMappings = useAppSelector(selectClassGroupMappings);
  const nextAdmissionNumber = useAppSelector(selectNextAdmissionNumber);
  const allAdmissions = useAppSelector(selectAdmissions);
  const { pagination: admissionPagination } = useAppSelector(selectAdmissionState);

  /**
   * Calculate next class role based on existing admissions
   */
  const calculateNextClassRole = () => {
    if (allAdmissions.length === 0) return 1; // Start with 1 if no admissions exist

    const highestRole = Math.max(...allAdmissions.map(admission => {
      // Extract the numeric part from classRole (e.g., 1 from "1", 2 from "2", etc.)
      const roleMatch = admission.classRole?.toString().match(/^(\d+)/);
      return roleMatch ? parseInt(roleMatch[1], 10) : 0;
    }));

    return highestRole + 1;
  };

  const [showPreviousSchool, setShowPreviousSchool] = useState(false);
  const [fileUploading, setFileUploading] = useState<Record<number, boolean>>({});

  const tcFileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const isEdit = Boolean(admission);

  const [isFormInitialized, setIsFormInitialized] = useState(false);



  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      admissionDate: '',
      registrationNumber: '',
      classRole: calculateNextClassRole(),
      educationalMentorId: '',
      guardianId: '',
      teacherId: '',
      studentId: '',
      academicYearId: '',
      academicClassId: '',
      academicGroupId: '',
      shiftId: '',
      sectionId: '',
      rollNumber: 0,
      admissionFee: 0,
      previousSchoolDetails: [],
      status: STATUSES_OBJECT.ACTIVE,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'previousSchoolDetails',
  });

  const selectedGuardianId = watch('guardianId');
  const selectedTeacherId = watch('teacherId');
  const selectedYearId = watch('academicYearId');
  const selectedClassId = watch('academicClassId');
  const selectedGroupId = watch('academicGroupId');
  const selectedShiftId = watch('shiftId');

  // Fetch required master data
  useEffect(() => {
    if (guardians.length === 0) {
      dispatch(fetchGuardians({ page: 1, limit: 1000, filters: {} }));
    }
    if (teachers.length === 0) {
      dispatch(fetchTeachers({ page: 1, limit: 1000, filters: {} }));
    }

    if (allStudents.length === 0) {
      dispatch(fetchStudentsForDropdown());
    }
    if (allAdmissions.length === 0 || allAdmissions.length < admissionPagination.total) {
      dispatch(fetchAdmissions({ page: 1, limit: admissionPagination.total > 0 ? admissionPagination.total : 10000 }));
    }
    if (educationLevels.length === 0 || academicYears.length === 0 || academicClasses.length === 0 || academicGroups.length === 0 || shifts.length === 0 || sections.length === 0) {
      dispatch(fetchAllAcademicEntities());
    }
    if (classGroupMappings.length === 0) {
      dispatch(fetchClassGroupMappings({ page: 1, limit: 1000, filters: {} }));
    }
    if (!isEdit) {
      dispatch(fetchNextAdmissionNumber());
      // Auto-generate class role for new admissions
      const nextClassRole = calculateNextClassRole();
      setValue('classRole', nextClassRole);
    }
  }, [
    dispatch,
    guardians.length,
    teachers.length,
    allStudents.length,
    educationLevels.length,
    academicYears.length,
    academicClasses.length,
    academicGroups.length,
    shifts.length,
    sections.length,
    classGroupMappings.length,
    isEdit,
    allAdmissions.length,
    admissionPagination.total,
  ]);

  // Reset form when admission changes
  useEffect(() => {
    if (admission) {
      const defaultValues: AdmissionFormData = {
        admissionDate: admission.admissionDate,
        registrationNumber: admission.registrationNumber || '',
        classRole: admission.classRole || 0,
        educationalMentorId: admission.educationalMentorId || '',
        guardianId: admission.guardianId || '',
        teacherId: admission.teacherId || '',
        studentId: admission.studentId,
        academicYearId: admission.academicYearId,
        academicClassId: admission.academicClassId,
        academicGroupId: admission.academicGroupId || '',
        shiftId: admission.shiftId || '',
        sectionId: admission.sectionId || '',
        rollNumber: admission.rollNumber,
        admissionFee: admission.admissionFee,
        previousSchoolDetails: admission.previousSchoolDetails || [],
        status: admission.status,
      };

      reset(defaultValues);
      setShowPreviousSchool(Boolean(admission.previousSchoolDetails && admission.previousSchoolDetails.length > 0));
      setIsFormInitialized(false); // Reset initialization flag
    } else {
      reset({
        admissionDate: new Date().toISOString().split('T')[0],
        registrationNumber: '',
        educationalMentorId: '',
        guardianId: '',
        teacherId: '',
        studentId: '',
        academicYearId: '',
        academicClassId: '',
        academicGroupId: '',
        shiftId: '',
        sectionId: '',
        rollNumber: 0,
        admissionFee: 0,
        previousSchoolDetails: [],
        status: STATUSES_OBJECT.ACTIVE,
        classRole: calculateNextClassRole(), // Auto-generate class role for new form
      });
      setShowPreviousSchool(false);
      setIsFormInitialized(true);
    }
  }, [admission, reset]);

  // Clear teacher when guardian is selected and vice versa
  useEffect(() => {
    if (selectedGuardianId) {
      setValue('teacherId', '');
    }
  }, [selectedGuardianId, setValue]);

  useEffect(() => {
    if (selectedTeacherId) {
      setValue('guardianId', '');
    }
  }, [selectedTeacherId, setValue]);

  // Clear dependent fields when parent selections change
  useEffect(() => {
    if (selectedYearId) {
      setValue('academicClassId', '');
      setValue('academicGroupId', '');
      setValue('shiftId', '');
      setValue('sectionId', '');
    }
  }, [selectedYearId, setValue]);

  useEffect(() => {
    if (selectedClassId) {
      setValue('academicGroupId', '');
      setValue('shiftId', '');
      setValue('sectionId', '');
    }
  }, [selectedClassId, setValue]);

  useEffect(() => {
    if (selectedGroupId) {
      setValue('shiftId', '');
      setValue('sectionId', '');
    }
  }, [selectedGroupId, setValue]);

  useEffect(() => {
    if (selectedShiftId) {
      setValue('sectionId', '');
    }
  }, [selectedShiftId, setValue]);



  useEffect(() => {
    if (admission &&
      classGroupMappings.length > 0 &&
      academicYears.length > 0 &&
      academicClasses.length > 0 &&
      academicGroups.length > 0 &&
      shifts.length > 0 &&
      sections.length > 0) {

      // Set values in dependency order with small delays
      const initializeForm = async () => {
        // Set academic year first
        if (admission.academicYearId) {
          setValue('academicYearId', admission.academicYearId);

          // Wait a bit for filters to update
          await new Promise(resolve => setTimeout(resolve, 100));

          // Set academic class
          if (admission.academicClassId) {
            setValue('academicClassId', admission.academicClassId);
            await new Promise(resolve => setTimeout(resolve, 100));

            // Set academic group
            if (admission.academicGroupId) {
              setValue('academicGroupId', admission.academicGroupId);
              await new Promise(resolve => setTimeout(resolve, 100));

              // Set shift
              if (admission.shiftId) {
                setValue('shiftId', admission.shiftId);
                await new Promise(resolve => setTimeout(resolve, 100));

                // Set section
                if (admission.sectionId) {
                  setValue('sectionId', admission.sectionId);
                }
              }
            }
          }
        }

        setIsFormInitialized(true);
      };

      // Only initialize if not already initialized
      if (!isFormInitialized) {
        initializeForm();
      }
    }
  }, [
    admission,
    isFormInitialized,
    classGroupMappings.length,
    academicYears.length,
    academicClasses.length,
    academicGroups.length,
    shifts.length,
    sections.length,
    setValue
  ]);


  const availableStudents = useMemo(() => {
    const admittedStudentIds = new Set(allAdmissions.map(adm => adm.studentId));
    const currentAdmissionStudentId = admission?.studentId;

    const studentsToConsider = allStudents.filter(student => {
      if (isEdit && student.id === currentAdmissionStudentId) {
        return true;
      }
      const isActive = student.status === STATUSES_OBJECT.ACTIVE;
      const isCurrentlyAdmittedToOtherAdmission = admittedStudentIds.has(student.id) && student.id !== currentAdmissionStudentId;

      return isActive && !isCurrentlyAdmittedToOtherAdmission;
    });

    studentsToConsider.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return studentsToConsider;
  }, [allStudents, allAdmissions, isEdit, admission?.studentId]);

  /**
   * Handle TC file upload
   */
  const handleTcFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file (PDF or image)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only PDF, JPEG, PNG, and GIF files are allowed', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    setFileUploading(prev => ({ ...prev, [index]: true }));
    try {
      // Convert to base64 for mock implementation
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setValue(`previousSchoolDetails.${index}.tcFileUrl`, result);
        setValue(`previousSchoolDetails.${index}.tcFileName`, file.name);
        showToast('TC file uploaded successfully', 'success');
        setFileUploading(prev => ({ ...prev, [index]: false }));
      };
      reader.onerror = () => {
        showToast('Failed to upload TC file', 'error');
        setFileUploading(prev => ({ ...prev, [index]: false }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showToast('Failed to upload TC file', 'error');
      setFileUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  /**
   * Remove uploaded file
   */
  const handleRemoveFile = (index: number) => {
    setValue(`previousSchoolDetails.${index}.tcFileUrl`, '');
    setValue(`previousSchoolDetails.${index}.tcFileName`, '');
    showToast('File removed successfully', 'success');
  };

  /**
   * Add new previous school entry
   */
  const addPreviousSchool = () => {
    if (fields.length >= 10) {
      showToast('Maximum 10 previous schools allowed', 'warning');
      return;
    }
    append({
      schoolName: '',
      tcNumber: '',
      tcFileUrl: '',
      tcFileName: '',
      schoolPhone: '',
      schoolEmail: '',
      details: '',
      className: '',
      result: 0
    });
  };

  /**
   * Remove previous school entry
   */
  const removePreviousSchool = (index: number) => {
    remove(index);
  };

  /**
   * Get filtered academic classes based on selected year
   */
  const getFilteredAcademicClasses = () => {
    if (!selectedYearId) return [];

    // Get class IDs from class group mappings for the selected year
    const relevantMappings = classGroupMappings.filter(mapping =>
      mapping.academicYearId === selectedYearId
    );

    const classIds = [...new Set(relevantMappings.map(mapping => mapping.academicClassId))];

    return academicClasses.filter(cls => classIds.includes(cls.id));
  };

  /**
   * Get filtered academic groups based on selected class and year
   */
  const getFilteredAcademicGroups = () => {
    if (!selectedYearId || !selectedClassId) return [];

    // Get group IDs from class group mappings for the selected year and class
    const relevantMappings = classGroupMappings.filter(mapping =>
      mapping.academicYearId === selectedYearId && mapping.academicClassId === selectedClassId
    );

    const groupIds = [...new Set(relevantMappings.map(mapping => mapping.academicGroupId))];

    return academicGroups.filter(group => groupIds.includes(group.id));
  };

  /**
   * Get filtered shifts based on selected year, class, and group
   */
  const getFilteredShifts = () => {
    if (!selectedYearId || !selectedClassId || !selectedGroupId) return [];

    // Get shift IDs from class group mappings
    const relevantMappings = classGroupMappings.filter(mapping =>
      mapping.academicYearId === selectedYearId &&
      mapping.academicClassId === selectedClassId &&
      mapping.academicGroupId === selectedGroupId
    );

    const shiftIds = [...new Set(
      relevantMappings.flatMap(mapping =>
        mapping.shiftSectionMapping.map(ssm => ssm.shiftId)
      )
    )];

    return shifts.filter(shift => shiftIds.includes(shift.id));
  };

  /**
   * Get filtered sections based on selected year, class, group, and shift
   */
  const getFilteredSections = () => {
    if (!selectedYearId || !selectedClassId || !selectedGroupId || !selectedShiftId) return [];

    // Get section IDs from class group mappings
    const relevantMappings = classGroupMappings.filter(mapping =>
      mapping.academicYearId === selectedYearId &&
      mapping.academicClassId === selectedClassId &&
      mapping.academicGroupId === selectedGroupId
    );

    const sectionIds = [...new Set(
      relevantMappings.flatMap(mapping =>
        mapping.shiftSectionMapping
          .filter(ssm => ssm.shiftId === selectedShiftId)
          .flatMap(ssm => ssm.sectionIds)
      )
    )];

    return sections.filter(section => sectionIds.includes(section.id));
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (data: AdmissionFormData) => {
    try {
      // Remove previous school details if not shown
      const submissionData: any = {
        ...data,
        previousSchoolDetails: showPreviousSchool && data.previousSchoolDetails && data.previousSchoolDetails.length > 0
          ? data.previousSchoolDetails
          : undefined,
      };

      if (isEdit && admission) {
        const updatedAdmission = await dispatch(updateAdmission({ id: admission.id, data: submissionData })).unwrap();
        showToast(`Admission ${SUCCESS_MESSAGES.UPDATED}`, 'success');
        onSuccess?.(updatedAdmission);
      } else {
        const newAdmission = await dispatch(createAdmission(submissionData)).unwrap();
        showToast(`Admission ${SUCCESS_MESSAGES.CREATED}`, 'success');
        onSuccess?.(newAdmission);
        // Reset form after successful creation
        reset();
        setShowPreviousSchool(false);
        dispatch(fetchNextAdmissionNumber());
      }
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} admission`, 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {isEdit ? 'Edit Admission' : 'New Admission'}
          </Typography>

          <Grid container spacing={3}>
            {/* Admission Details */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Admission Details
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Admission Number"
                value={isEdit ? admission?.admissionNumber : nextAdmissionNumber}
                disabled
                helperText="Auto-generated admission number"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="registrationNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Registration Number"
                    error={!!errors.registrationNumber}
                    helperText={errors.registrationNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="admissionDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Admission Date *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.admissionDate}
                    helperText={errors.admissionDate?.message}
                  />
                )}
              />
            </Grid>

            {/* Guardian/Teacher Information */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Guardian/Teacher Information
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Select either a Guardian or a Teacher. If no guardian is available, you can select a teacher as guardian.
              </Alert>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="guardianId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.guardianId}>
                    <InputLabel>Guardian</InputLabel>
                    <Select
                      {...field}
                      label="Guardian"
                      // নিশ্চিত করুন যে মানটি অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
                      value={field.value && guardians.some(g => g.id === field.value)
                        ? field.value
                        : ''
                      }
                      disabled={Boolean(selectedTeacherId) || guardians.length === 0} // গার্ডিয়ান লোড না হলে অক্ষম করুন
                    >
                      <MenuItem value="">Select Guardian</MenuItem>
                      {guardians.map((guardian) => (
                        <MenuItem key={guardian.id} value={guardian.id}>
                          {guardian.name}
                        </MenuItem>
                      ))}
                    </Select>


                    {errors.guardianId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.guardianId.message}
                      </Typography>
                    )}
                    {guardians.length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        No guardians available.
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="teacherId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.teacherId}>
                    <InputLabel>Teacher</InputLabel>
                    <Select
                      {...field}
                      label="Teacher"
                      // নিশ্চিত করুন যে মানটি অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
                      value={field.value && teachers.some(t => t.id === field.value)
                        ? field.value
                        : ''
                      }
                      disabled={Boolean(selectedGuardianId) || teachers.length === 0} // শিক্ষক লোড না হলে অক্ষম করুন
                    >
                      <MenuItem value="">Select Teacher</MenuItem>
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher.id} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.teacherId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.teacherId.message}
                      </Typography>
                    )}
                    {teachers.length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        No teachers available.
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Class Role and Educational Mentor */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Class Role and Educational Mentor
              </Typography>
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="rollNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Roll Number *"
                    error={!!errors.rollNumber}
                    helperText={errors.rollNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="educationalMentorId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.educationalMentorId}>
                    <InputLabel>Educational Mentor</InputLabel>
                    <Select
                      {...field}
                      label="Educational Mentor"
                      value={field.value && allEducationalMentors.some(mentor => mentor.id === field.value)
                        ? field.value
                        : ''
                      }
                      disabled={allEducationalMentors.length === 0}
                    >
                      <MenuItem value="">Select Educational Mentor</MenuItem>
                      {allEducationalMentors.map((mentor) => (
                        <MenuItem key={mentor.id} value={mentor.id}>
                          {mentor.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.educationalMentorId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.educationalMentorId.message}
                      </Typography>
                    )}
                    {allEducationalMentors.length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        No educational mentors available.
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Student Information */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Student Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="studentId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.studentId}>
                    <InputLabel>Student *</InputLabel>
                    <Select
                      {...field}
                      label="Student *"
                      // নিশ্চিত করুন যে মানটি অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
                      value={field.value && availableStudents.some(s => s.id === field.value)
                        ? field.value
                        : ''
                      }
                      disabled={availableStudents.length === 0}
                    >
                      <MenuItem value="">Select Student</MenuItem>
                      {availableStudents.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.studentId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.studentId.message}
                      </Typography>
                    )}
                    {availableStudents.length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        No active, unadmitted students available.
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Academic Information */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Academic Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="academicYearId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.academicYearId}>
                    <InputLabel>Academic Year *</InputLabel>
                    <Select
                      {...field}
                      label="Academic Year *"
                      // নিশ্চিত করুন যে মানটি অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
                      value={field.value && academicYears.some(year => year.id === field.value)
                        ? field.value
                        : ''
                      }
                      disabled={academicYears.length === 0} // একাডেমিক বছর লোড না হলে অক্ষম করুন
                    >
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
                    {academicYears.length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        No academic years available.
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="academicClassId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.academicClassId}>
                    <InputLabel>Academic Class *</InputLabel>
                    {/* <Select
                      {...field}
                      label="Academic Class *"
                      // নিশ্চিত করুন যে মানটি ফিল্টার করা অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
                      value={field.value && getFilteredAcademicClasses().some(cls => cls.id === field.value)
                        ? field.value
                        : ''
                      }
                      disabled={!selectedYearId || getFilteredAcademicClasses().length === 0}
                    >
                      <MenuItem value="">Select Academic Class</MenuItem>
                      {getFilteredAcademicClasses().map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select> */}

                    <Select
                      {...field}
                      label="Academic Class *"
                      value={(() => {
                        const filteredClasses = getFilteredAcademicClasses();
                        // If field has value and it exists in filtered options, use it
                        if (field.value && filteredClasses.some(cls => cls.id === field.value)) {
                          return field.value;
                        }
                        // If we're in edit mode and the admission has this value, check if it should be available
                        if (isEdit && admission?.academicClassId &&
                          academicClasses.some(cls => cls.id === admission.academicClassId)) {
                          // Check if this class should be available for the selected year
                          const relevantMappings = classGroupMappings.filter(mapping =>
                            mapping.academicYearId === selectedYearId &&
                            mapping.academicClassId === admission.academicClassId
                          );
                          if (relevantMappings.length > 0) {
                            return admission.academicClassId;
                          }
                        }
                        return '';
                      })()}
                      disabled={!selectedYearId || getFilteredAcademicClasses().length === 0}
                    >
                      <MenuItem value="">Select Academic Class</MenuItem>
                      {getFilteredAcademicClasses().map((cls) => (
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
                    {!selectedYearId && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        Please select an academic year first
                      </Typography>
                    )}
                    {selectedYearId && getFilteredAcademicClasses().length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        No academic classes available for the selected year.
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="academicGroupId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.academicGroupId}>
                    <InputLabel>Academic Group</InputLabel>
                    <Select
                      {...field}
                      label="Academic Group"
                      value={(() => {
                        const filteredGroups = getFilteredAcademicGroups();
                        // 1) ফিল্টার করা অপশনে থাকলে সেটাই নিন
                        if (field.value && filteredGroups.some(g => g.id === field.value)) {
                          return field.value;
                        }
                        // 2) Edit mode: Admission-এর group বৈধ হলে ধরে রাখুন
                        if (isEdit && admission?.academicGroupId &&
                          academicGroups.some(g => g.id === admission.academicGroupId)) {
                          const relevantMappings = classGroupMappings.filter(m =>
                            m.academicYearId === selectedYearId &&
                            m.academicClassId === selectedClassId &&
                            m.academicGroupId === admission.academicGroupId
                          );
                          if (relevantMappings.length > 0) {
                            return admission.academicGroupId;
                          }
                        }
                        return '';
                      })()}
                      disabled={
                        !selectedYearId ||
                        !selectedClassId ||
                        getFilteredAcademicGroups().length === 0
                      }
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
                    {(!selectedYearId || !selectedClassId) && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        Please select academic year and class first
                      </Typography>
                    )}
                    {selectedYearId && selectedClassId && getFilteredAcademicGroups().length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        No academic groups available for the selected class.
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="shiftId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.shiftId}>
                      <InputLabel>Shift</InputLabel>
                      <Select
                        {...field}
                        label="Shift"
                        value={(() => {
                          const filteredShifts = getFilteredShifts();
                          // If field has value and it exists in filtered options, use it
                          if (field.value && filteredShifts.some(shift => shift.id === field.value)) {
                            return field.value;
                          }
                          // If we're in edit mode and the admission has this value, check if it should be available
                          if (isEdit && admission?.shiftId &&
                            shifts.some(shift => shift.id === admission.shiftId)) {
                            // Check if this shift should be available for the selected year, class, and group
                            const relevantMappings = classGroupMappings.filter(mapping =>
                              mapping.academicYearId === selectedYearId &&
                              mapping.academicClassId === selectedClassId &&
                              mapping.academicGroupId === selectedGroupId
                            );

                            const shiftExists = relevantMappings.some(mapping =>
                              mapping.shiftSectionMapping?.some(ssm => ssm.shiftId === admission.shiftId)
                            );

                            if (shiftExists) {
                              return admission.shiftId;
                            }
                          }
                          return '';
                        })()}
                        disabled={
                          !selectedYearId ||
                          !selectedClassId ||
                          !selectedGroupId ||
                          getFilteredShifts().length === 0
                        }
                      >
                        <MenuItem value="">Select Shift</MenuItem>
                        {getFilteredShifts().map((shift) => (
                          <MenuItem key={shift.id} value={shift.id}>
                            {shift.name}
                          </MenuItem>
                        ))}
                      </Select>

                      {errors.shiftId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.shiftId.message}
                        </Typography>
                      )}
                      {(!selectedYearId || !selectedClassId || !selectedGroupId) && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                          Please select academic year, class, and group first
                        </Typography>
                      )}
                      {selectedYearId && selectedClassId && selectedGroupId && getFilteredShifts().length === 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                          No shifts available for the selected group.
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="sectionId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sectionId}>
                    <InputLabel>Section</InputLabel>
                    <Select
                      {...field}
                      label="Section"
                      value={(() => {
                        const filteredSections = getFilteredSections();
                        // 1) ফিল্টার করা অপশনে থাকলে সেটাই নিন
                        if (field.value && filteredSections.some(sec => sec.id === field.value)) {
                          return field.value;
                        }
                        // 2) Edit mode: Admission-এর section বৈধ হলে ধরে রাখুন
                        if (isEdit && admission?.sectionId &&
                          sections.some(sec => sec.id === admission.sectionId)) {
                          const effectiveShiftId = selectedShiftId || admission.shiftId || '';
                          const relevantMappings = classGroupMappings.filter(m =>
                            m.academicYearId === selectedYearId &&
                            m.academicClassId === selectedClassId &&
                            m.academicGroupId === selectedGroupId &&
                            m.shiftSectionMapping?.some(ssm =>
                              ssm.shiftId === effectiveShiftId &&
                              (ssm.sectionIds || []).includes(admission.sectionId as any)
                            )
                          );
                          if (relevantMappings.length > 0) {
                            return admission.sectionId;
                          }
                        }
                        return '';
                      })()}
                      disabled={
                        !selectedYearId || !selectedClassId || !selectedGroupId || !selectedShiftId ||
                        getFilteredSections().length === 0
                      }
                    >
                      <MenuItem value="">Select Section</MenuItem>
                      {getFilteredSections().map((section) => (
                        <MenuItem key={section.id} value={section.id}>
                          {section.name}
                        </MenuItem>
                      ))}
                    </Select>

                    {errors.sectionId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.sectionId.message}
                      </Typography>
                    )}
                    {(!selectedYearId || !selectedClassId || !selectedGroupId || !selectedShiftId) && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        Please select academic year, class, group, and shift first
                      </Typography>
                    )}
                    {selectedYearId && selectedClassId && selectedGroupId && selectedShiftId && getFilteredSections().length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                        No sections available for the selected shift.
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

            </Grid>

            {/* class role start */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="classRole"
                control={control}
                disabled
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Class Role"
                    error={!!errors.classRole}
                    helperText={errors.classRole?.message || "Auto-generated class role"}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="admissionFee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Admission Fee *"
                    type="number"
                    error={!!errors.admissionFee}
                    helperText={errors.admissionFee?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            {/* Previous School Details */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Previous School Details (Optional)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowPreviousSchool(!showPreviousSchool)}
                >
                  {showPreviousSchool ? 'Hide' : 'Add'} Previous School Details
                </Button>
              </Box>
            </Grid>

            {showPreviousSchool && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" fontWeight={500}>
                    Previous Schools ({fields.length}/10)
                  </Typography>
                  {fields.length < 10 && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={addPreviousSchool}
                    >
                      Add Previous School
                    </Button>
                  )}
                </Box>

                {fields.length === 0 && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    No previous schools added. Click "Add Previous School" to add information about previous institutions.
                  </Alert>
                )}

                {fields.map((field, index) => (
                  <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Previous School {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removePreviousSchool(index)}
                        >
                          <Remove />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name={`previousSchoolDetails.${index}.schoolName`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="School Name *"
                                error={!!(errors.previousSchoolDetails?.[index]?.schoolName)}
                                helperText={errors.previousSchoolDetails?.[index]?.schoolName?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name={`previousSchoolDetails.${index}.tcNumber`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="TC Number *"
                                error={!!(errors.previousSchoolDetails?.[index]?.tcNumber)}
                                helperText={errors.previousSchoolDetails?.[index]?.tcNumber?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name={`previousSchoolDetails.${index}.className`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Class Name *"
                                error={!!(errors.previousSchoolDetails?.[index]?.className)}
                                helperText={errors.previousSchoolDetails?.[index]?.className?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name={`previousSchoolDetails.${index}.result`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Result*"
                                type="number"
                                error={!!(errors.previousSchoolDetails?.[index]?.result)}
                                helperText={errors.previousSchoolDetails?.[index]?.result?.message}

                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name={`previousSchoolDetails.${index}.schoolPhone`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="School Phone"
                                error={!!(errors.previousSchoolDetails?.[index]?.schoolPhone)}
                                helperText={errors.previousSchoolDetails?.[index]?.schoolPhone?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name={`previousSchoolDetails.${index}.schoolEmail`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="School Email"
                                type="email"
                                error={!!(errors.previousSchoolDetails?.[index]?.schoolEmail)}
                                helperText={errors.previousSchoolDetails?.[index]?.schoolEmail?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Controller
                            name={`previousSchoolDetails.${index}.details`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Details"
                                multiline
                                rows={2}
                                placeholder="Additional details about this school..."
                                error={!!(errors.previousSchoolDetails?.[index]?.details)}
                                helperText={errors.previousSchoolDetails?.[index]?.details?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              Transfer Certificate (TC) File
                            </Typography>

                            {/* Show uploaded file if exists */}
                            <Controller
                              name={`previousSchoolDetails.${index}.tcFileName`}
                              control={control}
                              render={({ field }) => (
                                field.value ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Chip
                                      label={field.value}
                                      variant="outlined"
                                      color="success"
                                      onDelete={() => handleRemoveFile(index)}
                                      deleteIcon={<Delete />}
                                    />
                                  </Box>
                                ) : <></>
                              )}
                            />

                            <Button
                              variant="outlined"
                              startIcon={<AttachFile />}
                              onClick={() => tcFileInputRefs.current[index]?.click()}
                              disabled={fileUploading[index]}
                              fullWidth
                            >
                              {fileUploading[index] ? 'Uploading...' : 'Upload TC File'}
                            </Button>
                            <input
                              ref={(el) => { tcFileInputRefs.current[index] = el; }}
                              type="file"
                              accept=".pdf,image/*"
                              onChange={(e) => handleTcFileUpload(e, index)}
                              style={{ display: 'none' }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            )}

            {/* Status */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status *</InputLabel>
                    <Select {...field} label="Status *">
                      <MenuItem value={STATUSES_OBJECT.ACTIVE}>Active</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Inactive</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Cancelled</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Transferred</MenuItem>
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

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || Object.values(fileUploading).some(Boolean)}
                  sx={{ minWidth: 150 }}
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Admission' : 'Create Admission'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
});

AdmissionForm.displayName = 'AdmissionForm';

export { AdmissionForm };


