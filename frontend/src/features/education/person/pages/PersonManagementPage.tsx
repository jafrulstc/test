// features/person/pages/PersonManagement.tsx
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
import {
  Add,
  Edit,
  Delete,
  Search,
  Person as PersonIcon,
  Visibility,
  Work,
  Badge,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { tPath } from '~/shared/utils/translateType';
import { useDebounce } from '~/shared/hooks/useDebounce';

import {
  selectPersonState,
  selectPersons,
  fetchPersons,
  deletePerson,
  setFilters,
  setPagination,
} from '~/features/education/person/store/personSlice';

import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
  selectDesignations,
  selectDesignationCategories,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';

import {
  selectNationalities,
  fetchNationalities,
} from '~/features/core/store/geographySlice';

// Person Category (✅ path adjust করুন প্রয়োজনে)
import {
  selectPersonCategories,
  fetchPersonCategories,
} from '~/features/core/store/generalSlice';

import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { PersonDetailsModal } from '~/features/education/person/components/PersonDetailsModal';

import type { Person, PersonFilter } from '~/features/education/person/types/personType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { PersonFormModal } from '../components/personFormModal';

const PersonManagementPage = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectPersonState);
  const people = useAppSelector(selectPersons);

  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const religions = useAppSelector(selectReligions);
  const nationalities = useAppSelector(selectNationalities);

  const personCategories = useAppSelector(selectPersonCategories);
  const designationCategories = useAppSelector(selectDesignationCategories);
  const designations = useAppSelector(selectDesignations);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Master data
  useEffect(() => {
    if (genders.length === 0 || bloodGroups.length === 0 || religions.length === 0) {
      dispatch(fetchAllSimpleEntities());
    }
    if (nationalities.length === 0) {
      dispatch(fetchNationalities({ page: 1, limit: 1000, filters: {} }));
    }
    if (personCategories.length === 0) {
      dispatch(fetchPersonCategories({}));
    }
  }, [
    dispatch,
    genders.length,
    bloodGroups.length,
    religions.length,
    nationalities.length,
    personCategories.length,
  ]);

  // Update filters
  useEffect(() => {
    const newFilters: PersonFilter = {
      // server/mock will use these
      firstName: debouncedSearchTerm || undefined, // (optional) তুমি চাইলে backend এর সাথে match করে search key ব্যবহার করতে পারো
      status: (statusFilter as any) || undefined,
      genderId: genderFilter || undefined,
    //   personCategoryId: categoryFilter || undefined,
    
    };


    
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, statusFilter, genderFilter, categoryFilter, dispatch, filters]);

  // Fetch persons
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchPersons(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  const handleAddNew = useCallback(() => {
    setSelectedPerson(null);
    setFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((person: Person) => {
    setSelectedPerson(person);
    setFormModalOpen(true);
  }, []);

  const handleViewDetails = useCallback((person: Person) => {
    setSelectedPerson(person);
    setDetailsModalOpen(true);
  }, []);

  const handleDelete = useCallback((person: Person) => {
    setPersonToDelete(person);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!personToDelete) return;
    try {
      await dispatch(deletePerson(personToDelete.id)).unwrap();
      showToast(`Person ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setPersonToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete person', 'error');
    }
  }, [personToDelete, dispatch, showToast]);

  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedPerson(null);
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchPersons(fetchParams));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const handleDetailsModalClose = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedPerson(null);
  }, []);

  const getEntityName = (entities: any[], id?: string): string => {
    if (!id) return 'Unknown';
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Unknown';
  };

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

  if (loading && people.length === 0) {
    return <LoadingSpinner message="Loading people..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Person Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage people information (students, staff, guardians, mentors)
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
          size="large"
        >
          Add Person
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
              placeholder="Search by name, email, NID, BRN..."
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

          <Grid size={{xs: 12, md: 3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Person Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Person Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {personCategories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      {people.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Person</TableCell>
                  <TableCell>Parents</TableCell>
                  <TableCell>Category / Designation</TableCell>
                  <TableCell>Demographics</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {people.map((p) => {
                  const catName = getEntityName(personCategories, p.personCategoryId);
                  const isStaff = (catName || '').toLowerCase() === 'staff';
                  const desigCatName = isStaff ? getEntityName(designationCategories, p.designationCategoryId) : '';
                  const desigName = isStaff ? getEntityName(designations, p.designationId) : '';

                  return (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={p.photo || undefined} sx={{ width: 50, height: 50 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {p.firstName} {p.lastName}
                            </Typography>
                            {p.nidNumber && (
                              <Typography variant="caption" color="text.secondary">
                                NID: {p.nidNumber}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="body2">Father: {p.fatherName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Mother: {p.motherName}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Chip
                            icon={<Badge />}
                            label={catName}
                            size="small"
                            variant="outlined"
                          />
                          {isStaff && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {desigCatName && (
                                <Chip label={desigCatName} size="small" variant="outlined" />
                              )}
                              {desigName && (
                                <Chip icon={<Work />} label={desigName} size="small" color="primary" variant="outlined" />
                              )}
                            </Box>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {getEntityName(genders, p.genderId)}
                          </Typography>
                          {p.bloodGroupId && (
                            <Typography variant="body2" color="text.secondary">
                              {getEntityName(bloodGroups, p.bloodGroupId)}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {p.email || 'No email'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {calculateAge(p.dateOfBirth)} years
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={p.status}
                          size="small"
                          color={getStatusColor(p.status)}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(p)}
                          color="info"
                          title="View Details"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(p)}
                          color="primary"
                          title="Edit Person"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(p)}
                          color="error"
                          title="Delete Person"
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
          title="No people found"
          description="No person records available. Add some to get started."
          actionLabel="Add Person"
          onAction={handleAddNew}
        />
      )}

      {/* Person Form Modal */}
      <PersonFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        person={selectedPerson}
      />

      {/* Person Details Modal */}
      <PersonDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        person={selectedPerson}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Person"
        message={`Are you sure you want to delete "${personToDelete?.firstName} ${personToDelete?.lastName}"? This action cannot be undone.`}
        confirmLabel={t(`${tPath.common.delete}`)}
        cancelLabel={t(`${tPath.common.cancel}`)}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

PersonManagementPage.displayName = 'PersonManagementPage';

export { PersonManagementPage };
