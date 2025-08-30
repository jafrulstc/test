// // features/person/components/PersonForm.tsx
// import React, { useEffect, useState, useRef, memo } from 'react';
// import {
//     Box,
//     Typography,
//     TextField,
//     Grid,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     FormControlLabel,
//     Checkbox,
//     Alert,
//     Button,
//     Avatar,
//     Chip,
// } from '@mui/material';
// import { Person as PersonIcon, CloudUpload, Delete, AttachFile } from '@mui/icons-material';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useTranslation } from 'react-i18next';
// import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
// import { useToastContext } from '~/app/providers/ToastProvider';
// import {
//     selectGenders,
//     selectBloodGroups,
//     selectReligions,
//     fetchAllSimpleEntities,
//     selectDesignationCategories,
//     selectDesignations,
//     selectPersonCategories,
//     fetchPersonCategories,
// } from '~/features/core/store/generalSlice';
// import {
//     selectNationalities,
//     fetchNationalities,
// } from '~/features/core/store/geographySlice';
// import { AddressFields } from '~/features/core/components/general/AddressFields';
// import { uploadPhoto, validatePhotoFile } from '~/shared/utils/photoUpload';
// import { createPerson, updatePerson } from '~/features/education/person/store/personSlice';
// import { personSchema, type PersonFormData } from '~/features/education/person/schemas/personSchema';
// import type { Person } from '~/features/education/person/types/personType';
// import { SUCCESS_MESSAGES } from '~/app/constants';
// import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

// interface PersonFormProps {
//     person?: Person | null;
//     onSuccess?: (person: Person) => void;
// }

// /**
//  * Person form component
//  */
// const PersonForm = memo(({ person, onSuccess }: PersonFormProps) => {
//     const { t } = useTranslation();
//     const dispatch = useAppDispatch();
//     const { showToast } = useToastContext();

//     const genders = useAppSelector(selectGenders);
//     const bloodGroups = useAppSelector(selectBloodGroups);
//     const religions = useAppSelector(selectReligions);
//     const nationalities = useAppSelector(selectNationalities);

//     const [photoUploading, setPhotoUploading] = useState(false);
//     const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//     const [fileUploading, setFileUploading] = useState<Record<string, boolean>>({});
//     const [isFormInitialized, setIsFormInitialized] = useState(false);

//     const photoInputRef = useRef<HTMLInputElement>(null);
//     const nidInputRef = useRef<HTMLInputElement>(null);
//     const brnInputRef = useRef<HTMLInputElement>(null);
//     const fatherNidInputRef = useRef<HTMLInputElement>(null);
//     const motherNidInputRef = useRef<HTMLInputElement>(null);
//     const digitalSignatureInputRef = useRef<HTMLInputElement>(null);

//     const personCategories = useAppSelector(selectPersonCategories);
//     const designationCategories = useAppSelector(selectDesignationCategories);
//     const allDesignations = useAppSelector(selectDesignations);

//     const isEdit = Boolean(person);

//     const {
//         control,
//         handleSubmit,
//         reset,
//         watch,
//         setValue,
//         formState: { errors, isSubmitting },
//     } = useForm<PersonFormData>({
//         resolver: zodResolver(personSchema),
//         defaultValues: {
//             // Personal
//             firstName: '',
//             lastName: '',
//             fatherName: '',
//             motherName: '',
//             dateOfBirth: '',
//             email: '',
//             healthCondition: '',
//             nidNumber: '',
//             brnNumber: '',
//             fatherNidNumber: '',
//             motherBrnNumber: '',

//             // Demographics
//             genderId: '',
//             bloodGroupId: '',
//             religionId: '',
//             nationalityId: '',

//             // Address
//             presentAddress: {},
//             permanentAddress: {},
//             sameAsPresent: false,

//             // Files
//             photo: '',
//             nidFile: '',
//             brnFile: '',
//             fatherNidFile: '',
//             motherNidFile: '',
//             digitalSignatureFile: '',

//             // Display-only names (optional)
//             necessary: {
//                 nidFileName: '',
//                 brnFileName: '',
//                 fatherNidFileName: '',
//                 motherNidFileName: '',
//                 digitalSignatureFileName: '',
//             },
//             personCategoryId: '',
//             designationCategoryId: '',
//             designationId: '',
//             // Status
//             status: STATUSES_OBJECT.ACTIVE,
//         },
//     });

