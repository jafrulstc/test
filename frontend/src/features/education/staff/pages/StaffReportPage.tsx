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
  Divider,
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
  selectStaffState,
  selectStaffs,
  fetchStaffs,
  setFilters,
  setPagination,
} from '~/features/education/staff/store/staffSlice';
import {
  selectGenders,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';
import {
  selectAcademicState,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { exportToCsv } from '~/shared/utils/exportUtils';
import { printTable } from '~/shared/utils/printUtils';
import { formatPhoneNumber } from '~/shared/utils/formatters';
import type { Staff, StaffFilters } from '../types/staffType';


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
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * Staff Report Page Component
 * Displays comprehensive staff data with filtering, export, and print capabilities
 */
const StaffReportPage = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();
  const tableRef = useRef<HTMLTableElement>(null);

  const { loading, filters, pagination } = useAppSelector(selectStaffState);
  const staffs = useAppSelector(selectStaffs);
  const genders = useAppSelector(selectGenders);
  const { subjects, gradeLevels } = useAppSelector(selectAcademicState);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [gradeLevelFilter, setGradeLevelFilter] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);


  //new tab code start
  const [activeTab, setActiveTab] = useState(0);

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
      id: `staff-tab-${index}`,
      'aria-controls': `staff-tabpanel-${index}`,
    };
  };
  //new tab code end

  // Fetch required master data
  useEffect(() => {
    if (genders.length === 0) {
      dispatch(fetchAllSimpleEntities());
    }
    if (subjects.length === 0 || gradeLevels.length === 0) {
      dispatch(fetchAllAcademicEntities());
    }
  }, [dispatch, genders.length, subjects.length, gradeLevels.length]);

  // Update filters when search term or filter values change
  useEffect(() => {
    const newFilters: StaffFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      genderId: genderFilter || undefined,
      subjectId: subjectFilter || undefined,
      gradeLevelId: gradeLevelFilter || undefined,
    };

    // Only dispatch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, statusFilter, genderFilter, subjectFilter, gradeLevelFilter, dispatch, filters]);

  // Fetch staffs when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchStaffs(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  /**
   * Handle refresh data
   */
  const handleRefresh = useCallback(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchStaffs(fetchParams));
    showToast('Staff data refreshed', 'success');
  }, [dispatch, pagination, filters, showToast]);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
    setGenderFilter('');
    setSubjectFilter('');
    setGradeLevelFilter('');
    dispatch(setFilters({}));
  }, [dispatch]);

  /**
   * Get entity name by ID
   */
  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Unknown';
  };

  /**
   * Get multiple entity names by IDs
   */
  const getEntityNames = (entities: any[], ids: string[]): string[] => {
    return ids.map(id => getEntityName(entities, id));
  };

  /**
   * Handle CSV export
   */
  const handleExportCsv = useCallback(() => {
    if (staffs.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }

    const csvData = staffs.map(staff => ({
      'First Name': staff.firstName,
      'Last Name': staff.lastName,
      'Email': staff.emailAddress,
      'Mobile': staff.mobileNumber,
      'Gender': getEntityName(genders, staff.genderId),
      'Status': staff.status,
      'Years of Experience': staff.yearsOfExperience || 'N/A',
      'Subjects': getEntityNames(subjects, staff.subjectIds).join(', '),
      'Grade Levels': getEntityNames(gradeLevels, staff.gradeLevelIds).join(', '),
      'Salary Expectation': staff.salaryExpectation || 'N/A',
      'Joining Date': staff.joiningDate || 'N/A',
      'Created Date': new Date(staff.createdAt).toLocaleDateString(),
    }));

    const filename = `staff-report-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCsv(csvData, filename);
    showToast('Report exported successfully', 'success');
  }, [staffs, genders, subjects, gradeLevels, showToast]);

  /**
   * Handle print report
   */
  const handlePrint = useCallback(() => {
    if (!tableRef.current) {
      showToast('Unable to print report', 'error');
      return;
    }

    const title = 'Staff Report';
    const subtitle = `Generated on ${new Date().toLocaleDateString()} | Total Staffs: ${pagination.total}`;

    printTable(tableRef.current, title, subtitle);
  }, [pagination.total, showToast]);

  /**
   * Get status color
   */
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && staffs.length === 0) {
    return <LoadingSpinner message="Loading staff report..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Staff Report
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive staff Reporting system
        </Typography>
      </Box>

      {/* Tabs Container */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="staff management tabs"
          >
            {/* <Tab label="Staff List" {...a11yProps(0)} /> */}
            <Tab label="Basic Report" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              {/* <Typography variant="h4" fontWeight={700} gutterBottom>
                Staff Report
              </Typography> */}
              <Typography variant="body1" color="text.secondary">
                Comprehensive overview of all staffs with filtering and export capabilities
              </Typography>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Total Staffs
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {pagination.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Active Staffs
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {staffs.filter(t => t.status === 'Active').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="warning.main" gutterBottom>
                      Pending Staffs
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {staffs.filter(t => t.status === 'Pending').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Avg. Experience
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {staffs.length > 0
                        ? Math.round(staffs.reduce((sum, t) => sum + (t.yearsOfExperience || 0), 0) / staffs.length)
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
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Print />}
                    onClick={handlePrint}
                    disabled={staffs.length === 0}
                  >
                    Print Report
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FileDownload />}
                    onClick={handleExportCsv}
                    disabled={staffs.length === 0}
                  >
                    Export CSV
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {/* Search */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search staffs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>

                {/* Status Filter */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Gender Filter */}
                <Grid size={{ xs: 12, md: 2 }}>
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

                {/* Subject Filter */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={subjectFilter}
                      label="Subject"
                      onChange={(e) => setSubjectFilter(e.target.value)}
                    >
                      <MenuItem value="">All Subjects</MenuItem>
                      {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Grade Level Filter */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Grade Level</InputLabel>
                    <Select
                      value={gradeLevelFilter}
                      label="Grade Level"
                      onChange={(e) => setGradeLevelFilter(e.target.value)}
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      {gradeLevels.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          {level.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Clear Filters */}
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

            {/* Report Table */}
            {staffs.length > 0 ? (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table ref={tableRef} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Staff</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Demographics</TableCell>
                        <TableCell>Experience</TableCell>
                        <TableCell>Subjects</TableCell>
                        <TableCell>Grade Levels</TableCell>
                        <TableCell>Salary</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Joining Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {staffs.map((staff) => (
                        <TableRow key={staff.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={staff.photoUrl}
                                sx={{ width: 40, height: 40 }}
                              >
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {staff.firstName} {staff.lastName}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {formatPhoneNumber(staff.mobileNumber)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {staff.emailAddress}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {getEntityName(genders, staff.genderId)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {staff.yearsOfExperience || 0} years
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {getEntityNames(subjects, staff.subjectIds).slice(0, 2).map((subjectName, index) => (
                                <Chip
                                  key={index}
                                  label={subjectName}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))}
                              {staff.subjectIds.length > 2 && (
                                <Chip
                                  label={`+${staff.subjectIds.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                  color="default"
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {getEntityNames(gradeLevels, staff.gradeLevelIds).slice(0, 2).map((levelName, index) => (
                                <Chip
                                  key={index}
                                  label={levelName}
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                />
                              ))}
                              {staff.gradeLevelIds.length > 2 && (
                                <Chip
                                  label={`+${staff.gradeLevelIds.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                  color="default"
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {staff.salaryExpectation
                                ? `৳${staff.salaryExpectation.toLocaleString()}`
                                : 'Not specified'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={staff.status}
                              size="small"
                              color={getStatusColor(staff.status)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {staff.joiningDate
                                ? new Date(staff.joiningDate).toLocaleDateString()
                                : 'Not set'
                              }
                            </Typography>
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

                {/* Report Summary */}
                <Paper sx={{ p: 2, mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {staffs.length} of {pagination.total} staffs
                    {Object.keys(filters).length > 0 && ' (filtered)'}
                  </Typography>
                </Paper>
              </>
            ) : (
              <EmptyState
                title="No staffs found"
                description="No staffs match the current filters. Try adjusting your search criteria."
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

StaffReportPage.displayName = 'StaffReportPage';

export { StaffReportPage };