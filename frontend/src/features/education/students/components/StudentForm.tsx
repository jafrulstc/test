// features/education/students/components/StudentForm.tsx
import React, { useEffect } from 'react';
import {
  Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  createStudent,
  updateStudent,
  fetchAssignableStudentPersons,
  selectAssignableStudentPersons,
  selectAssignableStudentPersonsLoading
} from '../store/studentSlice';
import type { Student } from '../types';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { minimalStudentSchema, type StudentFormIn, type StudentFormOut } from '../schemas/studentSchema';

interface StudentFormProps {
  student?: Student | null;
  onSuccess?: (student: Student) => void;
}

export const StudentForm = ({ student, onSuccess }: StudentFormProps) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();
  const isEdit = !!student;

  // Redux-driven dropdown data
  const assignablePersons = useAppSelector(selectAssignableStudentPersons);
  const assignableLoading = useAppSelector(selectAssignableStudentPersonsLoading);

  const options = React.useMemo(
    () => assignablePersons.map(p => ({ id: p.id, label: `${p.firstName} ${p.lastName}`.trim() })),
    [assignablePersons]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormIn>({
    resolver: zodResolver(minimalStudentSchema),
    defaultValues: {
      personStudentId: '',
      status: STATUSES_OBJECT.ACTIVE,
    },
  });

  // Edit mode defaults
  useEffect(() => {
    if (isEdit && student) {
      reset({
        personStudentId: student.personStudentId,
        status: student.status as any,
      });
    } else {
      reset({ personStudentId: '', status: STATUSES_OBJECT.ACTIVE });
    }
  }, [isEdit, student, reset]);

  // Load only-unassigned student persons (edit হলে নিজের person id include)
  useEffect(() => {
    dispatch(fetchAssignableStudentPersons({
      page: 1,
      limit: 1000,
      includePersonId: isEdit && student ? student.personStudentId : undefined,
    }));
  }, [dispatch, isEdit, student?.personStudentId]);

  const refreshAssignable = React.useCallback(() => {
    return dispatch(fetchAssignableStudentPersons({
      page: 1,
      limit: 1000,
      includePersonId: isEdit && student ? student.personStudentId : undefined,
    }));
  }, [dispatch, isEdit, student?.personStudentId]);

  const onSubmit = async (raw: StudentFormIn) => {
    try {
      const data: StudentFormOut = minimalStudentSchema.parse(raw);

      if (isEdit && student) {
        const updated = await dispatch(
          updateStudent({ id: student.id, data: { personStudentId: data.personStudentId, status: data.status } })
        ).unwrap();
        showToast('Student updated', 'success');
        onSuccess?.(updated);
        await refreshAssignable(); // ✅ dropdown রিফ্রেশ
      } else {
        const created = await dispatch(
          createStudent({ personStudentId: data.personStudentId, status: data.status })
        ).unwrap();
        showToast('Student created', 'success');
        onSuccess?.(created);
        reset({ personStudentId: '', status: STATUSES_OBJECT.ACTIVE });
        await refreshAssignable(); // ✅ নতুন assign পরই exclude
      }
    } catch (error: any) {
      showToast(error?.message || `Failed to ${isEdit ? 'update' : 'create'} student`, 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isEdit ? 'Edit Student' : 'Add New Student'}
      </Typography>

      <Grid container spacing={3}>
        {/* Student Person (dropdown) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="personStudentId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personStudentId}>
                <InputLabel>Student Person *</InputLabel>
                <Select
                  {...field}
                  label="Student Person *"
                  disabled={assignableLoading}
                  renderValue={(val) => {
                    const hit = options.find(o => o.id === val);
                    return hit ? hit.label : '';
                  }}
                >
                  <MenuItem value="">
                    {assignableLoading ? <CircularProgress size={18} /> : 'Select a student person'}
                  </MenuItem>
                  {options.map(opt => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.label}</MenuItem>
                  ))}
                </Select>
                {errors.personStudentId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.personStudentId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

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
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Submit */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