//     // ⬇️ watch extra fields
//     const personCategoryId = watch('personCategoryId');
//     const designationCategoryId = watch('designationCategoryId');

//     // ⬇️ helpers
//     const selectedCategory = personCategories.find(c => c.id === personCategoryId);
//     const isStaffSelected = (selectedCategory?.name || '').toLowerCase() === 'staff';

//     // ⬇️ designation filter by category
//     const filteredDesignations = allDesignations.filter(d => d.designationCategoryId === designationCategoryId);

//     const sameAsPresent = watch('sameAsPresent');
//     const presentAddress = watch('presentAddress');

//     // Fetch required master data
//     useEffect(() => {
//         if (genders.length === 0 || bloodGroups.length === 0 || religions.length === 0) {
//             dispatch(fetchAllSimpleEntities());
//         }
//         if (nationalities.length === 0) {
//             dispatch(fetchNationalities({ page: 1, limit: 1000, filters: {} }));
//         }
//         // ⬇️ fetch person categories if empty
//         if (personCategories.length === 0) {
//             dispatch(fetchPersonCategories({}));
//         }
//     }, [
//         dispatch,
//         genders.length,
//         bloodGroups.length,
//         religions.length,
//         nationalities.length,
//         personCategories.length,
//     ]);

//     // Reset form when person changes
//     useEffect(() => {
//         if (person) {
//             const defaultValues: PersonFormData = {
//                 firstName: person.firstName,
//                 lastName: person.lastName,
//                 fatherName: person.fatherName,
//                 motherName: person.motherName,
//                 dateOfBirth: person.dateOfBirth,
//                 email: person.email || '',
//                 healthCondition: person.healthCondition || '',
//                 nidNumber: person.nidNumber || '',
//                 brnNumber: person.brnNumber || '',
//                 fatherNidNumber: person.fatherNidNumber || '',
//                 motherBrnNumber: person.motherBrnNumber || '',

//                 genderId: person.genderId,
//                 bloodGroupId: person.bloodGroupId || '',
//                 religionId: person.religionId || '',
//                 nationalityId: person.nationalityId || '',

//                 presentAddress: person.presentAddress || {},
//                 permanentAddress: person.permanentAddress || {},
//                 sameAsPresent: person.sameAsPresent || false,

//                 photo: person.photo || '',
//                 nidFile: person.nidFile || '',
//                 brnFile: person.brnFile || '',
//                 fatherNidFile: person.fatherNidFile || '',
//                 motherNidFile: person.motherNidFile || '',
//                 digitalSignatureFile: person.digitalSignatureFile || '',

//                 personCategoryId: person.personCategoryId || '',
//                 designationCategoryId: person.designationCategoryId || '',
//                 designationId: person.designationId || '',

//                 status: person.status,
//             };
//             reset(defaultValues);
//             setPhotoPreview(person.photo || null);
//             setIsFormInitialized(true);
//         } else {
//             reset({
//                 firstName: '',
//                 lastName: '',
//                 fatherName: '',
//                 motherName: '',
//                 dateOfBirth: '',
//                 email: '',
//                 healthCondition: '',
//                 nidNumber: '',
//                 brnNumber: '',
//                 fatherNidNumber: '',
//                 motherBrnNumber: '',
//                 genderId: '',
//                 bloodGroupId: '',
//                 religionId: '',
//                 nationalityId: '',
//                 presentAddress: {},
//                 permanentAddress: {},
//                 sameAsPresent: false,
//                 photo: '',
//                 nidFile: '',
//                 brnFile: '',
//                 fatherNidFile: '',
//                 motherNidFile: '',
//                 digitalSignatureFile: '',

//                 personCategoryId: '',
//                 designationCategoryId: '',
//                 designationId: '',

//                 status: STATUSES_OBJECT.ACTIVE,
//             });
//             setPhotoPreview(null);
//             setIsFormInitialized(true);
//         }
//     }, [person, reset]);

//     // ✅ Fixed: Only reset designation when category changes manually, not during form initialization
//     useEffect(() => {
//         // শুধুমাত্র form initialized হওয়ার পর designation reset করব
//         if (isFormInitialized && !isEdit) {
//             setValue('designationId', '');
//         }
//         // Edit mode এ যদি designation category change হয়, তাহলেও reset করব
//         // কিন্তু initial load এর সময় নয়
//         if (isFormInitialized && isEdit) {
//             const currentDesignationId = watch('designationId');
//             const isDesignationValid = filteredDesignations.some(d => d.id === currentDesignationId);

