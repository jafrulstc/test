import React, { useEffect, useState, memo, useCallback } from 'react';
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
  Edit,
  Delete,
  Search,
  Visibility,
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
  selectAssignmentSummary,
  fetchBoardingAssignments,
  fetchAssignmentSummary,
  deleteBoardingAssignment,
  setFilters,
  setPagination,
} from '../store/boardingAssignmentSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { BoardingAssignmentDetailsModal } from './BoardingAssignmentDetailsModal';
import { AssignBoardingModal } from './AssignBoardingModal';
import { formatPhoneNumber } from '~/shared/utils/formatters';
import { getStatusColor } from '~/shared/utils/colors';
import type { BoardingAssignment, BoardingAssignmentFilters } from '../types/boardingAssignmentType';
import { SUCCESS_MESSAGES } from '~/app/constants';

/**
 * Assigned Users Tab Component
 * Displays users who are already assigned to boarding packages
 */
const AssignedUsersTab = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectBoardingAssignmentState);
  const assignments = useAppSelector(selectBoardingAssignments);
  const summary = useAppSelector(selectAssignmentSummary);

  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<BoardingAssignment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<BoardingAssignment | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch assignment summary on component mount
  useEffect(() => {
    dispatch(fetchAssignmentSummary());
  }, [dispatch]);

  // Update filters when search term or filter values change
  useEffect(() => {
    const newFilters: BoardingAssignmentFilters = {
      search: debouncedSearchTerm || undefined,
      userType: userTypeFilter as any || undefined,
      status: statusFilter as any || undefined,
    };

    // Only dispatch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, userTypeFilter, statusFilter, dispatch, filters]);

  // Fetch assignments when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchBoardingAssignments(fetchParams));
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
    dispatch(fetchBoardingAssignments(fetchParams));
    dispatch(fetchAssignmentSummary());
    showToast('Data refreshed successfully', 'success');
  }, [dispatch, pagination, filters, showToast]);

  /**
   * Handle view details
   */
  const handleViewDetails = useCallback((assignment: BoardingAssignment) => {
    setSelectedAssignment(assignment);
    setDetailsModalOpen(true);
  }, []);

  /**
   * Handle edit assignment
   */
  const handleEdit = useCallback((assignment: BoardingAssignment) => {
    setSelectedAssignment(assignment);
    setEditModalOpen(true);
  }, []);

  /**
   * Handle delete assignment
   */
  const handleDelete = useCallback((assignment: BoardingAssignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!assignmentToDelete) return;

    try {
      await dispatch(deleteBoardingAssignment(assignmentToDelete.id)).unwrap();
      showToast(`Boarding Assignment ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
      // Refresh summary after deletion
      dispatch(fetchAssignmentSummary());
    } catch (error: any) {
      showToast(error.message || 'Failed to delete boarding assignment', 'error');
    }
  }, [assignmentToDelete, dispatch, showToast]);

  /**
   * Handle modal close
   */
  const handleDetailsModalClose = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedAssignment(null);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setEditModalOpen(false);
    setSelectedAssignment(null);
    // Refresh data after edit
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchBoardingAssignments(fetchParams));
    dispatch(fetchAssignmentSummary());
  }, [dispatch, pagination, filters]);

  /**
   * Get user type color
   */
  const getUserTypeColor = (userType: string): 'primary' | 'secondary' | 'success' | 'default' => {
    switch (userType) {
      case 'student':
        return 'primary';
      case 'teacher':
        return 'secondary';
      case 'staff':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading && assignments.length === 0) {
    return <LoadingSpinner message="Loading boarding assignments..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Total Assigned
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {summary.totalAssigned}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="info.main" gutterBottom>
                  Students
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {summary.totalStudents}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="secondary.main" gutterBottom>
                  Teachers
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {summary.totalTeachers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Staff
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {summary.totalStaff}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  ৳{summary.totalRevenue.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Avg. Discount
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {summary.averageDiscount.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Assigned Users ({pagination.total})
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
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by user name, email, or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
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

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Assignments Table */}
      {assignments.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell>Assigned Date</TableCell>
                  <TableCell>Original Price</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Final Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={assignment.user?.photoUrl}
                          sx={{ width: 40, height: 40 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {assignment.user?.firstName} {assignment.user?.lastName}
                          </Typography>
                          {assignment.user?.email && (
                            <Typography variant="caption" color="text.secondary">
                              {assignment.user.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={assignment.userType}
                        size="small"
                        color={getUserTypeColor(assignment.userType)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {assignment.fullDayMealPackage?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.fullDayMealPackage?.packageTypeName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(assignment.assignedDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ৳{assignment.originalPrice.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {assignment.discountPercentage}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ৳{assignment.discountAmount.toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        ৳{assignment.finalPrice.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={assignment.status}
                        size="small"
                        color={getStatusColor(assignment.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(assignment)}
                        color="info"
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(assignment)}
                        color="primary"
                        title="Edit Assignment"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(assignment)}
                        color="error"
                        title="Delete Assignment"
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
          title="No boarding assignments found"
          description="No users have been assigned to boarding packages yet."
          actionLabel="Refresh"
          onAction={handleRefresh}
        />
      )}

      {/* Assignment Details Modal */}
      <BoardingAssignmentDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        assignment={selectedAssignment}
      />

      {/* Edit Assignment Modal */}
      <AssignBoardingModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        assignment={selectedAssignment}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Boarding Assignment"
        message={`Are you sure you want to delete the boarding assignment for "${assignmentToDelete?.user?.firstName} ${assignmentToDelete?.user?.lastName}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

AssignedUsersTab.displayName = 'AssignedUsersTab';

export { AssignedUsersTab };