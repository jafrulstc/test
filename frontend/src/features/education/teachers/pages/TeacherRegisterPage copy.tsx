




import React, { useState, useEffect, memo, useRef } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  OutlinedInput,
  ListItemText,
  Chip,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  Person,
  CloudUpload,
  Save,
  Clear,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { AddressFields } from '~/features/core/components/general/AddressFields';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { FormSection } from '~/shared/components/ui/FormSection';
import { FileUpload } from '~/shared/components/ui/FileUpload';
import { PhoneInput } from '~/shared/components/ui/PhoneInput';
import { DynamicFieldArray } from '~/shared/components/ui/DynamicFieldArray';
import { MultiSelectChips } from '~/shared/components/ui/MultiSelectChips';
import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
  selectRelations,
  selectMaritalStatuses,
  selectDesignations, // Import selectDesignations
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';
import {
  selectNationalities,
  fetchAllGeographyData,
} from '~/features/core/store/geographySlice';
import {
  selectSubjects,
  selectGradeLevels,
  selectLanguageProficiencies,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';
import {
  createTeacher,
  selectTeacherLoading,
  selectTeacherError,
} from '~/features/education/teachers/store/teacherSlice';
import { teacherSchema, type TeacherFormData } from '../schemas/teacherSchema';
import { uploadPhoto, validatePhotoFile } from '~/shared/utils/photoUpload';
import { SUCCESS_MESSAGES } from '~/app/constants';

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
 * Teacher Registration Form Component
 */
const TeacherRegisterPage = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Redux selectors
  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const religions = useAppSelector(selectReligions);
  const relations = useAppSelector(selectRelations);
  const maritalStatuses = useAppSelector(selectMaritalStatuses);
  const designations = useAppSelector(selectDesignations); // Use selectDesignations
  const nationalities = useAppSelector(selectNationalities);
  const subjects = useAppSelector(selectSubjects);
  const gradeLevels = useAppSelector(selectGradeLevels);
  const languageProficiencies = useAppSelector(selectLanguageProficiencies);
  const loading = useAppSelector(selectTeacherLoading);
  const error = useAppSelector(selectTeacherError);

  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Form setup
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
      nationalId: '',
      photoUrl: '',
      genderId: '',
      bloodGroupId: '',
      nationalityId: '',
      maritalStatusId: '',
      relationId: '',
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
      salaryExpectation: undefined,
      joiningDate: '',
      digitalSignatureUrl: '',
      yearsOfExperience: undefined,
      noticePeriod: '',
      designationIds: [], // Ensure default value matches type (string or undefined)
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
      status: 'Pending',
    },
  });

  // Field arrays
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

  // Watch form values
  const sameAsPresent = watch('sameAsPresent');
  const presentAddress = watch('presentAddress');

  // Fetch master data on component mount
  useEffect(() => {
    dispatch(fetchAllSimpleEntities());
    dispatch(fetchAllGeographyData());
    dispatch(fetchAllAcademicEntities());
  }, [dispatch]);

  // Update permanent address when "same as present" is checked
  useEffect(() => {
    console.log( "dsignation is : ", designations)
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
  const onSubmit = async (data: TeacherFormData) => {
    try {
      await dispatch(createTeacher(data)).unwrap();
      showToast(`Teacher ${SUCCESS_MESSAGES.CREATED}`, 'success');
      navigate('/admin/education/teachers/manage');
    } catch (error: any) {
      showToast(error.message || 'Failed to create teacher', 'error');
    }
  };

  /**
   * Handle form reset
   */
  const handleReset = () => {
    reset();
    setPhotoPreview(null);
    setActiveTab(0);
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

  // if (loading && genders.length === 0) {
  //   return <LoadingSpinner message="Loading form data..." />;
  // }
  if (loading || genders.length === 0) {
    return <LoadingSpinner message="Loading form data..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Add Teacher
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Register a new teacher with comprehensive information
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form Container */}
      <Paper sx={{ width: '100%' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="teacher registration tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Information" {...a11yProps(0)} />
            <Tab label="Educational Qualifications" {...a11yProps(1)} />
            <Tab label="Professional Experience" {...a11yProps(2)} />
            <Tab label="References & Testimonials" {...a11yProps(3)} />
            <Tab label="Employment & Skills" {...a11yProps(4)} />
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tab 1: Personal Information */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Photo Upload */}
                <Grid size={{ xs: 12 }}>
                  <FormSection title="Profile Photo" collapsible={false}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar
                        src={photoPreview || undefined}
                        sx={{ width: 120, height: 120 }}
                      >
                        <Person sx={{ fontSize: 60 }} />
                      </Avatar>
                      <Box>
                        <Button
                          variant="outlined"
                          startIcon={<CloudUpload />}
                          onClick={() => photoInputRef.current?.click()}
                          disabled={photoUploading}
                        >
                          {photoUploading ? 'Uploading...' : 'Upload Photo'}
                        </Button>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                          Max 5MB. JPEG, PNG, GIF supported.
                        </Typography>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          style={{ display: 'none' }}
                        />
                      </Box>
                    </Box>
                  </FormSection>
                </Grid>

                {/* Basic Information */}
                <Grid size={{ xs: 12 }}>
                  <FormSection title="Basic Information" required>
                    <Grid container spacing={3}>
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
                    <Grid container spacing={3}>
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
                          name="nationalId"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="National ID / Birth Certificate"
                              error={!!errors.nationalId}
                              helperText={errors.nationalId?.message}
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
                    <Grid container spacing={3}>
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
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </FormSection>
                </Grid>

                {/* Address Information */}
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
                    {!sameAsPresent && (
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
                    {sameAsPresent && (
                      <Alert severity="info">
                        Permanent address will be same as present address
                      </Alert>
                    )}
                  </FormSection>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Tab 2: Educational Qualifications */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 4 }}>
              <FormSection title="Educational Qualifications" required>
                <DynamicFieldArray
                  title="Qualification"
                  fields={qualificationFields}
                  onAdd={() => appendQualification({
                    degreeName: '',
                    institution: '',
                    year: '',
                    grade: '',
                    documentUrl: '',
                  })}
                  onRemove={removeQualification}
                  minItems={1}
                  maxItems={10}
                  renderField={(field, index) => (
                    <Grid container spacing={3} key={field.id}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name={`educationalQualifications.${index}.degreeName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Degree/Certificate Name *"
                              error={!!errors.educationalQualifications?.[index]?.degreeName}
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
                              error={!!errors.educationalQualifications?.[index]?.institution}
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
                              placeholder="e.g., 2020"
                              error={!!errors.educationalQualifications?.[index]?.year}
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
                              label="Grade/Result *"
                              placeholder="e.g., First Class, 3.8 GPA"
                              error={!!errors.educationalQualifications?.[index]?.grade}
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
                              onChange={(files) => field.onChange(files[0] || '')}
                              accept="application/pdf,image/*"
                              maxFiles={1}
                              maxSize={5 * 1024 * 1024} // 5MB
                              label="Upload Certificate/Document"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                />
              </FormSection>
            </Box>
          </TabPanel>

          {/* Tab 3: Professional Experience */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ p: 4 }}>
              <FormSection title="Professional Experience">
                <DynamicFieldArray
                  title="Experience"
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
                  minItems={0}
                  maxItems={10}
                  renderField={(field, index) => (
                    <Grid container spacing={3} key={field.id}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name={`professionalExperience.${index}.companyName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Company/Organization *"
                              error={!!errors.professionalExperience?.[index]?.companyName}
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
                              error={!!errors.professionalExperience?.[index]?.jobTitle}
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
                              error={!!errors.professionalExperience?.[index]?.startDate}
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
                              error={!!errors.professionalExperience?.[index]?.endDate}
                              helperText={errors.professionalExperience?.[index]?.endDate?.message || 'Leave empty if currently working'}
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
                              error={!!errors.professionalExperience?.[index]?.responsibilities}
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
                              error={!!errors.professionalExperience?.[index]?.achievements}
                              helperText={errors.professionalExperience?.[index]?.achievements?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                />
              </FormSection>
            </Box>
          </TabPanel>

          {/* Tab 4: References & Testimonials */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ p: 4 }}>
              <FormSection title="References & Testimonials">
                <DynamicFieldArray
                  title="Reference"
                  fields={referenceFields}
                  onAdd={() => appendReference({
                    name: '',
                    relationship: '',
                    contactNumber: '',
                    email: '',
                    recommendationLetterUrl: '',
                  })}
                  onRemove={removeReference}
                  minItems={0}
                  maxItems={5}
                  renderField={(field, index) => (
                    <Grid container spacing={3} key={field.id}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name={`references.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Name *"
                              error={!!errors.references?.[index]?.name}
                              helperText={errors.references?.[index]?.name?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name={`references.${index}.relationship`}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.references?.[index]?.relationship}>
                              <InputLabel>Relationship *</InputLabel>
                              <Select {...field} label="Relationship *">
                                <MenuItem value="">Select Relation</MenuItem>
                                {relations.map((relation) => (
                                  <MenuItem key={relation.id} value={relation.name}> {/* Use relation.name for display and value */}
                                    {relation.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.references?.[index]?.relationship && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                  {errors.references?.[index]?.relationship?.message}
                                </Typography>
                              )}
                            </FormControl>
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
                              error={!!errors.references?.[index]?.contactNumber}
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
                              error={!!errors.references?.[index]?.email}
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
                              onChange={(files) => field.onChange(files[0] || '')}
                              accept="application/pdf,image/*"
                              maxFiles={1}
                              maxSize={5 * 1024 * 1024} // 5MB
                              label="Upload Recommendation Letter"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                />
              </FormSection>
            </Box>
          </TabPanel>

          {/* Tab 5: Employment & Skills */}
          <TabPanel value={activeTab} index={4}>
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Employment Details */}
                <Grid size={{ xs: 12 }}>
                  <FormSection title="Employment Details">
                    <Grid container spacing={3}>
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
                              InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>৳</Typography>,
                              }}
                              error={!!errors.salaryExpectation}
                              helperText={errors.salaryExpectation?.message}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? undefined : Number(value));
                              }}
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
                              label="Preferred Joining Date"
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
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? undefined : Number(value));
                              }}
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
                              placeholder="e.g., 1 month, 2 weeks"
                              error={!!errors.noticePeriod}
                              helperText={errors.noticePeriod?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="designationIds"
                          control={control}
                          render={({ field }) => (
                            <MultiSelectChips
                              {...field}
                              value={field.value || []} // Provide default empty array if value is undefined
                              label="Designations"
                              options={designations.map(designation => ({
                                value: designation.id,
                                label: designation.name,
                              }))}
                              error={!!errors.designationIds}
                              helperText={errors.designationIds?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="digitalSignatureUrl"
                          control={control}
                          render={({ field }) => (
                            <FileUpload
                              value={field.value ? [field.value] : []}
                              onChange={(files) => field.onChange(files[0] || '')}
                              accept="image/*"
                              maxFiles={1}
                              maxSize={2 * 1024 * 1024} // 2MB
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
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="subjectIds"
                          control={control}
                          render={({ field }) => (
                            <MultiSelectChips
                              {...field}
                              label="Subjects to Teach *"
                              options={subjects.map(subject => ({
                                value: subject.id,
                                label: subject.name,
                              }))}
                              error={!!errors.subjectIds}
                              helperText={errors.subjectIds?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="gradeLevelIds"
                          control={control}
                          render={({ field }) => (
                            <MultiSelectChips
                              {...field}
                              label="Preferred Grade Levels *"
                              options={gradeLevels.map(level => ({
                                value: level.id,
                                label: level.name,
                              }))}
                              error={!!errors.gradeLevelIds}
                              helperText={errors.gradeLevelIds?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="languageProficiencyIds"
                          control={control}
                          render={({ field }) => (
                            <MultiSelectChips
                              {...field}
                              label="Language Proficiencies"
                              options={languageProficiencies.map(lang => ({
                                value: lang.id,
                                label: lang.name,
                              }))}
                              error={!!errors.languageProficiencyIds}
                              helperText={errors.languageProficiencyIds?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </FormSection>
                </Grid>

                {/* Skills & Competencies */}
                <Grid size={{ xs: 12 }}>
                  <FormSection title="Skills & Competencies">
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="computerSkills"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Computer/ICT Skills"
                              multiline
                              rows={3}
                              placeholder="e.g., Microsoft Office, Google Workspace, Educational Software"
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
                              label="Teaching Methodology Training"
                              multiline
                              rows={3}
                              placeholder="e.g., Interactive learning, Problem-based learning, Technology integration"
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
                              placeholder="https://linkedin.com/in/username"
                              error={!!errors.onlineProfiles?.linkedin}
                              helperText={errors.onlineProfiles?.linkedin?.message}
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
                              placeholder="https://yourwebsite.com"
                              error={!!errors.onlineProfiles?.personalWebsite}
                              helperText={errors.onlineProfiles?.personalWebsite?.message}
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
                              placeholder="Any additional information about the teacher..."
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
            </Box>
          </TabPanel>

          {/* Form Actions */}
          <Box sx={{ p: 4, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleReset}
                disabled={loading || isSubmitting}
              >
                Reset Form
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeTab > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => setActiveTab(activeTab - 1)}
                    disabled={loading || isSubmitting}
                  >
                    Previous
                  </Button>
                )}

                {activeTab < 4 ? (
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(activeTab + 1)}
                    disabled={loading || isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading || isSubmitting}
                    sx={{ minWidth: 120 }}
                  >
                    {loading || isSubmitting ? 'Saving...' : 'Save Teacher'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
});

TeacherRegisterPage.displayName = 'TeacherManagementPage';

export { TeacherRegisterPage };