//             // যদি current designation এই category এর না হয়, তাহলে reset করব
//             if (currentDesignationId && !isDesignationValid) {
//                 setValue('designationId', '');
//             }
//         }
//     }, [designationCategoryId, setValue, isFormInitialized, isEdit, filteredDesignations, watch]);

//     // Update permanent address when "same as present" is checked
//     useEffect(() => {
//         if (sameAsPresent && presentAddress) {
//             setValue('permanentAddress', presentAddress);
//         }
//     }, [sameAsPresent, presentAddress, setValue]);

//     /** Handle photo upload */
//     const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         const validation = validatePhotoFile(file);
//         if (!validation.valid) {
//             showToast(validation.error!, 'error');
//             return;
//         }

//         setPhotoUploading(true);
//         try {
//             const result = await uploadPhoto(file);
//             if (result.success && result.url) {
//                 setValue('photo', result.url);
//                 setPhotoPreview(result.url);
//                 showToast('Photo uploaded successfully', 'success');
//             } else {
//                 showToast(result.error || 'Failed to upload photo', 'error');
//             }
//         } catch {
//             showToast('Failed to upload photo', 'error');
//         } finally {
//             setPhotoUploading(false);
//         }
//     };

//     /** Handle file upload (PDF/Image) */
//     const handleFileUpload = async (
//         event: React.ChangeEvent<HTMLInputElement>,
//         fieldName:
//             | 'nidFile'
//             | 'brnFile'
//             | 'fatherNidFile'
//             | 'motherNidFile'
//             | 'digitalSignatureFile',
//         fileNameField?:
//             | 'necessary.nidFileName'
//             | 'necessary.brnFileName'
//             | 'necessary.fatherNidFileName'
//             | 'necessary.motherNidFileName'
//             | 'necessary.digitalSignatureFileName'
//     ) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
//         if (!allowedTypes.includes(file.type)) {
//             showToast('Only PDF, JPEG, PNG, and GIF files are allowed', 'error');
//             return;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//             showToast('File size must be less than 5MB', 'error');
//             return;
//         }

//         setFileUploading(prev => ({ ...prev, [fieldName]: true }));
//         try {
//             // Convert to base64 (mock)
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const result = reader.result as string;
//                 setValue(fieldName as any, result);
//                 if (fileNameField) {
//                     setValue(fileNameField as any, file.name);
//                 }
//                 showToast('File uploaded successfully', 'success');
//                 setFileUploading(prev => ({ ...prev, [fieldName]: false }));
//             };
//             reader.onerror = () => {
//                 showToast('Failed to upload file', 'error');
//                 setFileUploading(prev => ({ ...prev, [fieldName]: false }));
//             };
//             reader.readAsDataURL(file);
//         } catch {
//             showToast('Failed to upload file', 'error');
//             setFileUploading(prev => ({ ...prev, [fieldName]: false }));
//         }
//     };

//     /** Remove uploaded file */
//     const handleRemoveFile = (
//         fieldName:
//             | 'nidFile'
//             | 'brnFile'
//             | 'fatherNidFile'
//             | 'motherNidFile'
//             | 'digitalSignatureFile',
//         fileNameField?:
//             | 'necessary.nidFileName'
//             | 'necessary.brnFileName'
//             | 'necessary.fatherNidFileName'
//             | 'necessary.motherNidFileName'
//             | 'necessary.digitalSignatureFileName'
//     ) => {
//         setValue(fieldName as any, '');
//         if (fileNameField) {
//             setValue(fileNameField as any, '');
//         }
//         showToast('File removed successfully', 'success');
//     };

