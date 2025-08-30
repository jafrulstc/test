import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Pagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Visibility,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { tPath } from '~/shared/utils/translateType';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectStudentState,
  selectStudents,
  fetchStudents,
  deleteStudent,
  setFilters,
  setPagination,
} from '../store/studentSlice';
import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';
import {
  selectNationalities,
  fetchNationalities,
} from '~/features/core/store/geographySlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { StudentFormModal } from '../components/StudentFormModal';
import { StudentDetailsModal } from '../components/StudentDetailsModal';
import { AdmissionManagementSection } from '../components/AdmissionManagementSection';
import type { Student, StudentFilters } from '../types';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

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
      id={`student-management-tabpanel-${index}`}
      aria-labelledby={`student-management-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Student Management Page Component
 * Displays students in a table format with CRUD operations
 */
const StudentManagementPage = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectStudentState);
  const students = useAppSelector(selectStudents);
  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const religions = useAppSelector(selectReligions);
  const nationalities = useAppSelector(selectNationalities);

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  /**
   * Handle tab change
   */
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  /**
   * Generate tab props for accessibility
   */
  const a11yProps = (index: number) => {
    return {
      id: `student-management-tab-${index}`,
      'aria-controls': `student-management-tabpanel-${index}`,
    };
  };

  // Fetch required master data
  useEffect(() => {
    if (genders.length === 0 || bloodGroups.length === 0 || religions.length === 0) {
      dispatch(fetchAllSimpleEntities());
    }
    if (nationalities.length === 0) {
      dispatch(fetchNationalities({ page: 1, limit: 1000, filters: {} }));
    }
  }, [dispatch, genders.length, bloodGroups.length, religions.length, nationalities.length]);

  // Update filters when search term or filter values change
  useEffect(() => {
    // Only update filters for students tab
    if (activeTab !== 0) return;

    const newFilters: StudentFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      genderId: genderFilter || undefined,
    };

    // Only dispatch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, statusFilter, genderFilter, dispatch, filters, activeTab]);

  // Fetch students when pagination or filters change
  useEffect(() => {
    // Only fetch students for students tab
    if (activeTab !== 0) return;

    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchStudents(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch, activeTab]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  /**
   * Handle add new student
   */
  const handleAddNew = useCallback(() => {
    setSelectedStudent(null);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle edit student
   */
  const handleEdit = useCallback((student: Student) => {
    setSelectedStudent(student);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle view student details
   */
  const handleViewDetails = useCallback((student: Student) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  }, []);

  /**
   * Handle delete student
   */
  const handleDelete = useCallback((student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!studentToDelete) return;

    try {
      await dispatch(deleteStudent(studentToDelete.id)).unwrap();
      showToast(`Student ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete student', 'error');
    }
  }, [studentToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedStudent(null);
    // Refresh the student list after modal closes to show any updates
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchStudents(fetchParams));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  /**
   * Handle details modal close
   */
  const handleDetailsModalClose = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedStudent(null);
  }, []);

  /**
   * Get entity name by ID
   */
  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Unknown';
  };


  /**
   * Calculate age from date of birth
   */
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading && students.length === 0 && activeTab === 0) {
    return <LoadingSpinner message="Loading students..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Student & Admission Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage student information, profiles, and admissions
          </Typography>
        </Box>
        {activeTab === 0 && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNew}
            disabled={loading}
            size="large"
          >
            Add Student
          </Button>
        )}
      </Box>

      {/* Tabs Container */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="student management tabs"
          >
            <Tab label="Students" {...a11yProps(0)} />
            <Tab label="Admissions" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs: 12, md: 6}}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search students by name, email, NID, or BRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>

                <Grid size={{xs: 12, md: 3}}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.ACTIVE}>Active</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Inactive</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Graduated</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Transferred</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{xs: 12, md: 3}}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={genderFilter}
                      label="Gender"
                      onChange={(e) => setGenderFilter(e.target.value)}
                    >
                      <MenuItem value="">All Genders</MenuItem>
                      {genders.map((gender) => (
                        <MenuItem key={gender.id} value={gender.id}>
                          {gender.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Students Table */}
            {students.length > 0 ? (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Parents</TableCell>
                        <TableCell>Demographics</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={student.studentPhoto}
                                sx={{ width: 50, height: 50 }}
                              >
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={500}>
                                  {student.firstName} {student.lastName}
                                </Typography>
                                {student.nidNumber && (
                                  <Typography variant="caption" color="text.secondary">
                                    NID: {student.nidNumber}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                Father: {student.fatherName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Mother: {student.motherName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {getEntityName(genders, student.genderId)}
                              </Typography>
                              {student.bloodGroupId && (
                                <Typography variant="body2" color="text.secondary">
                                  {getEntityName(bloodGroups, student.bloodGroupId)}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {student.email || 'No email'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {calculateAge(student.dateOfBirth)} years
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={student.status}
                              size="small"
                              color={getStatusColor(student.status)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(student)}
                              color="info"
                              title="View Details"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(student)}
                              color="primary"
                              title="Edit Student"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(student)}
                              color="error"
                              title="Delete Student"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={pagination.totalPages}
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            ) : (
              <EmptyState
                title="No students found"
                description="No students available. Add some to get started."
                actionLabel="Add Student"
                onAction={handleAddNew}
              />
            )}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <AdmissionManagementSection />
          </Box>
        </TabPanel>
      </Paper>

      {/* Student Form Modal */}
      <StudentFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        student={selectedStudent}
      />

      {/* Student Details Modal */}
      <StudentDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        student={selectedStudent}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete "${studentToDelete?.firstName} ${studentToDelete?.lastName}"? This action cannot be undone.`}
        confirmLabel={t(`${tPath.common.delete}`)}
        cancelLabel={t(`${tPath.common.cancel}`)}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

StudentManagementPage.displayName = 'StudentManagementPage';

export { StudentManagementPage };