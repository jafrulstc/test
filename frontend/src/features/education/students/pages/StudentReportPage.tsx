import React, { useEffect, useState, useRef, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  Card,
  CardContent,
  IconButton,
  Pagination,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Print,
  FileDownload,
  Search,
  FilterList,
  Person,
  Refresh,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectStudentState,
  selectStudents,
  fetchStudents,
  setFilters as setStudentFilters,
  setPagination as setStudentPagination,
} from '../store/studentSlice';
import {
  selectAdmissionState,
  selectAdmissions,
  fetchAdmissions,
  setFilters as setAdmissionFilters,
  setPagination as setAdmissionPagination,
} from '../store/admissionSlice';
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
import {
  selectAcademicYears,
  selectAcademicClasses,
  selectAcademicGroups,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { exportToCsv } from '~/shared/utils/exportUtils';
import { printTable } from '~/shared/utils/printUtils';
import type { Student, StudentFilters, Admission, AdmissionFilters } from '../types';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';

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
      id={`student-report-tabpanel-${index}`}
      aria-labelledby={`student-report-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Student Report Page Component
 * Displays comprehensive student and admission data with filtering, export, and print capabilities
 */
const StudentReportPage = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();
  const studentTableRef = useRef<HTMLTableElement>(null);
  const admissionTableRef = useRef<HTMLTableElement>(null);

  const { loading: studentLoading, filters: studentFilters, pagination: studentPagination } = useAppSelector(selectStudentState);
  const students = useAppSelector(selectStudents);
  const { loading: admissionLoading, filters: admissionFilters, pagination: admissionPagination } = useAppSelector(selectAdmissionState);
  const admissions = useAppSelector(selectAdmissions);
  
  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const religions = useAppSelector(selectReligions);
  const nationalities = useAppSelector(selectNationalities);
  const academicYears = useAppSelector(selectAcademicYears);
  const academicClasses = useAppSelector(selectAcademicClasses);
  const academicGroups = useAppSelector(selectAcademicGroups);

  const [activeTab, setActiveTab] = useState(0);
  
  // Student filters
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('');
  const [studentGenderFilter, setStudentGenderFilter] = useState('');

  // Admission filters
  const [admissionSearchTerm, setAdmissionSearchTerm] = useState('');
  const [admissionStatusFilter, setAdmissionStatusFilter] = useState('');
  const [admissionYearFilter, setAdmissionYearFilter] = useState('');
  const [admissionClassFilter, setAdmissionClassFilter] = useState('');

  const debouncedStudentSearchTerm = useDebounce(studentSearchTerm, 300);
  const debouncedAdmissionSearchTerm = useDebounce(admissionSearchTerm, 300);

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
      id: `student-report-tab-${index}`,
      'aria-controls': `student-report-tabpanel-${index}`,
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
    if (academicYears.length === 0 || academicClasses.length === 0 || academicGroups.length === 0) {
      dispatch(fetchAllAcademicEntities());
    }
  }, [dispatch, genders.length, bloodGroups.length, religions.length, nationalities.length, academicYears.length, academicClasses.length, academicGroups.length]);

  // Update student filters when search term or filter values change
  useEffect(() => {
    if (activeTab !== 0) return;

    const newFilters: StudentFilters = {
      search: debouncedStudentSearchTerm || undefined,
      status: studentStatusFilter || undefined,
      genderId: studentGenderFilter || undefined,
    };

    // Only dispatch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(studentFilters)) {
      dispatch(setStudentFilters(newFilters));
    }
  }, [debouncedStudentSearchTerm, studentStatusFilter, studentGenderFilter, dispatch, studentFilters, activeTab]);

  // Update admission filters when search term or filter values change
  useEffect(() => {
    if (activeTab !== 1) return;

    const newFilters: AdmissionFilters = {
      search: debouncedAdmissionSearchTerm || undefined,
      status: admissionStatusFilter || undefined,
      academicYearId: admissionYearFilter || undefined,
      academicClassId: admissionClassFilter || undefined,
    };

    // Only dispatch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(admissionFilters)) {
      dispatch(setAdmissionFilters(newFilters));
    }
  }, [debouncedAdmissionSearchTerm, admissionStatusFilter, admissionYearFilter, admissionClassFilter, dispatch, admissionFilters, activeTab]);

  // Fetch students when pagination or filters change
  useEffect(() => {
    if (activeTab !== 0) return;

    const fetchParams = {
      page: studentPagination.page,
      limit: studentPagination.limit,
      filters: studentFilters,
    };
    dispatch(fetchStudents(fetchParams));
  }, [studentPagination.page, studentPagination.limit, studentFilters, dispatch, activeTab]);

  // Fetch admissions when pagination or filters change
  useEffect(() => {
    if (activeTab !== 1) return;

    const fetchParams = {
      page: admissionPagination.page,
      limit: admissionPagination.limit,
      filters: admissionFilters,
    };
    dispatch(fetchAdmissions(fetchParams));
  }, [admissionPagination.page, admissionPagination.limit, admissionFilters, dispatch, activeTab]);

  /**
   * Handle student page change
   */
  const handleStudentPageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setStudentPagination({ page }));
  }, [dispatch]);

  /**
   * Handle admission page change
   */
  const handleAdmissionPageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setAdmissionPagination({ page }));
  }, [dispatch]);

  /**
   * Handle refresh data
   */
  const handleRefresh = useCallback(() => {
    if (activeTab === 0) {
      const fetchParams = {
        page: studentPagination.page,
        limit: studentPagination.limit,
        filters: studentFilters,
      };
      dispatch(fetchStudents(fetchParams));
      showToast('Student data refreshed', 'success');
    } else {
      const fetchParams = {
        page: admissionPagination.page,
        limit: admissionPagination.limit,
        filters: admissionFilters,
      };
      dispatch(fetchAdmissions(fetchParams));
      showToast('Admission data refreshed', 'success');
    }
  }, [dispatch, activeTab, studentPagination, studentFilters, admissionPagination, admissionFilters, showToast]);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    if (activeTab === 0) {
      setStudentSearchTerm('');
      setStudentStatusFilter('');
      setStudentGenderFilter('');
      dispatch(setStudentFilters({}));
    } else {
      setAdmissionSearchTerm('');
      setAdmissionStatusFilter('');
      setAdmissionYearFilter('');
      setAdmissionClassFilter('');
      dispatch(setAdmissionFilters({}));
    }
  }, [dispatch, activeTab]);

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

  /**
   * Handle CSV export for students
   */
  const handleStudentExportCsv = useCallback(() => {
    if (students.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }

    const csvData = students.map(student => ({
      'First Name': student.firstName,
      'Last Name': student.lastName,
      'Father Name': student.fatherName,
      'Mother Name': student.motherName,
      'Date of Birth': student.dateOfBirth,
      'Age': calculateAge(student.dateOfBirth),
      'Email': student.email || 'N/A',
      'Gender': getEntityName(genders, student.genderId),
      'Blood Group': student.bloodGroupId ? getEntityName(bloodGroups, student.bloodGroupId) : 'N/A',
      'Religion': student.religionId ? getEntityName(religions, student.religionId) : 'N/A',
      'Nationality': student.nationalityId ? getEntityName(nationalities, student.nationalityId) : 'N/A',
      'NID Number': student.nidNumber || 'N/A',
      'BRN Number': student.brnNumber || 'N/A',
      'Status': student.status,
      'Created Date': new Date(student.createdAt).toLocaleDateString(),
    }));

    const filename = `student-report-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCsv(csvData, filename);
    showToast('Student report exported successfully', 'success');
  }, [students, genders, bloodGroups, religions, nationalities, showToast]);

  /**
   * Handle CSV export for admissions
   */
  const handleAdmissionExportCsv = useCallback(() => {
    if (admissions.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }

    const csvData = admissions.map(admission => ({
      'Admission Number': admission.admissionNumber,
      'Registration Number': admission.registrationNumber || 'N/A',
      'Student Name': admission.student ? `${admission.student.firstName} ${admission.student.lastName}` : 'N/A',
      'Academic Year': getEntityName(academicYears, admission.academicYearId),
      'Academic Class': getEntityName(academicClasses, admission.academicClassId),
      'Academic Group': admission.academicGroupId ? getEntityName(academicGroups, admission.academicGroupId) : 'N/A',
      'Roll Number': admission.rollNumber,
      'Admission Date': new Date(admission.admissionDate).toLocaleDateString(),
      'Admission Fee': admission.admissionFee,
      'Status': admission.status,
      'Created Date': new Date(admission.createdAt).toLocaleDateString(),
    }));

    const filename = `admission-report-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCsv(csvData, filename);
    showToast('Admission report exported successfully', 'success');
  }, [admissions, academicYears, academicClasses, academicGroups, showToast]);

  /**
   * Handle print report
   */
  const handlePrint = useCallback(() => {
    const tableRef = activeTab === 0 ? studentTableRef : admissionTableRef;
    const title = activeTab === 0 ? 'Student Report' : 'Admission Report';
    const total = activeTab === 0 ? studentPagination.total : admissionPagination.total;
    
    if (!tableRef.current) {
      showToast('Unable to print report', 'error');
      return;
    }

    const subtitle = `Generated on ${new Date().toLocaleDateString()} | Total Records: ${total}`;
    printTable(tableRef.current, title, subtitle);
  }, [activeTab, studentPagination.total, admissionPagination.total, showToast]);



  const isLoading = activeTab === 0 ? studentLoading : admissionLoading;
  const hasData = activeTab === 0 ? students.length > 0 : admissions.length > 0;

  if (isLoading && !hasData) {
    return <LoadingSpinner message={`Loading ${activeTab === 0 ? 'student' : 'admission'} report...`} />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Student & Admission Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive reporting system for students and admissions
        </Typography>
      </Box>

      {/* Tabs Container */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="student report tabs"
          >
            <Tab label="Student Report" {...a11yProps(0)} />
            <Tab label="Admission Report" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Student Report Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Total Students
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {studentPagination.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Active Students
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {students.filter(s => s.status === STATUSES_OBJECT.ACTIVE).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="info.main" gutterBottom>
                      Graduated Students
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {students.filter(s => s.status === STATUSES_OBJECT.ARCHIVE).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Avg. Age
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {students.length > 0
                        ? Math.round(students.reduce((sum, s) => sum + calculateAge(s.dateOfBirth), 0) / students.length)
                        : 0} yrs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Filters and Actions */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Filters & Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Print />}
                    onClick={handlePrint}
                    disabled={!hasData}
                  >
                    Print Report
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FileDownload />}
                    onClick={handleStudentExportCsv}
                    disabled={!hasData}
                  >
                    Export CSV
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search students..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={studentStatusFilter}
                      label="Status"
                      onChange={(e) => setStudentStatusFilter(e.target.value)}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.ACTIVE}>Active</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Inactive</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Graduated</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Transferred</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={studentGenderFilter}
                      label="Gender"
                      onChange={(e) => setStudentGenderFilter(e.target.value)}
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

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="text"
                  startIcon={<FilterList />}
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear All Filters
                </Button>
              </Box>
            </Paper>

            {/* Student Report Table */}
            {hasData ? (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table ref={studentTableRef} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Parents</TableCell>
                        <TableCell>Demographics</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={student.studentPhoto}
                                sx={{ width: 40, height: 40 }}
                              >
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
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
                                F: {student.fatherName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                M: {student.motherName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {getEntityName(genders, student.genderId)}
                              </Typography>
                              {student.bloodGroupId && (
                                <Typography variant="caption" color="text.secondary">
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
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(student.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {studentPagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={studentPagination.totalPages}
                      page={studentPagination.page}
                      onChange={handleStudentPageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}

                {/* Report Summary */}
                <Paper sx={{ p: 2, mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {students.length} of {studentPagination.total} students
                    {Object.keys(studentFilters).length > 0 && ' (filtered)'}
                  </Typography>
                </Paper>
              </>
            ) : (
              <EmptyState
                title="No students found"
                description="No students match the current filters. Try adjusting your search criteria."
                actionLabel="Clear Filters"
                onAction={handleClearFilters}
              />
            )}
          </Box>
        </TabPanel>

        {/* Admission Report Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Total Admissions
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {admissionPagination.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Active Admissions
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {admissions.filter(a => a.status === STATUSES_OBJECT.ACTIVE).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="warning.main" gutterBottom>
                      Cancelled Admissions
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {admissions.filter(a => a.status === STATUSES_OBJECT.ARCHIVE).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Total Fees
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      ৳{admissions.reduce((sum, a) => sum + a.admissionFee, 0).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Filters and Actions */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Filters & Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Print />}
                    onClick={handlePrint}
                    disabled={!hasData}
                  >
                    Print Report
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FileDownload />}
                    onClick={handleAdmissionExportCsv}
                    disabled={!hasData}
                  >
                    Export CSV
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search admissions..."
                    value={admissionSearchTerm}
                    onChange={(e) => setAdmissionSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={admissionStatusFilter}
                      label="Status"
                      onChange={(e) => setAdmissionStatusFilter(e.target.value)}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                      <MenuItem value="Transferred">Transferred</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Academic Year</InputLabel>
                    <Select
                      value={admissionYearFilter}
                      label="Academic Year"
                      onChange={(e) => setAdmissionYearFilter(e.target.value)}
                    >
                      <MenuItem value="">All Years</MenuItem>
                      {academicYears.map((year) => (
                        <MenuItem key={year.id} value={year.id}>
                          {year.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Academic Class</InputLabel>
                    <Select
                      value={admissionClassFilter}
                      label="Academic Class"
                      onChange={(e) => setAdmissionClassFilter(e.target.value)}
                    >
                      <MenuItem value="">All Classes</MenuItem>
                      {academicClasses.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="text"
                  startIcon={<FilterList />}
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear All Filters
                </Button>
              </Box>
            </Paper>

            {/* Admission Report Table */}
            {hasData ? (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table ref={admissionTableRef} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Admission #</TableCell>
                        <TableCell>Student</TableCell>
                        <TableCell>Academic Info</TableCell>
                        <TableCell>Roll Number</TableCell>
                        <TableCell>Admission Date</TableCell>
                        <TableCell>Fee</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {admissions.map((admission) => (
                        <TableRow key={admission.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              #{admission.admissionNumber}
                            </Typography>
                            {admission.registrationNumber && (
                              <Typography variant="caption" color="text.secondary">
                                Reg: {admission.registrationNumber}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {admission.student ? 
                                `${admission.student.firstName} ${admission.student.lastName}` : 
                                'Student Info Not Available'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {getEntityName(academicYears, admission.academicYearId)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {getEntityName(academicClasses, admission.academicClassId)}
                                {admission.academicGroupId && ` - ${getEntityName(academicGroups, admission.academicGroupId)}`}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {admission.rollNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(admission.admissionDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              ৳{admission.admissionFee.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={admission.status}
                              size="small"
                              color={getStatusColor(admission.status)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(admission.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {admissionPagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={admissionPagination.totalPages}
                      page={admissionPagination.page}
                      onChange={handleAdmissionPageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}

                {/* Report Summary */}
                <Paper sx={{ p: 2, mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {admissions.length} of {admissionPagination.total} admissions
                    {Object.keys(admissionFilters).length > 0 && ' (filtered)'}
                  </Typography>
                </Paper>
              </>
            ) : (
              <EmptyState
                title="No admissions found"
                description="No admissions match the current filters. Try adjusting your search criteria."
                actionLabel="Clear Filters"
                onAction={handleClearFilters}
              />
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
});

StudentReportPage.displayName = 'StudentReportPage';

export { StudentReportPage };