//     /** Submit */
//     const onSubmit = async (data: PersonFormData) => {
//         try {
//             // UI-level guard: staff হলে দুইটা ফিল্ড আবশ্যিক
//             if (isStaffSelected) {
//                 if (!data.designationCategoryId) {
//                     showToast('Designation category is required for Staff', 'error');
//                     return;
//                 }
//                 if (!data.designationId) {
//                     showToast('Designation is required for Staff', 'error');
//                     return;
//                 }
//             }
//             if (isEdit && person) {
//                 const updated = await dispatch(updatePerson({ id: person.id, data })).unwrap();
//                 showToast(`Person ${SUCCESS_MESSAGES.UPDATED}`, 'success');
//                 onSuccess?.(updated);
//             } else {
//                 const created = await dispatch(createPerson(data)).unwrap();
//                 showToast(`Person ${SUCCESS_MESSAGES.CREATED}`, 'success');
//                 onSuccess?.(created);
//                 reset();
//                 setPhotoPreview(null);
//             }
//         } catch (error: any) {
//             showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} person`, 'error');
//         }
//     };

//     return (
//         <Box component="form" onSubmit={handleSubmit(onSubmit)}>
//             <Typography variant="h6" fontWeight={600} gutterBottom>
//                 {isEdit ? 'Edit Person' : 'Add New Person'}
//             </Typography>

//             <Grid container spacing={3}>
//                 {/* Photo */}
//                 <Grid size={{ xs: 12 }}>
//                     <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//                         Person Photo
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Avatar src={photoPreview || undefined} sx={{ width: 80, height: 80 }}>
//                             <PersonIcon sx={{ fontSize: 40 }} />
//                         </Avatar>
//                         <Box>
//                             <Button
//                                 variant="outlined"
//                                 startIcon={<CloudUpload />}
//                                 onClick={() => photoInputRef.current?.click()}
//                                 disabled={photoUploading}
//                             >
//                                 {photoUploading ? 'Uploading...' : 'Upload Photo'}
//                             </Button>
//                             <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
//                                 Max 5MB. JPEG, PNG, GIF supported. (Optional)
//                             </Typography>
//                             <input
//                                 ref={photoInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handlePhotoUpload}
//                                 style={{ display: 'none' }}
//                             />
//                         </Box>
//                     </Box>
//                 </Grid>

//                 {/* Divider */}
//                 <Grid size={{ xs: 12 }}>
//                     <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />
//                 </Grid>

//                 {/* Personal Information */}
//                 <Grid size={{ xs: 12 }}>
//                     <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//                         Personal Information
//                     </Typography>
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="firstName"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="First Name *"
//                                 error={!!errors.firstName}
//                                 helperText={errors.firstName?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="lastName"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="Last Name *"
//                                 error={!!errors.lastName}
//                                 helperText={errors.lastName?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="fatherName"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="Father's Name *"
//                                 error={!!errors.fatherName}
//                                 helperText={errors.fatherName?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="motherName"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="Mother's Name *"
//                                 error={!!errors.motherName}
//                                 helperText={errors.motherName?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="dateOfBirth"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="Date of Birth *"
//                                 type="date"
//                                 InputLabelProps={{ shrink: true }}
//                                 error={!!errors.dateOfBirth}
//                                 helperText={errors.dateOfBirth?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="email"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="Email"
//                                 type="email"
//                                 error={!!errors.email}
//                                 helperText={errors.email?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 {/* Extra Numbers */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="nidNumber"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="NID Number"
//                                 error={!!errors.nidNumber}
//                                 helperText={errors.nidNumber?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="brnNumber"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="Birth Registration Number (BRN)"
//                                 error={!!errors.brnNumber}
//                                 helperText={errors.brnNumber?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="fatherNidNumber"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="Father NID Number"
//                                 error={!!errors.fatherNidNumber}
//                                 helperText={errors.fatherNidNumber?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="motherBrnNumber"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 label="Mother BRN Number"
//                                 error={!!errors.motherBrnNumber}
//                                 helperText={errors.motherBrnNumber?.message}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 {/* Person Category */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="personCategoryId"
//                         control={control}
//                         render={({ field }) => (
//                             <FormControl fullWidth error={!!errors.personCategoryId}>
//                                 <InputLabel>Person Category *</InputLabel>
//                                 <Select {...field} label="Person Category *">
//                                     <MenuItem value="">Select Category</MenuItem>
//                                     {personCategories.map((c) => (
//                                         <MenuItem key={c.id} value={c.id}>
//                                             {c.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                                 {errors.personCategoryId && (
//                                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                                         {errors.personCategoryId.message}
//                                     </Typography>
//                                 )}
//                             </FormControl>
//                         )}
//                     />
//                 </Grid>

