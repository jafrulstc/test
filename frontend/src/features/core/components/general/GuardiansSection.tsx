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
  selectGuardians,
  setFilters,
  setPagination,
  fetchGuardians,
  deleteGuardian,
} from '~/features/core/store/generalSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { GuardianFormModal } from './GuardianFormModal';
import type { Guardian } from '~/features/core/types/general';
import { SUCCESS_MESSAGES } from '~/app/constants';

/**
 * Guardians section component
 */
const GuardiansSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectGeneralState);
  const guardians = useAppSelector(selectGuardians);

  const [searchTerm, setSearchTerm] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guardianToDelete, setGuardianToDelete] = useState<Guardian | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update filters when search term changes
  useEffect(() => {
    dispatch(setFilters({ ...filters, search: debouncedSearchTerm || undefined }));
  }, [debouncedSearchTerm, dispatch]);

  // Fetch guardians when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchGuardians(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  /**
   * Handle add new guardian
   */
  const handleAddNew = useCallback(() => {
    setSelectedGuardian(null);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle edit guardian
   */
  const handleEdit = useCallback((guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle delete guardian
   */
  const handleDelete = useCallback((guardian: Guardian) => {
    setGuardianToDelete(guardian);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!guardianToDelete) return;

    try {
      await dispatch(deleteGuardian(guardianToDelete.id)).unwrap();
      showToast(`Guardian ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setGuardianToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete guardian', 'error');
    }
  }, [guardianToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedGuardian(null);
  }, []);

  if (loading && guardians.length === 0) {
    return <LoadingSpinner message="Loading guardians..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Guardian Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Guardian
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search guardians by name, email, phone, or occupation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Data Table */}
      {guardians.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Guardian</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Address Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {guardians.map((guardian) => (
                  <TableRow key={guardian.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={guardian.photoUrl}
                          sx={{ width: 40, height: 40 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {guardian.name}
                          </Typography>
                          {guardian.email && (
                            <Typography variant="caption" color="text.secondary">
                              {guardian.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {guardian.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {guardian.occupation || 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={guardian.sameAsPresent ? 'Same as Present' : 'Different Addresses'}
                        size="small"
                        color={guardian.sameAsPresent ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(guardian.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(guardian)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(guardian)}
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
          title="No guardians found"
          description="No guardians available. Add some to get started."
          actionLabel="Add Guardian"
          onAction={handleAddNew}
        />
      )}

      {/* Guardian Form Modal */}
      <GuardianFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        guardian={selectedGuardian}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Guardian"
        message={`Are you sure you want to delete "${guardianToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

GuardiansSection.displayName = 'GuardiansSection';

export { GuardiansSection };
