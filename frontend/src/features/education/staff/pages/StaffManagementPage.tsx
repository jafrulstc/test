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
} from '@mui/material';
import { Add, Edit, Delete, Search, Person, Visibility } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';

import {
  selectStaffState,
  selectStaffs,
  fetchStaffs,
  deleteStaff,
  setFilters,
  setPagination,
} from '../store/staffSlice';

import { selectGenders, fetchAllSimpleEntities } from '~/features/core/store/generalSlice';
import { selectAcademicState, fetchAllAcademicEntities } from '~/features/core/store/academicSlice';

import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { StaffFormModal } from '../components/StaffFormModal';
import { StaffDetailsModal } from '../components/StaffDetailsModal';
import { formatPhoneNumber } from '~/shared/utils/formatters';
import type { StaffDetail, StaffFilters } from '../types/staffType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { tPath } from '~/shared/utils/translateType';

const StaffManagementPage = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectStaffState);
  const staffs = useAppSelector(selectStaffs); // StaffDetail[]
  const genders = useAppSelector(selectGenders);
  const { subjects, gradeLevels } = useAppSelector(selectAcademicState);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffDetail | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffDetail | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // master data
  useEffect(() => {
    if (genders.length === 0) dispatch(fetchAllSimpleEntities());
    if (subjects.length === 0 || gradeLevels.length === 0) dispatch(fetchAllAcademicEntities());
  }, [dispatch, genders.length, subjects.length, gradeLevels.length]);

  // filters sync
  useEffect(() => {
    const newFilters: StaffFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      genderId: genderFilter || undefined,
    };
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, statusFilter, genderFilter, dispatch, filters]);

  // list fetch
  useEffect(() => {
    dispatch(fetchStaffs({ page: pagination.page, limit: pagination.limit, filters }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      dispatch(setPagination({ page }));
    },
    [dispatch],
  );

  const handleAddNew = useCallback(() => {
    setSelectedStaff(null);
    setFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((staff: StaffDetail) => {
    setSelectedStaff(staff);
    setFormModalOpen(true);
  }, []);

  const handleViewDetails = useCallback((staff: StaffDetail) => {
    setSelectedStaff(staff);
    setDetailsModalOpen(true);
  }, []);

  const handleDelete = useCallback((staff: StaffDetail) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!staffToDelete) return;
    try {
      await dispatch(deleteStaff(staffToDelete.id)).unwrap();
      showToast(`Staff ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete staff', 'error');
    }
  }, [staffToDelete, dispatch, showToast]);

  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedStaff(null);
    dispatch(fetchStaffs({ page: pagination.page, limit: pagination.limit, filters }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const handleDetailsModalClose = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedStaff(null);
    dispatch(fetchStaffs({ page: pagination.page, limit: pagination.limit, filters }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const getEntityName = (entities: Array<{ id: string; name: string }>, id?: string): string => {
    if (!id) return 'Unknown';
    const e = entities.find(x => x.id === id);
    return e ? e.name : 'Unknown';
  };

  const getEntityNames = (entities: Array<{ id: string; name: string }>, ids: string[]): string[] =>
    ids.map(id => getEntityName(entities, id));

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'warning';
      case 'PENDING':
        return 'error';
      case 'ARCHIVE':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading && staffs.length === 0) {
    return <LoadingSpinner message="Loading staffs..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Staff Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage staff information and profiles
          </Typography>
        </Box>

        {/* Add opens modal now */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
          size="large"
        >
          Add Staff
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
              placeholder="Search staffs by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="ARCHIVE">ARCHIVE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select value={genderFilter} label="Gender" onChange={(e) => setGenderFilter(e.target.value)}>
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

      {/* Table */}
      {staffs.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Demographics</TableCell>
                  <TableCell>Subjects</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffs.map((staff) => {
                  const name =
                    `${staff.person?.firstName ?? ''} ${staff.person?.lastName ?? ''}`.trim() || 'Unknown';
                  const phone = staff.person?.phone ? formatPhoneNumber(String(staff.person.phone)) : '—';
                  const email = staff.person?.email ?? '—';
                  const genderName =
                    staff.gender?.name ?? getEntityName(genders, staff.person?.genderId);

                  return (
                    <TableRow key={staff.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={staff.person?.photo} sx={{ width: 50, height: 50 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="body2">{phone}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {email}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{genderName}</Typography>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {getEntityNames(subjects, staff.subjectIds).slice(0, 2).map((subjectName, idx) => (
                            <Chip key={idx} label={subjectName} size="small" variant="outlined" color="primary" />
                          ))}
                          {staff.subjectIds.length > 2 && (
                            <Chip label={`+${staff.subjectIds.length - 2}`} size="small" variant="outlined" />
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{staff.yearsOfExperience ?? 0} years</Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={staff.status}
                          size="small"
                          color={getStatusColor(staff.status)}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(staff)}
                          color="info"
                          title="View Details"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(staff)}
                          color="primary"
                          title="Edit Staff"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(staff)}
                          color="error"
                          title="Delete Staff"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
          title="No staffs found"
          description="No staffs available. Add some to get started."
          actionLabel="Add Staff"
          onAction={handleAddNew}
        />
      )}

      {/* Modals */}
      <StaffFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        staff={selectedStaff as any} // NOTE: যদি StaffFormModal বর্তমানে Staff টাইপ আশা করে, আপাতত any কাস্ট। পরে modal টাইপ আপডেট করুন।
      />

      <StaffDetailsModal open={detailsModalOpen} onClose={handleDetailsModalClose} staff={selectedStaff} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff"
        message={`Are you sure you want to delete "${
          `${staffToDelete?.person?.firstName ?? ''} ${staffToDelete?.person?.lastName ?? ''}`.trim()
        }"? This action cannot be undone.`}
        confirmLabel={t(`${tPath.common.delete}`)}
        cancelLabel={t(`${tPath.common.cancel}`)}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

StaffManagementPage.displayName = 'StaffManagementPage';

export { StaffManagementPage };
