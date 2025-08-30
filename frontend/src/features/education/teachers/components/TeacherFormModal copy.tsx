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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Tabs,
  Tab,
  Chip,
  OutlinedInput,
  ListItemText,
  Divider,
} from '@mui/material';
import { Close, Person, CloudUpload, Add, Remove } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { tPath } from '~/shared/utils/translateType';
import {
  selectTeacherState,
  createTeacher,
  updateTeacher,
} from '../store/teacherSlice';
import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
  selectRelations,
  selectMaritalStatuses,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';
import {
  selectSubjects,
  selectGradeLevels,
  selectLanguageProficiencies,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';
import { AddressFields } from '~/features/core/components/general/AddressFields';
import { FileUpload } from '~/shared/components/ui/FileUpload';
import { DynamicFieldArray } from '~/shared/components/ui/DynamicFieldArray';
import { FormSection } from '~/shared/components/ui/FormSection';
import { MultiSelectChips } from '~/shared/components/ui/MultiSelectChips';
import { PhoneInput } from '~/shared/components/ui/PhoneInput';
import { teacherSchema, type TeacherFormData } from '../schemas/teacherSchema';
import { uploadPhoto, validatePhotoFile } from '~/shared/utils/photoUpload';
import type { Teacher, CreateTeacherDto, EducationalQualification, ProfessionalExperience, Reference, UpdateTeacherDto } from '../types/teacherType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { selectNationalities } from '~/features/core/store/geographySlice';

interface TeacherFormModalProps {
  open: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Tab panel component for displaying tab content
 */
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`teacher-tabpanel-${index}`}
      aria-labelledby={`teacher-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Teacher form modal component
 */
const TeacherFormModal = memo(({ open, onClose, teacher }: TeacherFormModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { loading } = useAppSelector(selectTeacherState);
  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const nationalities = useAppSelector(selectNationalities);
  const religions = useAppSelector(selectReligions);
  const relations = useAppSelector(selectRelations);
  const maritalStatuses = useAppSelector(selectMaritalStatuses);
  const subjects = useAppSelector(selectSubjects);
  const gradeLevels = useAppSelector(selectGradeLevels);
  const languageProficiencies = useAppSelector(selectLanguageProficiencies);

  const [activeTab, setActiveTab] = useState(0);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isEdit = Boolean(teacher);

  // Fetch required master data
  useEffect(() => {
    if (genders.length === 0) {
      dispatch(fetchAllSimpleEntities());
    }
    if (subjects.length === 0 || gradeLevels.length === 0 || languageProficiencies.length === 0) {
      dispatch(fetchAllAcademicEntities());
    }
  }, [dispatch, genders.length, subjects.length, gradeLevels.length, languageProficiencies.length]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      fatherName: '',
      motherName: '',
      mobileNumber: '',
      emailAddress: '',
      emergencyContact: '',
      nidNumber: '',
      birthRegNumber: '',
      photoUrl: '',
      genderId: '',
      bloodGroupId: '',
      nationalityId: '',
      maritalStatusId: '',
      presentAddress: {},
      permanentAddress: {},
      sameAsPresent: false,
      educationalQualifications: [
        {
          degreeName: '',
          institution: '',
          year: '',
          grade: '',
          documentUrl: '',
        },
      ],
      professionalExperience: [],
      references: [],
      salaryExpectation: 0,
      joiningDate: '',
      digitalSignatureUrl: '',
      yearsOfExperience: 0,
      noticePeriod: '',
      subjectIds: [],
      gradeLevelIds: [],
      languageProficiencyIds: [],
      computerSkills: '',
      teachingMethodology: '',
      onlineProfiles: {
        linkedin: '',
        personalWebsite: '',
      },
      details: '',
      status: 'ACTIVE',
    },
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control,
    name: 'educationalQualifications',
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'professionalExperience',
  });

  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
  } = useFieldArray({
    control,
    name: 'references',
  });

  const sameAsPresent = watch('sameAsPresent');
  const presentAddress = watch('presentAddress');

  // Reset form when modal opens or teacher changes
  useEffect(() => {
    if (open) {
      const defaultValues: TeacherFormData = {
        firstName: teacher?.firstName || '',
        lastName: teacher?.lastName || '',
        dateOfBirth: teacher?.dateOfBirth || '',
        placeOfBirth: teacher?.placeOfBirth || '',
        fatherName: teacher?.fatherName || '',
        motherName: teacher?.motherName || '',
        mobileNumber: teacher?.mobileNumber || '',
        emailAddress: teacher?.emailAddress || '',
        emergencyContact: teacher?.emergencyContact || '',
        nidNumber: teacher?.nidNumber || '',
        birthRegNumber: teacher?.birthRegNumber || '',
        photoUrl: teacher?.photoUrl || '',
        genderId: teacher?.genderId || '',
        bloodGroupId: teacher?.bloodGroupId || '',
        nationalityId: teacher?.nationalityId || '',
        maritalStatusId: teacher?.maritalStatusId || '',
        presentAddress: teacher?.presentAddress || {},
        permanentAddress: teacher?.permanentAddress || {},
        sameAsPresent: teacher?.sameAsPresent || false,
        educationalQualifications: teacher?.educationalQualifications || [
          {
            degreeName: '',
            institution: '',
            year: '',
            grade: '',
            documentUrl: '',
          },
        ],
        professionalExperience: teacher?.professionalExperience || [],
        references: teacher?.references || [],
        salaryExpectation: teacher?.salaryExpectation || 0,
        joiningDate: teacher?.joiningDate || '',
        digitalSignatureUrl: teacher?.digitalSignatureUrl || '',
        yearsOfExperience: teacher?.yearsOfExperience || 0,
        noticePeriod: teacher?.noticePeriod || '',
        designationIds: teacher?.designationIds || [],
        subjectIds: teacher?.subjectIds || [],
        gradeLevelIds: teacher?.gradeLevelIds || [],
        languageProficiencyIds: teacher?.languageProficiencyIds || [],
        computerSkills: teacher?.computerSkills || '',
        teachingMethodology: teacher?.teachingMethodology || '',
        onlineProfiles: teacher?.onlineProfiles || {
          linkedin: '',
          personalWebsite: '',
        },
        details: teacher?.details || '',
        status: teacher?.status || 'ACTIVE',
      };
      reset(defaultValues);
      setPhotoPreview(teacher?.photoUrl || null);
      setActiveTab(0);
    }
  }, [open, teacher, reset]);

  // Update permanent address when "same as present" is checked
  useEffect(() => {
    if (sameAsPresent && presentAddress) {
      setValue('permanentAddress', presentAddress);
    }
  }, [sameAsPresent, presentAddress, setValue]);

  /**
   * Handle tab change
   */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  /**
   * Handle photo upload
   */
  const handlePhotoUpload = async (files: File[]) => {
    const file = files[0];
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
  const onSubmit = async (data: TeacherFormData) => {
    try {
      if (isEdit && teacher) {
        await dispatch(updateTeacher({ id: teacher.id, data: data as UpdateTeacherDto })).unwrap();
        showToast(`Teacher ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createTeacher(data as CreateTeacherDto)).unwrap();
        showToast(`Teacher ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }
      handleClose();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} teacher`, 'error');
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    reset();
    setPhotoPreview(null);
    setActiveTab(0);
    onClose();
  };

  /**
   * Generate tab props for accessibility
   */
  const a11yProps = (index: number) => {
    return {
      id: `teacher-tab-${index}`,
      'aria-controls': `teacher-tabpanel-${index}`,
    };
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth disableRestoreFocus>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {isEdit ? 'Edit Teacher' : 'Add Teacher'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Info" {...a11yProps(0)} />
            <Tab label="Address" {...a11yProps(1)} />
            <Tab label="Education" {...a11yProps(2)} />
            <Tab label="Experience" {...a11yProps(3)} />
            <Tab label="References" {...a11yProps(4)} />
            <Tab label="Employment" {...a11yProps(5)} />
            <Tab label="Skills" {...a11yProps(6)} />
          </Tabs>
        </Box>

        <DialogContent dividers sx={{ height: '70vh', overflow: 'auto' }}>
          {/* Personal Information Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* Photo Upload */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Photo" required={false}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={photoPreview || undefined}
                      sx={{ width: 80, height: 80 }}
                    >
                      <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
   
                      <Controller
                        name="photoUrl"
                        control={control}
                        render={({ field }) => (
                          <FileUpload
                            
                            value={field.value ? [field.value] : []}


                            onChange={(files) => {
                              field.onChange(files[0] || ''); 
                              setPhotoPreview(files[0] || null);
                            }}
                            accept="image/*"
                            maxSize={5 * 1024 * 1024}
                            maxFiles={1} // নিশ্চিত করুন যে এটি শুধুমাত্র একটি ফাইল গ্রহণ করে
                            label="Upload Photo" // আরও ভালো UX-এর জন্য একটি লেবেল যোগ করুন
                          // disabled={photoUploading} // photoUploading state এখন FileUpload এর internal state এ থাকবে।
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </FormSection>
              </Grid>

              {/* Basic Information */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Basic Information" required>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="First Name *"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            autoFocus
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Last Name *"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Date of Birth *"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="placeOfBirth"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Place of Birth"
                            error={!!errors.placeOfBirth}
                            helperText={errors.placeOfBirth?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="fatherName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Father's Name"
                            error={!!errors.fatherName}
                            helperText={errors.fatherName?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="motherName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Mother's Name"
                            error={!!errors.motherName}
                            helperText={errors.motherName?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>

              {/* Contact Information */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Contact Information" required>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="mobileNumber"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            {...field}
                            label="Mobile Number *"
                            error={!!errors.mobileNumber}
                            helperText={errors.mobileNumber?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="emailAddress"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email Address *"
                            type="email"
                            error={!!errors.emailAddress}
                            helperText={errors.emailAddress?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="emergencyContact"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            {...field}
                            label="Emergency Contact"
                            error={!!errors.emergencyContact}
                            helperText={errors.emergencyContact?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="nidNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="National ID"
                            error={!!errors.nidNumber}
                            helperText={errors.nidNumber?.message}
                          />
                        )}
                      />
                    </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="birthRegNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="National ID"
                            error={!!errors.birthRegNumber}
                            helperText={errors.birthRegNumber?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>

              {/* Demographics */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Demographics" required>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="genderId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.genderId}>
                            <InputLabel>Gender *</InputLabel>
                            <Select {...field} label="Gender *">
                              <MenuItem value="">Select Gender</MenuItem>
                              {genders.map((gender) => (
                                <MenuItem key={gender.id} value={gender.id}>
                                  {gender.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.genderId && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                {errors.genderId.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="bloodGroupId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.bloodGroupId}>
                            <InputLabel>Blood Group</InputLabel>
                            <Select {...field} label="Blood Group">
                              <MenuItem value="">Select Blood Group</MenuItem>
                              {bloodGroups.map((bloodGroup) => (
                                <MenuItem key={bloodGroup.id} value={bloodGroup.id}>
                                  {bloodGroup.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.bloodGroupId && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                {errors.bloodGroupId.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="maritalStatusId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.maritalStatusId}>
                            <InputLabel>Marital Status</InputLabel>
                            <Select {...field} label="Marital Status">
                              <MenuItem value="">Select Marital Status</MenuItem>
                              {maritalStatuses.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                  {status.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.maritalStatusId && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                {errors.maritalStatusId.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="nationalityId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.nationalityId}>
                            <InputLabel>Nationality</InputLabel>
                            <Select {...field} label="Nationality">
                              <MenuItem value="">Select Nationality</MenuItem>
                              {nationalities.map((nationality) => (
                                <MenuItem key={nationality.id} value={nationality.id}>
                                  {nationality.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.status}>
                            <InputLabel>Status *</InputLabel>
                            <Select {...field} label="Status *">
                              <MenuItem value="ACTIVE">Active</MenuItem>
                              <MenuItem value="INACTIVE">Inactive</MenuItem>
                              <MenuItem value="PENDING">Pending</MenuItem>
                              <MenuItem value="ARCHIVE">Archive</MenuItem>
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
                  </Grid>
                </FormSection>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Address Information Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {/* Present Address */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Present Address">
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
                </FormSection>
              </Grid>

              {/* Permanent Address */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Permanent Address">
                  <Box sx={{ mb: 2 }}>
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
                          label="Same as Present Address"
                        />
                      )}
                    />
                  </Box>

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
                </FormSection>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Educational Qualifications Tab */}
          <TabPanel value={activeTab} index={2}>
            <FormSection title="Educational Qualifications" required>
              <DynamicFieldArray
                title="Add Qualification"
                fields={qualificationFields}
                onAdd={() => appendQualification({
                  degreeName: '',
                  institution: '',
                  year: '',
                  grade: '',
                  documentUrl: '',
                })}
                onRemove={removeQualification}
                renderField={(field, index) => (
                  <Grid container spacing={2} key={field.id}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`educationalQualifications.${index}.degreeName`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Degree Name *"
                            error={!!(errors.educationalQualifications?.[index]?.degreeName)}
                            helperText={errors.educationalQualifications?.[index]?.degreeName?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`educationalQualifications.${index}.institution`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Institution *"
                            error={!!(errors.educationalQualifications?.[index]?.institution)}
                            helperText={errors.educationalQualifications?.[index]?.institution?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`educationalQualifications.${index}.year`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Year *"
                            error={!!(errors.educationalQualifications?.[index]?.year)}
                            helperText={errors.educationalQualifications?.[index]?.year?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`educationalQualifications.${index}.grade`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Grade *"
                            error={!!(errors.educationalQualifications?.[index]?.grade)}
                            helperText={errors.educationalQualifications?.[index]?.grade?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>

                      <Controller
                        name={`educationalQualifications.${index}.documentUrl`}
                        control={control}
                        render={({ field }) => (
                          <FileUpload
                            value={field.value ? [field.value] : []}
                            onChange={(files) => {
                              // FileUpload কম্পোনেন্ট নিজেই File কে Data URL-এ রূপান্তর করে।
                              // তাই এখানে `files[0]` সরাসরি Data URL হবে।
                              field.onChange(files[0] || '');
                            }}
                            accept=".pdf,.doc,.docx,image/*" // প্রয়োজনে ছবিও আপলোড করার অনুমতি দিন
                            maxSize={10 * 1024 * 1024}
                            maxFiles={1}
                            label="Upload Certificate"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}

                minItems={1}
                maxItems={10}
              />
            </FormSection>
          </TabPanel>

          {/* Professional Experience Tab */}
          <TabPanel value={activeTab} index={3}>
            <FormSection title="Professional Experience">
              <DynamicFieldArray
                title="Add Experience"
                fields={experienceFields}
                onAdd={() => appendExperience({
                  companyName: '',
                  jobTitle: '',
                  startDate: '',
                  endDate: '',
                  responsibilities: '',
                  achievements: '',
                })}
                onRemove={removeExperience}
                renderField={(field, index) => (
                  <Grid container spacing={2} key={field.id}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`professionalExperience.${index}.companyName`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Company Name *"
                            error={!!(errors.professionalExperience?.[index]?.companyName)}
                            helperText={errors.professionalExperience?.[index]?.companyName?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`professionalExperience.${index}.jobTitle`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Job Title *"
                            error={!!(errors.professionalExperience?.[index]?.jobTitle)}
                            helperText={errors.professionalExperience?.[index]?.jobTitle?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`professionalExperience.${index}.startDate`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Start Date *"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={!!(errors.professionalExperience?.[index]?.startDate)}
                            helperText={errors.professionalExperience?.[index]?.startDate?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`professionalExperience.${index}.endDate`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={!!(errors.professionalExperience?.[index]?.endDate)}
                            helperText={errors.professionalExperience?.[index]?.endDate?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`professionalExperience.${index}.responsibilities`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Responsibilities *"
                            multiline
                            rows={3}
                            error={!!(errors.professionalExperience?.[index]?.responsibilities)}
                            helperText={errors.professionalExperience?.[index]?.responsibilities?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`professionalExperience.${index}.achievements`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Achievements"
                            multiline
                            rows={2}
                            error={!!(errors.professionalExperience?.[index]?.achievements)}
                            helperText={errors.professionalExperience?.[index]?.achievements?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}

                minItems={0}
                maxItems={10}
              />
            </FormSection>
          </TabPanel>

          {/* References Tab */}
          <TabPanel value={activeTab} index={4}>
            <FormSection title="References & Testimonials">
              <DynamicFieldArray
                title="Add Reference"
                fields={referenceFields}
                onAdd={() => appendReference({
                  name: '',
                  relationship: '',
                  contactNumber: '',
                  email: '',
                  recommendationLetterUrl: '',
                })}
                onRemove={removeReference}
                renderField={(field, index) => (
                  <Grid container spacing={2} key={field.id}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`references.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Name *"
                            error={!!(errors.references?.[index]?.name)}
                            helperText={errors.references?.[index]?.name?.message}
                          />
                        )}
                      />
                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`references.${index}.contactNumber`}
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            {...field}
                            label="Contact Number *"
                            error={!!(errors.references?.[index]?.contactNumber)}
                            helperText={errors.references?.[index]?.contactNumber?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`references.${index}.email`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email"
                            type="email"
                            error={!!(errors.references?.[index]?.email)}
                            helperText={errors.references?.[index]?.email?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`references.${index}.recommendationLetterUrl`}
                        control={control}
                        render={({ field }) => (
                          <FileUpload
                            value={field.value ? [field.value] : []}
                            onChange={(files) => {
                              field.onChange(files[0] || '');
                            }}
                            accept=".pdf,.doc,.docx,image/*" // প্রয়োজনে ছবিও আপলোড করার অনুমতি দিন
                            maxSize={10 * 1024 * 1024}
                            maxFiles={1}
                            label="Upload Recommendation Letter"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}

                minItems={0}
                maxItems={5}
              />
            </FormSection>
          </TabPanel>

          {/* Employment Details Tab */}
          <TabPanel value={activeTab} index={5}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormSection title="Employment Details">
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="salaryExpectation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Salary Expectation"
                            type="number"
                            error={!!errors.salaryExpectation}
                            helperText={errors.salaryExpectation?.message}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="joiningDate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Joining Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.joiningDate}
                            helperText={errors.joiningDate?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="yearsOfExperience"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Years of Experience"
                            type="number"
                            error={!!errors.yearsOfExperience}
                            helperText={errors.yearsOfExperience?.message}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="noticePeriod"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Notice Period"
                            error={!!errors.noticePeriod}
                            helperText={errors.noticePeriod?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      {/* <Controller
                        name="digitalSignatureUrl"
                        control={control}
                        render={({ field }) => (
                          <FileUpload
                            onUpload={(files) => {
                              if (files[0]) {
                                field.onChange(`/mock/signatures/${files[0].name}`);
                              }
                            }}
                            accept="image/*"
                            maxSize={5 * 1024 * 1024}
                            multiple={false}
                            label="Upload Digital Signature"
                          />
                        )}
                      /> */}
                      <Controller
                        name="digitalSignatureUrl"
                        control={control}
                        render={({ field }) => (
                          <FileUpload
                            value={field.value ? [field.value] : []}
                            onChange={(files) => {
                              field.onChange(files[0] || '');
                            }}
                            accept="image/*"
                            maxSize={5 * 1024 * 1024}
                            maxFiles={1}
                            label="Upload Digital Signature"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>

              {/* Teaching Specialization */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Teaching Specialization" required>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="subjectIds"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectChips
                            {...field}
                            label="Subjects *"
                            options={subjects.map(s => ({ value: s.id, label: s.name }))}
                            error={!!errors.subjectIds}
                            helperText={errors.subjectIds?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="gradeLevelIds"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectChips
                            {...field}
                            label="Grade Levels *"
                            options={subjects.map(s => ({ value: s.id, label: s.name }))}
                            error={!!errors.gradeLevelIds}
                            helperText={errors.gradeLevelIds?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="languageProficiencyIds"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectChips
                            {...field}
                            label="Language Proficiencies"
                            options={subjects.map(s => ({ value: s.id, label: s.name }))}
                            error={!!errors.languageProficiencyIds}
                            helperText={errors.languageProficiencyIds?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Skills & Competencies Tab */}
          <TabPanel value={activeTab} index={6}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormSection title="Skills & Competencies">
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="computerSkills"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Computer Skills"
                            multiline
                            rows={3}
                            error={!!errors.computerSkills}
                            helperText={errors.computerSkills?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="teachingMethodology"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Teaching Methodology"
                            multiline
                            rows={3}
                            error={!!errors.teachingMethodology}
                            helperText={errors.teachingMethodology?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="onlineProfiles.linkedin"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="LinkedIn Profile"
                            error={!!(errors.onlineProfiles as any)?.linkedin}
                            helperText={(errors.onlineProfiles as any)?.linkedin?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="onlineProfiles.personalWebsite"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Personal Website"
                            error={!!(errors.onlineProfiles as any)?.personalWebsite}
                            helperText={(errors.onlineProfiles as any)?.personalWebsite?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="details"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Additional Details"
                            multiline
                            rows={4}
                            error={!!errors.details}
                            helperText={errors.details?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading || isSubmitting}>
            {t(`${tPath.common.cancel}`)}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || isSubmitting || photoUploading}
            sx={{ minWidth: 100 }}
          >
            {loading || isSubmitting ? t('common.loading') : isEdit ? t(`${tPath.common.save}`) : t('common.add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

TeacherFormModal.displayName = 'TeacherFormModal';

export { TeacherFormModal };