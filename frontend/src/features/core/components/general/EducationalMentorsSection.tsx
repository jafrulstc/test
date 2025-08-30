import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  Pagination,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { Edit, Delete, Search, Add, Person } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectGeneralState,
  selectEducationalMentors,
  setFilters,
  setPagination,
  fetchEducationalMentors,
  deleteEducationalMentor,
} from '~/features/core/store/generalSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { GuardianFormModal } from './GuardianFormModal';
import type { EducationalMentor } from '~/features/core/types/general';
import { SUCCESS_MESSAGES } from '~/app/constants';

/**
 * Educational Mentors section component
 */
const EducationalMentorsSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectGeneralState);
  const educationalMentors = useAppSelector(selectEducationalMentors);

  const [searchTerm, setSearchTerm] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<EducationalMentor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<EducationalMentor | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update filters when search term changes
  useEffect(() => {
    dispatch(setFilters({ ...filters, search: debouncedSearchTerm || undefined }));
  }, [debouncedSearchTerm, dispatch]);

  // Fetch educational mentors when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchEducationalMentors(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  /**
   * Handle add new mentor
   */
  const handleAddNew = useCallback(() => {
    setSelectedMentor(null);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle edit mentor
   */
  const handleEdit = useCallback((mentor: EducationalMentor) => {
    setSelectedMentor(mentor);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete mentor
   */
  const handleDelete = useCallback((mentor: EducationalMentor) => {
    setMentorToDelete(mentor);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!mentorToDelete) return;

    try {
      await dispatch(deleteEducationalMentor(mentorToDelete.id)).unwrap();
      showToast(`Educational Mentor ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setMentorToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete educational mentor', 'error');
    }
  }, [mentorToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedMentor(null);
  }, []);

  if (loading && educationalMentors.length === 0) {
    return <LoadingSpinner message="Loading educational mentors..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Educational Mentor Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Educational Mentor
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search educational mentors by name, email, phone, or occupation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Data Table */}
      {educationalMentors.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mentor</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Address Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {educationalMentors.map((mentor) => (
                  <TableRow key={mentor.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={mentor.photoUrl}
                          sx={{ width: 40, height: 40 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {mentor.name}
                          </Typography>
                          {mentor.email && (
                            <Typography variant="caption" color="text.secondary">
                              {mentor.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {mentor.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {mentor.occupation || 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={mentor.sameAsPresent ? 'Same as Present' : 'Different Addresses'}
                        size="small"
                        color={mentor.sameAsPresent ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(mentor.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(mentor)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(mentor)}
                        color="error"
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
          title="No educational mentors found"
          description="No educational mentors available. Add some to get started."
          actionLabel="Add Educational Mentor"
          onAction={handleAddNew}
        />
      )}

      {/* Educational Mentor Form Modal */}
      <GuardianFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        guardian={selectedMentor}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Educational Mentor"
        message={`Are you sure you want to delete "${mentorToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

EducationalMentorsSection.displayName = 'EducationalMentorsSection';

export { EducationalMentorsSection };