// features/education/teachers/components/RegisterForm.tsx
import React, { useState, useEffect, memo } from 'react';
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
  Alert,
} from '@mui/material';
import { Save, Clear } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';

import { FormSection } from '~/shared/components/ui/FormSection';
import { FileUpload } from '~/shared/components/ui/FileUpload';
import { PhoneInput } from '~/shared/components/ui/PhoneInput';
import { DynamicFieldArray } from '~/shared/components/ui/DynamicFieldArray';
import { MultiSelectChips } from '~/shared/components/ui/MultiSelectChips';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';

import {
  selectRelations,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';
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
  fetchAssignableTeacherPersons,
  selectAssignableTeacherPersons,
  selectAssignableTeacherPersonsLoading,
} from '~/features/education/teachers/store/teacherSlice';

import { teacherSchema, type TeacherFormData } from '~/features/education/teachers/schemas/teacherSchema';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { STATUSES, STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

/** Simple TabPanel */
interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index} id={`teacher-tabpanel-${index}`} aria-labelledby={`teacher-tab-${index}`} {...other}>
    {value === index && children}
  </div>
);

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const TeacherRegisterForm = memo(({ onSuccess, onError }: RegisterFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  // master data
  const relations = useAppSelector(selectRelations);
  const subjects = useAppSelector(selectSubjects);
  const gradeLevels = useAppSelector(selectGradeLevels);
  const languageProficiencies = useAppSelector(selectLanguageProficiencies);

  // teacher slice states
  const loading = useAppSelector(selectTeacherLoading); // Form submission loading
  const error = useAppSelector(selectTeacherError);

  // assignable STAFF persons for dropdown
  const assignablePersons = useAppSelector(selectAssignableTeacherPersons);
  const assignableLoading = useAppSelector(selectAssignableTeacherPersonsLoading); // Data fetching loading

  const [activeTab, setActiveTab] = useState(0);

  // form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      personTeacherId: '',
      educationalQualifications: [
        { degreeName: '', institution: '', year: '', grade: '', documentUrl: '' },
      ],
      professionalExperience: [],
      references: [],
      salaryExpectation: undefined,
      joiningDate: '',
      digitalSignatureUrl: '',
      yearsOfExperience: undefined,
      noticePeriod: '',
      subjectIds: [],
      gradeLevelIds: [],
      languageProficiencyIds: [],
      computerSkills: '',
      teachingMethodology: '',
      onlineProfiles: { linkedin: '', personalWebsite: '' },
      details: '',
      status: STATUSES_OBJECT.INACTIVE,
    },
  });

  // field arrays
  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({ control, name: 'educationalQualifications' });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'professionalExperience' });

  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
  } = useFieldArray({ control, name: 'references' });

  // load master lists
  useEffect(() => {
    dispatch(fetchAllSimpleEntities());     // relations সহ core simple entities
    dispatch(fetchAllAcademicEntities());   // subjects, gradeLevels, languageProficiencies
    dispatch(fetchAssignableTeacherPersons({ page: 1, limit: 1000 })); // STAFF persons not yet assigned as teacher
  }, [dispatch]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);

  const onSubmit = async (data: TeacherFormData) => {
    try {
      await dispatch(createTeacher(data)).unwrap();
      showToast(`Teacher ${SUCCESS_MESSAGES.CREATED}`, 'success');
      navigate('/admin/education/teachers/manage');
      onSuccess?.();
    } catch (e: any) {
      const errorMessage = e?.message || 'Failed to create teacher';
      showToast(errorMessage, 'error');
      onError?.(errorMessage);
    }
  };

  const handleReset = () => {
    reset();
    setActiveTab(0);
  };

  // Pre-requisite data loading for the form
  if (assignableLoading) {
    return <LoadingSpinner message="Loading assignable persons..." />;
  }

  return (
    <Box>
      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
            <Tab label="Assign Person & Status" />
            <Tab label="Educational Qualifications" />
            <Tab label="Professional Experience" />
            <Tab label="References" />
            <Tab label="Employment & Skills" />
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tab 0: Assign Person & Status */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid size={{xs: 12, md: 6}}> 
                  <FormSection title="Assign Staff Person" required>
                    <Controller
                      name="personTeacherId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.personTeacherId}>
                          <InputLabel>Teacher Person *</InputLabel>
                          <Select
                            {...field}
                            label="Teacher Person *"
                            disabled={assignableLoading}
                            renderValue={(val) => {
                              const p = assignablePersons.find(x => x.id === val);
                              return p ? `${p.firstName} ${p.lastName}`.trim() : '';
                            }}
                          >
                            <MenuItem value="">
                              {assignableLoading ? 'Loading...' : 'Select a staff person'}
                            </MenuItem>
                            {assignablePersons.map(p => (
                              <MenuItem key={p.id} value={p.id}>
                                {`${p.firstName} ${p.lastName}`.trim()}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.personTeacherId && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                              {errors.personTeacherId.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </FormSection>
                </Grid>

                <Grid size={{xs: 12, md: 6}}>
                  <FormSection title="Status" required>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.status}>
                          <InputLabel>Status *</InputLabel>
                          <Select {...field} label="Status *">
                            { Object.keys(STATUSES_OBJECT).map(( item, key ) => (
                              <MenuItem key={item} value={ STATUSES[key] }>{item}</MenuItem>
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
                  </FormSection>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Tab 1: Educational Qualifications */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 4 }}>
              <FormSection title="Educational Qualifications" required>
                <DynamicFieldArray
                  title="Qualification"
                  fields={qualificationFields}
                  onAdd={() =>
                    appendQualification({
                      degreeName: '',
                      institution: '',
                      year: '',
                      grade: '',
                      documentUrl: '',
                    })
                  }
                  onRemove={removeQualification}
                  minItems={1}
                  maxItems={10}
                  renderField={(field, index) => (
                    <Grid container spacing={3} key={field.id}>
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12}}>
                        <Controller
                          name={`educationalQualifications.${index}.documentUrl`}
                          control={control}
                          render={({ field }) => (
                            <FileUpload
                              value={field.value ? [field.value] : []}
                              onChange={(files) => field.onChange(files[0] || '')}
                              accept="application/pdf,image/*"
                              maxFiles={1}
                              maxSize={5 * 1024 * 1024}
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

          {/* Tab 2: Professional Experience */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ p: 4 }}>
              <FormSection title="Professional Experience">
                <DynamicFieldArray
                  title="Experience"
                  fields={experienceFields}
                  onAdd={() =>
                    appendExperience({
                      companyName: '',
                      jobTitle: '',
                      startDate: '',
                      endDate: '',
                      responsibilities: '',
                      achievements: '',
                    })
                  }
                  onRemove={removeExperience}
                  minItems={0}
                  maxItems={10}
                  renderField={(field, index) => (
                    <Grid container spacing={3} key={field.id}>
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12}}>
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
                      <Grid size={{xs: 12}}>
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

          {/* Tab 3: References */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ p: 4 }}>
              <FormSection title="References & Testimonials">
                <DynamicFieldArray
                  title="Reference"
                  fields={referenceFields}
                  onAdd={() =>
                    appendReference({
                      name: '',
                      relationship: '',
                      contactNumber: '',
                      email: '',
                      recommendationLetterUrl: '',
                    })
                  }
                  onRemove={removeReference}
                  minItems={0}
                  maxItems={5}
                  renderField={(field, index) => (
                    <Grid container spacing={3} key={field.id}>
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
                        <Controller
                          name={`references.${index}.relationship`}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.references?.[index]?.relationship}>
                              <InputLabel>Relationship *</InputLabel>
                              <Select {...field} label="Relationship *">
                                <MenuItem value="">Select Relation</MenuItem>
                                {relations.map(rel => (
                                  <MenuItem key={rel.id} value={rel.name}>
                                    {rel.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12}}>
                        <Controller
                          name={`references.${index}.recommendationLetterUrl`}
                          control={control}
                          render={({ field }) => (
                            <FileUpload
                              value={field.value ? [field.value] : []}
                              onChange={(files) => field.onChange(files[0] || '')}
                              accept="application/pdf,image/*"
                              maxFiles={1}
                              maxSize={5 * 1024 * 1024}
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

          {/* Tab 4: Employment & Skills */}
          <TabPanel value={activeTab} index={4}>
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Employment */}
                <Grid size={{xs: 12}}>
                  <FormSection title="Employment Details">
                    <Grid container spacing={3}>
                      <Grid size={{xs: 12, md: 6}}>
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
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                field.onChange(v === '' ? undefined : Number(v));
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                                const v = e.target.value;
                                field.onChange(v === '' ? undefined : Number(v));
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12}}>
                        <Controller
                          name="digitalSignatureUrl"
                          control={control}
                          render={({ field }) => (
                            <FileUpload
                              value={field.value ? [field.value] : []}
                              onChange={(files) => field.onChange(files[0] || '')}
                              accept="image/*"
                              maxFiles={1}
                              maxSize={2 * 1024 * 1024}
                              label="Upload Digital Signature"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </FormSection>
                </Grid>

                {/* Teaching Specialization */}
                <Grid size={{xs: 12}}>
                  <FormSection title="Teaching Specialization" required>
                    <Grid container spacing={3}>
                      <Grid size={{xs: 12}}>
                        <Controller
                          name="subjectIds"
                          control={control}
                          render={({ field }) => (
                            <MultiSelectChips
                              {...field}
                              value={field.value || []}
                              label="Subjects to Teach *"
                              options={subjects.map(s => ({ value: s.id, label: s.name }))}
                              error={!!errors.subjectIds}
                              helperText={errors.subjectIds?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{xs: 12}}>
                        <Controller
                          name="gradeLevelIds"
                          control={control}
                          render={({ field }) => (
                            <MultiSelectChips
                              {...field}
                              value={field.value || []}
                              label="Preferred Grade Levels *"
                              options={gradeLevels.map(g => ({ value: g.id, label: g.name }))}
                              error={!!errors.gradeLevelIds}
                              helperText={errors.gradeLevelIds?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{xs: 12}}>
                        <Controller
                          name="languageProficiencyIds"
                          control={control}
                          render={({ field }) => (
                            <MultiSelectChips
                              {...field}
                              value={field.value || []}
                              label="Language Proficiencies"
                              options={languageProficiencies.map(l => ({ value: l.id, label: l.name }))}
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
                <Grid size={{xs: 12}}>
                  <FormSection title="Skills & Competencies">
                    <Grid container spacing={3}>
                      <Grid size={{xs: 12}}>
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
                      <Grid size={{xs: 12}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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
                      <Grid size={{xs: 12, md: 6}}>
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

          {/* Actions */}
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

TeacherRegisterForm.displayName = 'TeacherRegisterForm';
export { TeacherRegisterForm };