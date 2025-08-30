import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';

import { FormSection } from '~/shared/components/ui/FormSection';
import { FileUpload } from '~/shared/components/ui/FileUpload';
import { PhoneInput } from '~/shared/components/ui/PhoneInput';
import { DynamicFieldArray } from '~/shared/components/ui/DynamicFieldArray';
import { MultiSelectChips } from '~/shared/components/ui/MultiSelectChips';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';

import { selectRelations, fetchAllSimpleEntities } from '~/features/core/store/generalSlice';
import {
  selectSubjects,
  selectGradeLevels,
  selectLanguageProficiencies,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';

import {
  createTeacher,
  updateTeacher,
  fetchAssignableTeacherPersons,
  selectAssignableTeacherPersons,
  selectAssignableTeacherPersonsLoading,
  selectTeacherLoading,
} from '~/features/education/teachers/store/teacherSlice';

import { teacherSchema, type TeacherFormData } from '~/features/education/teachers/schemas/teacherSchema';
import type { TeacherDetail } from '~/features/education/teachers/types/teacherType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { STATUSES, STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { getChangedFields } from '~/shared/utils/getChangedFields';

/** ---------- utils ---------- */
interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index} id={`teacher-form-tabpanel-${index}`} aria-labelledby={`teacher-form-tab-${index}`} {...other}>
    {value === index && children}
  </div>
);

interface TeacherFormModalProps {
  open: boolean;
  onClose: () => void;
  /** null/undefined = create, otherwise edit */
  teacher?: TeacherDetail | null;
}

/** ---------- defaults (RegisterForm-এর সাথে মিল রেখে) ---------- */
const DEFAULTS: TeacherFormData = {
  personTeacherId: '',
  educationalQualifications: [{ degreeName: '', institution: '', year: '', grade: '', documentUrl: '' }],
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
};