//                 {isStaffSelected && (
//                     <>
//                         {/* Designation Category */}
//                         <Grid size={{ xs: 12, md: 6 }}>
//                             <Controller
//                                 name="designationCategoryId"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <FormControl fullWidth error={!!errors.designationCategoryId}>
//                                         <InputLabel>Designation Category</InputLabel>
//                                         <Select {...field} label="Designation Category">
//                                             <MenuItem value="">Select Designation Category</MenuItem>
//                                             {designationCategories.map(dc => (
//                                                 <MenuItem key={dc.id} value={dc.id}>
//                                                     {dc.name}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                         {errors.designationCategoryId && (
//                                             <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                                                 {errors.designationCategoryId.message}
//                                             </Typography>
//                                         )}
//                                     </FormControl>
//                                 )}
//                             />
//                         </Grid>

//                         {/* Designation (filtered by category) */}
//                         <Grid size={{ xs: 12, md: 6 }}>
//                             <Controller
//                                 name="designationId"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <FormControl fullWidth error={!!errors.designationId}>
//                                         <InputLabel>Designation</InputLabel>
//                                         <Select {...field} label="Designation" disabled={!designationCategoryId}>
//                                             <MenuItem value="">Select Designation</MenuItem>
//                                             {filteredDesignations.map(d => (
//                                                 <MenuItem key={d.id} value={d.id}>
//                                                     {d.name}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                         {errors.designationId && (
//                                             <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                                                 {errors.designationId.message}
//                                             </Typography>
//                                         )}
//                                     </FormControl>
//                                 )}
//                             />
//                         </Grid>
//                     </>
//                 )}

//                 {/* Demographics */}
//                 <Grid size={{ xs: 12 }}>
//                     <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
//                         Demographics
//                     </Typography>
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="genderId"
//                         control={control}
//                         render={({ field }) => (
//                             <FormControl fullWidth error={!!errors.genderId}>
//                                 <InputLabel>Gender *</InputLabel>
//                                 <Select {...field} label="Gender *">
//                                     <MenuItem value="">Select Gender</MenuItem>
//                                     {genders.map((g) => (
//                                         <MenuItem key={g.id} value={g.id}>
//                                             {g.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                                 {errors.genderId && (
//                                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                                         {errors.genderId.message}
//                                     </Typography>
//                                 )}
//                             </FormControl>
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="bloodGroupId"
//                         control={control}
//                         render={({ field }) => (
//                             <FormControl fullWidth error={!!errors.bloodGroupId}>
//                                 <InputLabel>Blood Group</InputLabel>
//                                 <Select {...field} label="Blood Group">
//                                     <MenuItem value="">Select Blood Group</MenuItem>
//                                     {bloodGroups.map((bg) => (
//                                         <MenuItem key={bg.id} value={bg.id}>
//                                             {bg.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                                 {errors.bloodGroupId && (
//                                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                                         {errors.bloodGroupId.message}
//                                     </Typography>
//                                 )}
//                             </FormControl>
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="religionId"
//                         control={control}
//                         render={({ field }) => (
//                             <FormControl fullWidth error={!!errors.religionId}>
//                                 <InputLabel>Religion</InputLabel>
//                                 <Select {...field} label="Religion">
//                                     <MenuItem value="">Select Religion</MenuItem>
//                                     {religions.map((r) => (
//                                         <MenuItem key={r.id} value={r.id}>
//                                             {r.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                                 {errors.religionId && (
//                                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                                         {errors.religionId.message}
//                                     </Typography>
//                                 )}
//                             </FormControl>
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="nationalityId"
//                         control={control}
//                         render={({ field }) => (
//                             <FormControl fullWidth error={!!errors.nationalityId}>
//                                 <InputLabel>Nationality</InputLabel>
//                                 <Select {...field} label="Nationality">
//                                     <MenuItem value="">Select Nationality</MenuItem>
//                                     {nationalities.map((n) => (
//                                         <MenuItem key={n.id} value={n.id}>
//                                             {n.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                                 {errors.nationalityId && (
//                                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                                         {errors.nationalityId.message}
//                                     </Typography>
//                                 )}
//                             </FormControl>
//                         )}
//                     />
//                 </Grid>

//                 {/* File Uploads */}
//                 <Grid size={{ xs: 12 }}>
//                     <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
//                         Document Uploads
//                     </Typography>
//                 </Grid>

//                 {/* NID */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="body2" gutterBottom>NID File</Typography>

