import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Fab,
  Pagination,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  fetchStudents,
  fetchGuardians,
  fetchAcademicClasses,
  deleteStudent,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  selectStudents,
  selectGuardians,
  selectAcademicClasses,
  selectStudentsLoading,
  selectStudentsError,
  selectStudentsFilters,
  selectStudentsPagination,
  createStudent,
  updateStudent,
  assignHostel,
  removeFromHostel,
} from '../store/studentsSlice';
import { StudentCard } from '../components/StudentCard';
import { StudentFilters } from '../components/StudentFilters';
import { StudentFormModal } from '../components/StudentFormModal';
import { StudentDetailsModal } from '../components/StudentDetailsModal';
import { AssignHostelModal } from '../components/AssignHostelModal';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import type {
  StudentDetail,
  CreateStudentDto,
  UpdateStudentDto,
  AssignHostelDto,
} from '../types';
import { SUCCESS_MESSAGES } from '~/app/constants';

/**
 * Student Management page component
 * Handles student management and hostel assignment operations
 */
export const StudentManagement = memo(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  // Redux state
  const students = useAppSelector(selectStudents);
  const guardians = useAppSelector(selectGuardians);
  const academicClasses = useAppSelector(selectAcademicClasses);
  const loading = useAppSelector(selectStudentsLoading);
  const error = useAppSelector(selectStudentsError);
  const filters = useAppSelector(selectStudentsFilters);
  const pagination = useAppSelector(selectStudentsPagination);

  // Local state for modals and dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentDetail | null>(null);
  const [removeFromHostelDialogOpen, setRemoveFromHostelDialogOpen] = useState(false);
  const [studentToRemoveFromHostel, setStudentToRemoveFromHostel] = useState<StudentDetail | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [assignHostelModalOpen, setAssignHostelModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [studentForHostelAssignment, setStudentForHostelAssignment] = useState<StudentDetail | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchStudents({ page: pagination.page, limit: pagination.limit, filters }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  useEffect(() => {
    dispatch(fetchGuardians());
    dispatch(fetchAcademicClasses());
  }, [dispatch]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch, showToast]);

  // Event handlers
  const handleFiltersChange = useCallback(
    (newFilters: typeof filters) => {
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    dispatch(setPagination({ page: 1 }));
  }, [dispatch]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      dispatch(setPagination({ page }));
    },
    [dispatch],
  );

  // Student handlers
  const handleAddStudent = useCallback(() => {
    setSelectedStudent(null);
    setFormModalOpen(true);
  }, []);

  const handleEditStudent = useCallback((student: StudentDetail) => {
    setSelectedStudent(student);
    setFormModalOpen(true);
  }, []);

  const handleDeleteStudent = useCallback((student: StudentDetail) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  }, []);

  const handleViewDetails = useCallback((student: StudentDetail) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  }, []);

  const handleAssignHostel = useCallback((student: StudentDetail) => {
    setStudentForHostelAssignment(student);
    setAssignHostelModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (studentToDelete) {
      try {
        await dispatch(deleteStudent(studentToDelete.id)).unwrap();
        showToast(`Student ${studentToDelete.firstName} ${studentToDelete.lastName} ${SUCCESS_MESSAGES.DELETED}`, 'success');
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
      } catch (error) {
        showToast('Failed to delete student', 'error');
      }
    }
  }, [dispatch, studentToDelete, showToast]);

  const handleRemoveFromHostelClick = useCallback((student: StudentDetail) => {
    setStudentToRemoveFromHostel(student);
    setDetailsModalOpen(false);
    setTimeout(() => {
      setRemoveFromHostelDialogOpen(true);
    }, 100);
  }, []);

  const handleConfirmRemoveFromHostel = useCallback(async () => {
    if (studentToRemoveFromHostel) {
      try {
        await dispatch(removeFromHostel(studentToRemoveFromHostel.id)).unwrap();
        showToast(
          `${studentToRemoveFromHostel.firstName} ${studentToRemoveFromHostel.lastName} removed from hostel successfully`,
          'success',
        );
        setRemoveFromHostelDialogOpen(false);
        setStudentToRemoveFromHostel(null);
      } catch (error) {
        showToast('Failed to remove student from hostel', 'error');
      }
    }
  }, [dispatch, studentToRemoveFromHostel, showToast]);

  const handleFormSubmit = useCallback(
    async (data: CreateStudentDto | UpdateStudentDto) => {
      try {
        if (selectedStudent) {
          await dispatch(updateStudent({ id: selectedStudent.id, data: data as UpdateStudentDto })).unwrap();
          showToast(`Student ${selectedStudent.firstName} ${selectedStudent.lastName} ${SUCCESS_MESSAGES.UPDATED}`, 'success');
        } else {
          const newStudent = await dispatch(createStudent(data as CreateStudentDto)).unwrap();
          showToast(`Student ${newStudent.firstName} ${newStudent.lastName} ${SUCCESS_MESSAGES.CREATED}`, 'success');
        }
        setFormModalOpen(false);
        setSelectedStudent(null);
      } catch (error) {
        showToast(`Failed to ${selectedStudent ? 'update' : 'create'} student`, 'error');
      }
    },
    [dispatch, selectedStudent, showToast],
  );

  const handleHostelAssignSubmit = useCallback(
    async (data: AssignHostelDto) => {
      if (studentForHostelAssignment) {
        try {
          await dispatch(assignHostel({ id: studentForHostelAssignment.id, data })).unwrap();
          showToast(
            `Hostel assigned to ${studentForHostelAssignment.firstName} ${studentForHostelAssignment.lastName} successfully`,
            'success',
          );
          setAssignHostelModalOpen(false);
          setStudentForHostelAssignment(null);
        } catch (error) {
          showToast('Failed to assign hostel', 'error');
        }
      }
    },
    [dispatch, studentForHostelAssignment, showToast],
  );

  // Memoized student cards for performance
  const memoizedStudentCards = useMemo(() => {
    return students.map((student) => (
      <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 4', xl: 'span 3' } }} key={student.id}>
        <StudentCard
          student={student}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onViewDetails={handleViewDetails}
          onAssignHostel={handleAssignHostel}
        />
      </Grid>
    ));
  }, [students, handleEditStudent, handleDeleteStudent, handleViewDetails, handleAssignHostel]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  // Loading state
  if (loading && students.length === 0) {
    return <LoadingSpinner message="Loading students..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Student Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage students and hostel assignments
          </Typography>
        </Box>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddStudent}
            size="large"
            sx={{ borderRadius: 3, px: 3 }}
          >
            Add Student
          </Button>
        )}
      </Box>

      {/* Filters */}
      <StudentFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        guardians={guardians}
        academicClasses={academicClasses}
      />

      {/* Content */}
      {students.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {memoizedStudentCards}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState
          title="No students found"
          description={
            hasActiveFilters
              ? 'Try adjusting your filters to see more results'
              : 'Get started by adding your first student'
          }
          actionLabel="Add Student"
          onAction={handleAddStudent}
        />
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add student"
          onClick={handleAddStudent}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Modals and Dialogs */}
      <StudentFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
        guardians={guardians}
        academicClasses={academicClasses}
        loading={loading}
      />

      <AssignHostelModal
        open={assignHostelModalOpen}
        onClose={() => setAssignHostelModalOpen(false)}
        onSubmit={handleHostelAssignSubmit}
        student={studentForHostelAssignment}
        loading={loading}
      />

      <StudentDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        student={selectedStudent}
        onEdit={handleEditStudent}
        onAssignHostel={handleAssignHostel}
        onRemoveFromHostel={handleRemoveFromHostelClick}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete student ${studentToDelete?.firstName} ${studentToDelete?.lastName}? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />

      <ConfirmDialog
        open={removeFromHostelDialogOpen}
        onClose={() => setRemoveFromHostelDialogOpen(false)}
        onConfirm={handleConfirmRemoveFromHostel}
        title="Remove from Hostel"
        message={`Are you sure you want to remove ${studentToRemoveFromHostel?.firstName} ${studentToRemoveFromHostel?.lastName} from the hostel?`}
        confirmLabel="Remove from Hostel"
        cancelLabel="No"
        severity="warning"
        loading={loading}
      />
    </Box>
  );
});

StudentManagement.displayName = 'StudentManagement';