const TeacherFormModal = memo(({ open, onClose, teacher }: TeacherFormModalProps) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  // master data
  const relations = useAppSelector(selectRelations);
  const subjects = useAppSelector(selectSubjects);
  const gradeLevels = useAppSelector(selectGradeLevels);
  const languageProficiencies = useAppSelector(selectLanguageProficiencies);

  // assignable persons for dropdown
  const assignablePersons = useAppSelector(selectAssignableTeacherPersons);
  const assignableLoading = useAppSelector(selectAssignableTeacherPersonsLoading);

  // slice loading (submission)
  const loading = useAppSelector(selectTeacherLoading);

  const [activeTab, setActiveTab] = useState(0);

  // form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: DEFAULTS,
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

  // load masters
  useEffect(() => {
    if (!open) return;
    dispatch(fetchAllSimpleEntities());
    dispatch(fetchAllAcademicEntities());
  }, [dispatch, open]);

  // fetch assignable persons; include current person on edit
  const includePersonId = teacher?.person?.id;
  useEffect(() => {
    if (!open) return;
    dispatch(fetchAssignableTeacherPersons({ page: 1, limit: 1000, includePersonId }));
  }, [dispatch, open, includePersonId]);

  // map TeacherDetail -> TeacherFormData (for edit)
  useEffect(() => {
    if (!open) return;

    if (teacher) {
      const mapped: TeacherFormData = {
        personTeacherId: teacher.person?.id ?? '',
        educationalQualifications:
          teacher.educationalQualifications?.map(eq => ({
            degreeName: eq.degreeName ?? '',
            institution: eq.institution ?? '',
            year: (eq.year as any) ?? '',
            grade: eq.grade ?? '',
            documentUrl: (eq as any).documentUrl ?? '',
          })) || DEFAULTS.educationalQualifications,
        professionalExperience:
          teacher.professionalExperience?.map(pe => ({
            companyName: pe.companyName ?? '',
            jobTitle: pe.jobTitle ?? '',
            startDate: (pe.startDate as any) ?? '',
            endDate: (pe.endDate as any) ?? '',
            responsibilities: pe.responsibilities ?? '',
            achievements: pe.achievements ?? '',
          })) || [],
        references:
          teacher.references?.map(r => ({
            name: r.name ?? '',
            relationship: r.relationship ?? '',
            contactNumber: r.contactNumber ?? '',
            email: r.email ?? '',
            recommendationLetterUrl: (r as any).recommendationLetterUrl ?? '',
          })) || [],
        salaryExpectation: teacher.salaryExpectation ?? undefined,
        joiningDate: (teacher.joiningDate as any) ?? '',
        digitalSignatureUrl: (teacher as any).digitalSignatureUrl ?? '',
        yearsOfExperience: teacher.yearsOfExperience ?? undefined,
        noticePeriod: teacher.noticePeriod ?? '',
        subjectIds: teacher.subjectIds ?? [],
        gradeLevelIds: teacher.gradeLevelIds ?? [],
        languageProficiencyIds: teacher.languageProficiencyIds ?? [],
        computerSkills: teacher.computerSkills ?? '',
        teachingMethodology: teacher.teachingMethodology ?? '',
        onlineProfiles: {
          linkedin: teacher.onlineProfiles?.linkedin ?? '',
          personalWebsite: teacher.onlineProfiles?.personalWebsite ?? '',
        },
        details: teacher.details ?? '',
        status: (teacher.status as any) ?? STATUSES_OBJECT.INACTIVE,
      };
      reset(mapped);
    } else {
      reset(DEFAULTS);
    }
    setActiveTab(0);
  }, [open, teacher, reset]);

  const title = teacher ? 'Edit Teacher' : 'Add Teacher';

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);

  // submit
  const onSubmit = async (data: TeacherFormData) => {
    try {
      if (teacher) {
        // Compute diff and omit array fields that need IDs in API layer
        const base = {
          personTeacherId: teacher.person?.id ?? '',
          educationalQualifications: teacher.educationalQualifications ?? [],
          professionalExperience: teacher.professionalExperience ?? [],
          references: teacher.references ?? [],
          salaryExpectation: teacher.salaryExpectation ?? undefined,
          joiningDate: (teacher.joiningDate as any) ?? '',
          digitalSignatureUrl: (teacher as any).digitalSignatureUrl ?? '',
          yearsOfExperience: teacher.yearsOfExperience ?? undefined,
          noticePeriod: teacher.noticePeriod ?? '',
          subjectIds: teacher.subjectIds ?? [],
          gradeLevelIds: teacher.gradeLevelIds ?? [],
          languageProficiencyIds: teacher.languageProficiencyIds ?? [],
          computerSkills: teacher.computerSkills ?? '',
          teachingMethodology: teacher.teachingMethodology ?? '',
          onlineProfiles: {
            linkedin: teacher.onlineProfiles?.linkedin ?? '',
            personalWebsite: teacher.onlineProfiles?.personalWebsite ?? '',
          },
          details: teacher.details ?? '',
          status: (teacher.status as any) ?? STATUSES_OBJECT.INACTIVE,
        } as unknown as TeacherFormData;

        let diff = getChangedFields<TeacherFormData>(base, data);

        // Avoid TS2322: arrays on Teacher update expect items with id
        delete (diff as any).educationalQualifications;
        delete (diff as any).professionalExperience;
        delete (diff as any).references;

        // Generally don't reassign person on edit unless business allows
        delete (diff as any).personTeacherId;

        if (Object.keys(diff).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        await dispatch(updateTeacher({ id: teacher.id, data: diff as any })).unwrap();
        showToast(`Teacher ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        await dispatch(createTeacher(data)).unwrap();
        showToast(`Teacher ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }

      onClose();
    } catch (e: any) {
      showToast(e?.message || 'Failed to submit', 'error');
    }
  };

  if (assignableLoading && open) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <LoadingSpinner message="Loading assignable persons..." />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="teacher tabs"
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

        <DialogContent dividers sx={{ height: '70vh', overflow: 'auto' }}>
          {/* Tab 0 */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 1 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
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
                            disabled={!!teacher /* don't reassign on edit */}
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

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormSection title="Status" required>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.status}>
                          <InputLabel>Status *</InputLabel>
                          <Select {...field} label="Status *">
                            {Object.keys(STATUSES_OBJECT).map((item, key) => (
                              <MenuItem key={item} value={STATUSES[key]}>{item}</MenuItem>
                            ))}
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

          {/* Tab 1: Education */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ p: 1 }}>
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
                              maxSize={5 * 1024 * 1024}
                              label="Upload Certificate/Document"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                />
                {!!teacher && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Editing education here won’t update existing rows if your API expects item IDs.
                  </Alert>
                )}
              </FormSection>
            </Box>
          </TabPanel>

          {/* Tab 2: Experience */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ p: 1 }}>
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
                {!!teacher && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Editing experience here may be ignored on update if your API requires IDs.
                  </Alert>
                )}
              </FormSection>
            </Box>
          </TabPanel>

          {/* Tab 3: References */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ p: 1 }}>
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
                              maxSize={5 * 1024 * 1024}
                              label="Upload Recommendation Letter"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                />
                {!!teacher && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Editing references may be ignored on update if your API requires IDs.
                  </Alert>
                )}
              </FormSection>
            </Box>
          </TabPanel>

          {/* Tab 4: Employment & Skills */}
          <TabPanel value={activeTab} index={4}>
            <Box sx={{ p: 1 }}>
              <Grid container spacing={3}>
                {/* Employment */}
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
                                const v = e.target.value;
                                field.onChange(v === '' ? undefined : Number(v));
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
                              value={field.value || []}
                              label="Subjects to Teach *"
                              options={subjects.map(s => ({ value: s.id, label: s.name }))}
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
                              value={field.value || []}
                              label="Preferred Grade Levels *"
                              options={gradeLevels.map(g => ({ value: g.id, label: g.name }))}
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
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading || isSubmitting}>Close</Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? 'Saving...' : (teacher ? 'Save' : 'Add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

TeacherFormModal.displayName = 'TeacherFormModal';
export { TeacherFormModal };