//                     <Controller
//                         name="necessary.nidFileName"
//                         control={control}
//                         render={({ field }) => (
//                             <Box sx={{ mb: 1 }}>
//                                 {field.value ? (
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <Chip
//                                             label={field.value}
//                                             variant="outlined"
//                                             color="success"
//                                             onDelete={() => handleRemoveFile('nidFile', 'necessary.nidFileName')}
//                                             deleteIcon={<Delete />}
//                                         />
//                                     </Box>
//                                 ) : null}
//                             </Box>
//                         )}
//                     />

//                     <Button
//                         variant="outlined"
//                         startIcon={<AttachFile />}
//                         onClick={() => nidInputRef.current?.click()}
//                         disabled={fileUploading.nidFile}
//                         fullWidth
//                     >
//                         {fileUploading.nidFile ? 'Uploading...' : 'Upload NID'}
//                     </Button>
//                     <input
//                         ref={nidInputRef}
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => handleFileUpload(e, 'nidFile', 'necessary.nidFileName')}
//                         style={{ display: 'none' }}
//                     />
//                 </Grid>

//                 {/* BRN */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="body2" gutterBottom>Birth Registration File</Typography>

//                     <Controller
//                         name="necessary.brnFileName"
//                         control={control}
//                         render={({ field }) => (
//                             <Box sx={{ mb: 1 }}>
//                                 {field.value ? (
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <Chip
//                                             label={field.value}
//                                             variant="outlined"
//                                             color="success"
//                                             onDelete={() => handleRemoveFile('brnFile', 'necessary.brnFileName')}
//                                             deleteIcon={<Delete />}
//                                         />
//                                     </Box>
//                                 ) : null}
//                             </Box>
//                         )}
//                     />

//                     <Button
//                         variant="outlined"
//                         startIcon={<AttachFile />}
//                         onClick={() => brnInputRef.current?.click()}
//                         disabled={fileUploading.brnFile}
//                         fullWidth
//                     >
//                         {fileUploading.brnFile ? 'Uploading...' : 'Upload Birth Registration'}
//                     </Button>
//                     <input
//                         ref={brnInputRef}
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => handleFileUpload(e, 'brnFile', 'necessary.brnFileName')}
//                         style={{ display: 'none' }}
//                     />
//                 </Grid>

//                 {/* Father NID */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="body2" gutterBottom>Father NID File</Typography>

//                     <Controller
//                         name="necessary.fatherNidFileName"
//                         control={control}
//                         render={({ field }) => (
//                             <Box sx={{ mb: 1 }}>
//                                 {field.value ? (
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <Chip
//                                             label={field.value}
//                                             variant="outlined"
//                                             color="success"
//                                             onDelete={() => handleRemoveFile('fatherNidFile', 'necessary.fatherNidFileName')}
//                                             deleteIcon={<Delete />}
//                                         />
//                                     </Box>
//                                 ) : null}
//                             </Box>
//                         )}
//                     />

//                     <Button
//                         variant="outlined"
//                         startIcon={<AttachFile />}
//                         onClick={() => fatherNidInputRef.current?.click()}
//                         disabled={fileUploading.fatherNidFile}
//                         fullWidth
//                     >
//                         {fileUploading.fatherNidFile ? 'Uploading...' : 'Upload Father NID'}
//                     </Button>
//                     <input
//                         ref={fatherNidInputRef}
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => handleFileUpload(e, 'fatherNidFile', 'necessary.fatherNidFileName')}
//                         style={{ display: 'none' }}
//                     />
//                 </Grid>

//                 {/* Mother NID */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="body2" gutterBottom>Mother NID File</Typography>

//                     <Controller
//                         name="necessary.motherNidFileName"
//                         control={control}
//                         render={({ field }) => (
//                             <Box sx={{ mb: 1 }}>
//                                 {field.value ? (
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <Chip
//                                             label={field.value}
//                                             variant="outlined"
//                                             color="success"
//                                             onDelete={() => handleRemoveFile('motherNidFile', 'necessary.motherNidFileName')}
//                                             deleteIcon={<Delete />}
//                                         />
//                                     </Box>
//                                 ) : null}
//                             </Box>
//                         )}
//                     />

