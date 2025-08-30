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
  IconButton,
  Pagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { tPath } from '~/shared/utils/translateType';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectAdmissionState,
  selectAdmissions,
  fetchAdmissions,
  deleteAdmission,
  setFilters,
  setPagination,
} from '../store/admissionSlice';
import {
  selectAcademicYears,
  selectAcademicClasses,
  selectAcademicGroups,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';

import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { AdmissionDetailsModal } from './AdmissionDetailsModal';
import { AdmissionFormModal } from './AdmissionFormModal';
import type { Admission, AdmissionFilters } from '../types';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';

/**
 * Admission Management Section Component
 * Displays admissions in a table format with CRUD operations
 */
const AdmissionManagementSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectAdmissionState);
  const admissions = useAppSelector(selectAdmissions);
  const academicYears = useAppSelector(selectAcademicYears);
  const academicClasses = useAppSelector(selectAcademicClasses);
  const academicGroups = useAppSelector(selectAcademicGroups);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('');
  const [academicClassFilter, setAcademicClassFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [admissionToDelete, setAdmissionToDelete] = useState<Admission | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (academicYears.length === 0 || academicClasses.length === 0 || academicGroups.length === 0) {
      dispatch(fetchAllAcademicEntities());
    }

  }, [dispatch, academicYears.length, academicClasses.length, academicGroups.length]);

  useEffect(() => {
    const newFilters: AdmissionFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      academicYearId: academicYearFilter || undefined,
      academicClassId: academicClassFilter || undefined,
    };

    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, statusFilter, academicYearFilter, academicClassFilter, dispatch, filters]);

  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchAdmissions(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);


  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);


  const handleAddNew = useCallback(() => {
    setSelectedAdmission(null);
    setFormModalOpen(true);
  }, []);


  const handleEdit = useCallback((admission: Admission) => {
    setSelectedAdmission(admission);
    setFormModalOpen(true);
  }, []);


  const handleViewDetails = useCallback((admission: Admission) => {
    setSelectedAdmission(admission);
    setDetailsModalOpen(true);
  }, []);


  const handleDelete = useCallback((admission: Admission) => {
    setAdmissionToDelete(admission);
    setDeleteDialogOpen(true);
  }, []);


  const handleConfirmDelete = useCallback(async () => {
    if (!admissionToDelete) return;

    try {
      await dispatch(deleteAdmission(admissionToDelete.id)).unwrap();
      showToast(`Admission ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setAdmissionToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete admission', 'error');
    }
  }, [admissionToDelete, dispatch, showToast]);

  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedAdmission(null);
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchAdmissions(fetchParams));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const handleDetailsModalClose = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedAdmission(null);
  }, []);

  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Unknown';
  };

  if (loading && admissions.length === 0) {
    return <LoadingSpinner message="Loading admissions..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Admission Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Admission
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 4}}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by admission number or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid size={{xs: 12, md: 2}}>
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
                {/* <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Transferred">Transferred</MenuItem>                 */}
                <MenuItem value={STATUSES_OBJECT.INACTIVE}>Cancelled</MenuItem>
                <MenuItem value={STATUSES_OBJECT.INACTIVE}>Transferred</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{xs: 12, md: 3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={academicYearFilter}
                label="Academic Year"
                onChange={(e) => setAcademicYearFilter(e.target.value)}
              >
                <MenuItem key="all-years" value="">All Years</MenuItem> {/* Added unique key */}
                {academicYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{xs: 12, md: 3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Academic Class</InputLabel>
              <Select
                value={academicClassFilter}
                label="Academic Class"
                onChange={(e) => setAcademicClassFilter(e.target.value)}
              >
                <MenuItem key="all-classes" value="">All Classes</MenuItem> {/* Added unique key */}
                {academicClasses.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Admissions Table */}
      {admissions.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Admission #</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Academic Info</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Admission Date</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
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
                          {getEntityName(academicYears, admission.academicYearId)} - {getEntityName(academicClasses, admission.academicClassId)}
                        </Typography>
                        {admission.academicGroupId && (
                          <Typography variant="caption" color="text.secondary">
                            Group: {getEntityName(academicGroups, admission.academicGroupId)}
                          </Typography>
                        )}
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
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(admission)}
                        color="info"
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(admission)}
                        color="primary"
                        title="Edit Admission"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(admission)}
                        color="error"
                        title="Delete Admission"
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
          title="No admissions found"
          description="No admissions available. Add some to get started."
          actionLabel="Add Admission"
          onAction={handleAddNew}
        />
      )}

      {/* Admission Form Modal */}
      <AdmissionFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        admission={selectedAdmission}
      />

      {/* Admission Details Modal */}
      <AdmissionDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        admission={selectedAdmission}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Admission"
        message={`Are you sure you want to delete admission #${admissionToDelete?.admissionNumber}? This action cannot be undone.`}
        confirmLabel={t(`${tPath.common.delete}`)}
        cancelLabel={t(`${tPath.common.cancel}`)}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

AdmissionManagementSection.displayName = 'AdmissionManagementSection';

export { AdmissionManagementSection };