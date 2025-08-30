//code1
import React, { useEffect, useState, memo, useMemo, useCallback } from 'react';
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
  IconButton,
  Pagination,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assignment,
  Search,
  Person,
  Refresh,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectBoardingAssignmentState,
  selectBoardingAssignments,
} from '../store/boardingAssignmentSlice';
import {
  selectStaffs,
  fetchStaffs,
} from '~/features/education/staff/store/staffSlice';
import {
  selectAdmissions,
  fetchAdmissions,
} from '~/features/education/students/store/admissionSlice';
import {
  selectTeachers,
  fetchTeachers,
} from '~/features/education/teachers/store/teacherSlice';
import {
  
  selectDesignations,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';

import {
  selectSubjects,
} from '~/features/core/store/academicSlice'
import {
  selectAcademicState,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { AssignBoardingModal } from './AssignBoardingModal';
import type { AssignableUser } from '../types/boardingAssignmentType';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { getStatusColor } from '~/shared/utils/colors';
import { getUserTypeColor } from '~/features/education/utils/color';

/**
 * Assign Users Tab Component
 * Displays active users who can be assigned to boarding packages
 */
const AssignUsersTab = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading } = useAppSelector(selectBoardingAssignmentState);
  const assignments = useAppSelector(selectBoardingAssignments);
  const staffs = useAppSelector(selectStaffs);
  const admissions = useAppSelector(selectAdmissions);
  const teachers = useAppSelector(selectTeachers);
  const subjects = useAppSelector(selectSubjects);
  const designations = useAppSelector(selectDesignations);
  const { gradeLevels } = useAppSelector(selectAcademicState);

  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AssignableUser | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch required master data
  useEffect(() => {
    if (subjects.length === 0 || designations.length === 0) {
      dispatch(fetchAllSimpleEntities());
    }
    if (gradeLevels.length === 0) {
      dispatch(fetchAllAcademicEntities());
    }
  }, [dispatch, subjects.length, designations.length, gradeLevels.length]);

  // Fetch data from individual slices
  useEffect(() => {
    dispatch(fetchStaffs({ page: 1, limit: 1000, filters: {} }));
    dispatch(fetchAdmissions({ page: 1, limit: 1000, filters: {} }));
    dispatch(fetchTeachers({ page: 1, limit: 1000, filters: {} }));
  }, [dispatch]);

  /**
   * Combine and filter assignable users from different sources
   */
  const assignableUsers = useMemo(() => {
    const users: AssignableUser[] = [];
    const assignedUserIds = new Set(
      assignments
        .filter(a => a.status === STATUSES_OBJECT.ACTIVE)
        .map(a => `${a.userType}-${a.userId}`)
    );

    // Add students from admissions
    admissions
      .filter(admission => admission.status === STATUSES_OBJECT.ACTIVE && admission.student)
      // .filter(admission => admission.status === STATUSES_OBJECT.ACTIVE)
      .forEach(admission => {
        const isAssigned = assignedUserIds.has(`student-${admission.studentId}`);
        users.push({
          id: admission.studentId,
          firstName: admission.student!.firstName,
          lastName: admission.student!.lastName,
          email: undefined,
          photoUrl: admission.student?.studentPhoto,
          userType: 'student',
          status: admission.status,
          isAssigned,
          rollNumber: admission.rollNumber,
          admissionNumber: admission.admissionNumber,
        });
      });

    // Add teachers
    teachers
      .filter(teacher => teacher.status === STATUSES_OBJECT.ACTIVE)
      .forEach(teacher => {
        const isAssigned = assignedUserIds.has(`teacher-${teacher.id}`);
        const teacherSubjects = teacher.subjectIds.map(id => 
          subjects.find(s => s.id === id)?.name || 'Unknown'
        );
        const teacherDesignations = teacher.designationIds.map(id => 
          designations.find(d => d.id === id)?.name || 'Unknown'
        );

        users.push({
          id: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.emailAddress,
          photoUrl: teacher.photoUrl,
          userType: 'teacher',
          status: teacher.status,
          isAssigned,
          yearsOfExperience: teacher.yearsOfExperience,
          subjects: teacherSubjects,
          designations: teacherDesignations,
        });
      });

    // Add staff
    staffs
      .filter(staff => staff.status === STATUSES_OBJECT.ACTIVE)
      .forEach(staff => {
        const isAssigned = assignedUserIds.has(`staff-${staff.id}`);
        const staffDesignations = staff.designationIds.map(id => 
          designations.find(d => d.id === id)?.name || 'Unknown'
        );

        users.push({
          id: staff.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.emailAddress,
          photoUrl: staff.photoUrl,
          userType: 'staff',
          status: staff.status,
          isAssigned,
          yearsOfExperience: staff.yearsOfExperience,
          designations: staffDesignations,
        });
      });

    return users;
  }, [assignments, admissions, teachers, staffs, subjects, designations]);

  /**
   * Filter and paginate assignable users
   */
  const filteredAndPaginatedUsers = useMemo(() => {
    let filtered = assignableUsers.filter(user => !user.isAssigned);

    // Apply search filter
    if (debouncedSearchTerm) {
      const search = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.rollNumber?.toLowerCase().includes(search)
      );
    }

    // Apply user type filter
    if (userTypeFilter) {
      filtered = filtered.filter(user => user.userType === userTypeFilter);
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const data = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages,
      },
    };
  }, [assignableUsers, debouncedSearchTerm, userTypeFilter, currentPage, pageSize]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Handle refresh data
   */
  const handleRefresh = useCallback(() => {
    dispatch(fetchStaffs({ page: 1, limit: 1000, filters: {} }));
    dispatch(fetchAdmissions({ page: 1, limit: 1000, filters: {} }));
    dispatch(fetchTeachers({ page: 1, limit: 1000, filters: {} }));
    showToast('Data refreshed successfully', 'success');
  }, [dispatch, showToast]);

  /**
   * Handle assign user
   */
  const handleAssignUser = useCallback((user: AssignableUser) => {
    setSelectedUser(user);
    setAssignModalOpen(true);
  }, []);

  /**
   * Handle assign modal close
   */
  const handleAssignModalClose = useCallback(() => {
    setAssignModalOpen(false);
    setSelectedUser(null);
    // Refresh assignments to update isAssigned status
    dispatch(fetchStaffs({ page: 1, limit: 1000, filters: {} }));
    dispatch(fetchAdmissions({ page: 1, limit: 1000, filters: {} }));
    dispatch(fetchTeachers({ page: 1, limit: 1000, filters: {} }));
  }, [dispatch]);



  if (loading && filteredAndPaginatedUsers.data.length === 0) {
    return <LoadingSpinner message="Loading assignable users..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Available for Assignment
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {filteredAndPaginatedUsers.pagination.total} users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active users who are not yet assigned to boarding packages
          </Typography>
        </CardContent>
      </Card>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Available Users ({filteredAndPaginatedUsers.pagination.total})
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>User Type</InputLabel>
              <Select
                value={userTypeFilter}
                label="User Type"
                onChange={(e) => setUserTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="student">Students</MenuItem>
                <MenuItem value="teacher">Teachers</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      {filteredAndPaginatedUsers.data.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndPaginatedUsers.data.map((user) => (
                  <TableRow key={`${user.userType}-${user.id}`} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={user.photoUrl}
                          sx={{ width: 40, height: 40 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          {user.email && (
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.userType}
                        size="small"
                        color={getUserTypeColor(user.userType)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        {user.userType === 'student' && (
                          <>
                            <Typography variant="body2">
                              Roll: {user.rollNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Admission: #{user.admissionNumber}
                            </Typography>
                          </>
                        )}
                        {(user.userType === 'teacher' || user.userType === 'staff') && (
                          <>
                            <Typography variant="body2">
                              Experience: {user.yearsOfExperience || 0} years
                            </Typography>
                            {user.subjects && user.subjects.length > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Subjects: {user.subjects.slice(0, 2).join(', ')}
                                {user.subjects.length > 2 && ` +${user.subjects.length - 2}`}
                              </Typography>
                            )}
                            {user.designations && user.designations.length > 0 && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {user.designations.join(', ')}
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        color={getStatusColor(user.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Assignment />}
                        onClick={() => handleAssignUser(user)}
                        disabled={user.isAssigned}
                      >
                        {user.isAssigned ? 'Assigned' : 'Assign'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredAndPaginatedUsers.pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={filteredAndPaginatedUsers.pagination.totalPages}
                page={filteredAndPaginatedUsers.pagination.page}
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
          title="No users available for assignment"
          description="All active users have been assigned to boarding packages or no active users found."
          actionLabel="Refresh"
          onAction={handleRefresh}
        />
      )}

      {/* Assign Boarding Modal */}
      <AssignBoardingModal
        open={assignModalOpen}
        onClose={handleAssignModalClose}
        user={selectedUser}
        mode="create"
      />
    </Box>
  );
});

AssignUsersTab.displayName = 'AssignUsersTab';

export { AssignUsersTab };

//code 2
// import React, { useEffect, useState, memo, useMemo, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   Chip,
//   Avatar,
//   IconButton,
//   Pagination,
//   Card,
//   CardContent,
// } from '@mui/material';
// import {
//   Assignment,
//   Search,
//   Person,
//   Refresh,
// } from '@mui/icons-material';
// import { useTranslation } from 'react-i18next';
// import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
// import { useToastContext } from '~/app/providers/ToastProvider';
// import { useDebounce } from '~/shared/hooks/useDebounce';
// import {
//   selectBoardingAssignmentState,
//   selectBoardingAssignments,
// } from '../store/boardingAssignmentSlice';
// import {
//   selectStaffs,
//   fetchStaffs,
// } from '~/features/education/staff/store/staffSlice';
// import {
//   selectAdmissions,
//   fetchAdmissions,
// } from '~/features/education/students/store/admissionSlice';
// import {
//   selectTeachers,
//   fetchTeachers,
// } from '~/features/education/teachers/store/teacherSlice';
// import {
  
//   selectDesignations,
//   fetchAllSimpleEntities,
// } from '~/features/core/store/generalSlice';

// import {
//   selectSubjects,
// } from '~/features/core/store/academicSlice'
// import {
//   selectAcademicState,
//   fetchAllAcademicEntities,
// } from '~/features/core/store/academicSlice';
// import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
// import { EmptyState } from '~/shared/components/ui/EmptyState';
// import { AssignBoardingModal } from './AssignBoardingModal';
// import type { AssignableUser } from '../types/boardingAssignmentType';
// import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
// import { getStatusColor } from '~/shared/utils/colors';
// import { getUserTypeColor } from '~/features/education/utils/color';

// /**
//  * Assign Users Tab Component
//  * Displays active users who can be assigned to boarding packages
//  */
// const AssignUsersTab = memo(() => {
//   const { t } = useTranslation();
//   const dispatch = useAppDispatch();
//   const { showToast } = useToastContext();

//   const { loading } = useAppSelector(selectBoardingAssignmentState);
//   const assignments = useAppSelector(selectBoardingAssignments);
//   const staffs = useAppSelector(selectStaffs);
//   const admissions = useAppSelector(selectAdmissions);
//   const teachers = useAppSelector(selectTeachers);
//   const subjects = useAppSelector(selectSubjects);
//   const designations = useAppSelector(selectDesignations);
//   const { gradeLevels } = useAppSelector(selectAcademicState);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [userTypeFilter, setUserTypeFilter] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [assignModalOpen, setAssignModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<AssignableUser | null>(null);

//   const debouncedSearchTerm = useDebounce(searchTerm, 300);

//   // Fetch required master data
//   useEffect(() => {
//     if (subjects.length === 0 || designations.length === 0) {
//       dispatch(fetchAllSimpleEntities());
//     }
//     if (gradeLevels.length === 0) {
//       dispatch(fetchAllAcademicEntities());
//     }
//   }, [dispatch, subjects.length, designations.length, gradeLevels.length]);

//   // Fetch data from individual slices
//   useEffect(() => {
//     dispatch(fetchStaffs({ page: 1, limit: 1000, filters: {} }));
//     dispatch(fetchAdmissions({ page: 1, limit: 1000, filters: {} }));
//     dispatch(fetchTeachers({ page: 1, limit: 1000, filters: {} }));
//   }, [dispatch]);

//   /**
//    * Combine and filter assignable users from different sources
//    */
//   const assignableUsers = useMemo(() => {
//     const users: AssignableUser[] = [];
//     const assignedUserIds = new Set(
//       assignments
//         .filter(a => a.status === STATUSES_OBJECT.ACTIVE)
//         .map(a => `${a.userType}-${a.userId}`)
//     );

//     // Add students from admissions
//     admissions
//       .filter(admission => admission.status === STATUSES_OBJECT.ACTIVE && admission.student)
//       // .filter(admission => admission.status === STATUSES_OBJECT.ACTIVE)
//       .forEach(admission => {
//         const isAssigned = assignedUserIds.has(`student-${admission.studentId}`);
//         users.push({
//           id: admission.studentId,
//           firstName: admission.student!.firstName,
//           lastName: admission.student!.lastName,
//           email: undefined,
//           photoUrl: undefined,
//           userType: 'student',
//           status: admission.status,
//           isAssigned,
//           rollNumber: admission.rollNumber,
//           admissionNumber: admission.admissionNumber,
//         });
//       });

//     // Add teachers
//     teachers
//       .filter(teacher => teacher.status === STATUSES_OBJECT.ACTIVE)
//       .forEach(teacher => {
//         const isAssigned = assignedUserIds.has(`teacher-${teacher.id}`);
//         const teacherSubjects = teacher.subjectIds.map(id => 
//           subjects.find(s => s.id === id)?.name || 'Unknown'
//         );
//         const teacherDesignations = teacher.designationIds.map(id => 
//           designations.find(d => d.id === id)?.name || 'Unknown'
//         );

//         users.push({
//           id: teacher.id,
//           firstName: teacher.firstName,
//           lastName: teacher.lastName,
//           email: teacher.emailAddress,
//           photoUrl: teacher.photoUrl,
//           userType: 'teacher',
//           status: teacher.status,
//           isAssigned,
//           yearsOfExperience: teacher.yearsOfExperience,
//           subjects: teacherSubjects,
//           designations: teacherDesignations,
//         });
//       });

//     // Add staff
//     staffs
//       .filter(staff => staff.status === STATUSES_OBJECT.ACTIVE)
//       .forEach(staff => {
//         const isAssigned = assignedUserIds.has(`staff-${staff.id}`);
//         const staffDesignations = staff.designationIds.map(id => 
//           designations.find(d => d.id === id)?.name || 'Unknown'
//         );

//         users.push({
//           id: staff.id,
//           firstName: staff.firstName,
//           lastName: staff.lastName,
//           email: staff.emailAddress,
//           photoUrl: staff.photoUrl,
//           userType: 'staff',
//           status: staff.status,
//           isAssigned,
//           yearsOfExperience: staff.yearsOfExperience,
//           designations: staffDesignations,
//         });
//       });

//     return users;
//   }, [assignments, admissions, teachers, staffs, subjects, designations]);

//   /**
//    * Filter and paginate assignable users
//    */
//   const filteredAndPaginatedUsers = useMemo(() => {
//     let filtered = assignableUsers.filter(user => !user.isAssigned);

//     // Apply search filter
//     if (debouncedSearchTerm) {
//       const search = debouncedSearchTerm.toLowerCase();
//       filtered = filtered.filter(user => 
//         user.firstName.toLowerCase().includes(search) ||
//         user.lastName.toLowerCase().includes(search) ||
//         user.email?.toLowerCase().includes(search) ||
//         user.rollNumber?.toLowerCase().includes(search)
//       );
//     }

//     // Apply user type filter
//     if (userTypeFilter) {
//       filtered = filtered.filter(user => user.userType === userTypeFilter);
//     }

//     // Calculate pagination
//     const total = filtered.length;
//     const totalPages = Math.ceil(total / pageSize);
//     const startIndex = (currentPage - 1) * pageSize;
//     const data = filtered.slice(startIndex, startIndex + pageSize);

//     return {
//       data,
//       pagination: {
//         page: currentPage,
//         limit: pageSize,
//         total,
//         totalPages,
//       },
//     };
//   }, [assignableUsers, debouncedSearchTerm, userTypeFilter, currentPage, pageSize]);

//   /**
//    * Handle page change
//    */
//   const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//   }, []);

//   /**
//    * Handle refresh data
//    */
//   const handleRefresh = useCallback(() => {
//     dispatch(fetchStaffs({ page: 1, limit: 1000, filters: {} }));
//     dispatch(fetchAdmissions({ page: 1, limit: 1000, filters: {} }));
//     dispatch(fetchTeachers({ page: 1, limit: 1000, filters: {} }));
//     showToast('Data refreshed successfully', 'success');
//   }, [dispatch, showToast]);

//   /**
//    * Handle assign user
//    */
//   const handleAssignUser = useCallback((user: AssignableUser) => {
//     setSelectedUser(user);
//     setAssignModalOpen(true);
//   }, []);

//   /**
//    * Handle assign modal close
//    */
//   const handleAssignModalClose = useCallback(() => {
//     setAssignModalOpen(false);
//     setSelectedUser(null);
//     // Refresh assignments to update isAssigned status
//     dispatch(fetchStaffs({ page: 1, limit: 1000, filters: {} }));
//     dispatch(fetchAdmissions({ page: 1, limit: 1000, filters: {} }));
//     dispatch(fetchTeachers({ page: 1, limit: 1000, filters: {} }));
//   }, [dispatch]);



//   if (loading && filteredAndPaginatedUsers.data.length === 0) {
//     return <LoadingSpinner message="Loading assignable users..." />;
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Summary */}
//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" color="primary" gutterBottom>
//             Available for Assignment
//           </Typography>
//           <Typography variant="h4" fontWeight={700}>
//             {filteredAndPaginatedUsers.pagination.total} users
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Active users who are not yet assigned to boarding packages
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h6" fontWeight={600}>
//           Available Users ({filteredAndPaginatedUsers.pagination.total})
//         </Typography>
//         <Button
//           variant="outlined"
//           startIcon={<Refresh />}
//           onClick={handleRefresh}
//           disabled={loading}
//         >
//           Refresh
//         </Button>
//       </Box>

//       {/* Filters */}
//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h6" fontWeight={600} gutterBottom>
//           Filters
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid size={{ xs: 12, md: 8 }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Search by name, email, roll number..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               InputProps={{
//                 startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
//               }}
//             />
//           </Grid>

//           <Grid size={{ xs: 12, md: 4 }}>
//             <FormControl fullWidth size="small">
//               <InputLabel>User Type</InputLabel>
//               <Select
//                 value={userTypeFilter}
//                 label="User Type"
//                 onChange={(e) => setUserTypeFilter(e.target.value)}
//               >
//                 <MenuItem value="">All Types</MenuItem>
//                 <MenuItem value="student">Students</MenuItem>
//                 <MenuItem value="teacher">Teachers</MenuItem>
//                 <MenuItem value="staff">Staff</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Users Table */}
//       {filteredAndPaginatedUsers.data.length > 0 ? (
//         <>
//           <TableContainer component={Paper} variant="outlined">
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>User</TableCell>
//                   <TableCell>Type</TableCell>
//                   <TableCell>Details</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredAndPaginatedUsers.data.map((user) => (
//                   <TableRow key={`${user.userType}-${user.id}`} hover>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Avatar
//                           src={user.photoUrl}
//                           sx={{ width: 40, height: 40 }}
//                         >
//                           <Person />
//                         </Avatar>
//                         <Box>
//                           <Typography variant="body2" fontWeight={500}>
//                             {user.firstName} {user.lastName}
//                           </Typography>
//                           {user.email && (
//                             <Typography variant="caption" color="text.secondary">
//                               {user.email}
//                             </Typography>
//                           )}
//                         </Box>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={user.userType}
//                         size="small"
//                         color={getUserTypeColor(user.userType)}
//                         variant="outlined"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Box>
//                         {user.userType === 'student' && (
//                           <>
//                             <Typography variant="body2">
//                               Roll: {user.rollNumber}
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               Admission: #{user.admissionNumber}
//                             </Typography>
//                           </>
//                         )}
//                         {(user.userType === 'teacher' || user.userType === 'staff') && (
//                           <>
//                             <Typography variant="body2">
//                               Experience: {user.yearsOfExperience || 0} years
//                             </Typography>
//                             {user.subjects && user.subjects.length > 0 && (
//                               <Typography variant="caption" color="text.secondary">
//                                 Subjects: {user.subjects.slice(0, 2).join(', ')}
//                                 {user.subjects.length > 2 && ` +${user.subjects.length - 2}`}
//                               </Typography>
//                             )}
//                             {user.designations && user.designations.length > 0 && (
//                               <Typography variant="caption" color="text.secondary" display="block">
//                                 {user.designations.join(', ')}
//                               </Typography>
//                             )}
//                           </>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={user.status}
//                         size="small"
//                         color={getStatusColor(user.status)}
//                         variant="outlined"
//                       />
//                     </TableCell>
//                     <TableCell align="right">
//                       <Button
//                         variant="contained"
//                         size="small"
//                         startIcon={<Assignment />}
//                         onClick={() => handleAssignUser(user)}
//                         disabled={user.isAssigned}
//                       >
//                         {user.isAssigned ? 'Assigned' : 'Assign'}
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           {filteredAndPaginatedUsers.pagination.totalPages > 1 && (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//               <Pagination
//                 count={filteredAndPaginatedUsers.pagination.totalPages}
//                 page={filteredAndPaginatedUsers.pagination.page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 showFirstButton
//                 showLastButton
//               />
//             </Box>
//           )}
//         </>
//       ) : (
//         <EmptyState
//           title="No users available for assignment"
//           description="All active users have been assigned to boarding packages or no active users found."
//           actionLabel="Refresh"
//           onAction={handleRefresh}
//         />
//       )}

//       {/* Assign Boarding Modal */}
//       <AssignBoardingModal
//         open={assignModalOpen}
//         onClose={handleAssignModalClose}
//         user={selectedUser}
//         mode="create"
//       />
//     </Box>
//   );
// });

// AssignUsersTab.displayName = 'AssignUsersTab';

// export { AssignUsersTab };