//                     <Button
//                         variant="outlined"
//                         startIcon={<AttachFile />}
//                         onClick={() => motherNidInputRef.current?.click()}
//                         disabled={fileUploading.motherNidFile}
//                         fullWidth
//                     >
//                         {fileUploading.motherNidFile ? 'Uploading...' : 'Upload Mother NID'}
//                     </Button>
//                     <input
//                         ref={motherNidInputRef}
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => handleFileUpload(e, 'motherNidFile', 'necessary.motherNidFileName')}
//                         style={{ display: 'none' }}
//                     />
//                 </Grid>

//                 {/* Digital Signature */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="body2" gutterBottom>Digital Signature</Typography>

//                     <Controller
//                         name="necessary.digitalSignatureFileName"
//                         control={control}
//                         render={({ field }) => (
//                             <Box sx={{ mb: 1 }}>
//                                 {field.value ? (
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <Chip
//                                             label={field.value}
//                                             variant="outlined"
//                                             color="success"
//                                             onDelete={() => handleRemoveFile('digitalSignatureFile', 'necessary.digitalSignatureFileName')}
//                                             deleteIcon={<Delete />}
//                                         />
//                                     </Box>
//                                 ) : null}
//                             </Box>
//                         )}
//                     />

//                     <Button
//                         variant="outlined"
//                         startIcon={<AttachFile />}
//                         onClick={() => digitalSignatureInputRef.current?.click()}
//                         disabled={fileUploading.digitalSignatureFile}
//                         fullWidth
//                     >
//                         {fileUploading.digitalSignatureFile ? 'Uploading...' : 'Upload Digital Signature'}
//                     </Button>
//                     <input
//                         ref={digitalSignatureInputRef}
//                         type="file"
//                         accept=".pdf,image/*"
//                         onChange={(e) => handleFileUpload(e, 'digitalSignatureFile', 'necessary.digitalSignatureFileName')}
//                         style={{ display: 'none' }}
//                     />
//                 </Grid>

//                 {/* Addresses */}
//                 <Grid size={{ xs: 12 }}>
//                     <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
//                         Present Address
//                     </Typography>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                     <Controller
//                         name="presentAddress"
//                         control={control}
//                         render={({ field }) => (
//                             <AddressFields
//                                 value={field.value || {}}
//                                 onChange={field.onChange}
//                                 error={errors.presentAddress}
//                             />
//                         )}
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
//                         <Typography variant="subtitle1" fontWeight={600}>
//                             Permanent Address
//                         </Typography>
//                         <Controller
//                             name="sameAsPresent"
//                             control={control}
//                             render={({ field }) => (
//                                 <FormControlLabel
//                                     control={<Checkbox checked={field.value || false} onChange={field.onChange} />}
//                                     label="Same as Present"
//                                 />
//                             )}
//                         />
//                     </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                     {sameAsPresent ? (
//                         <Alert severity="info">Permanent address will be same as present address</Alert>
//                     ) : (
//                         <Controller
//                             name="permanentAddress"
//                             control={control}
//                             render={({ field }) => (
//                                 <AddressFields
//                                     value={field.value || {}}
//                                     onChange={field.onChange}
//                                     error={errors.permanentAddress}
//                                 />
//                             )}
//                         />
//                     )}
//                 </Grid>

//                 {/* Status */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Controller
//                         name="status"
//                         control={control}
//                         render={({ field }) => (
//                             <FormControl fullWidth error={!!errors.status}>
//                                 <InputLabel>Status *</InputLabel>
//                                 <Select {...field} label="Status *">
//                                     <MenuItem value={STATUSES_OBJECT.ACTIVE}>Active</MenuItem>
//                                     <MenuItem value={STATUSES_OBJECT.INACTIVE}>Inactive</MenuItem>
//                                 </Select>
//                                 {errors.status && (
//                                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                                         {errors.status.message}
//                                     </Typography>
//                                 )}
//                             </FormControl>
//                         )}
//                     />
//                 </Grid>

//                 {/* Submit */}
//                 <Grid size={{ xs: 12 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//                         <Button
//                             type="submit"
//                             variant="contained"
//                             disabled={isSubmitting || photoUploading || Object.values(fileUploading).some(Boolean)}
//                             sx={{ minWidth: 150 }}
//                         >
//                             {isSubmitting ? 'Saving...' : isEdit ? 'Update Person' : 'Add Person'}
//                         </Button>
//                     </Box>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// });

// PersonForm.displayName = 'PersonForm';

// export { PersonForm };