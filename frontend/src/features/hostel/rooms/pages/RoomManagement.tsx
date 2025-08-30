import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Fab,
  Pagination,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  createBed,
  updateBed,
  deleteBed,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  selectRooms,
  selectRoomsLoading,
  selectRoomsError,
  selectRoomsFilters,
  selectRoomsPagination,
} from '~/features/hostel/rooms/store/roomsSlice';
import { RoomCard } from '../components/RoomCard';
import { RoomFilterComponent as RoomFilters } from '../components/RoomFilters';
import { RoomFormModal } from '../components/RoomFormModal';
import { RoomDetailsModal } from '../components/RoomDetailsModal';
import { BedFormModal } from '../components/BedFormModal';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import type {
  Room,
  Bed,
  CreateRoomDto,
  UpdateRoomDto,
  CreateBedDto,
  UpdateBedDto,
} from '../types';
import { SUCCESS_MESSAGES } from '~/app/constants';

/**
 * Room Management page component
 * Handles room and bed management operations
 */
const RoomManagement = memo(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  // Redux state
  const rooms = useAppSelector(selectRooms);
  const loading = useAppSelector(selectRoomsLoading);
  const error = useAppSelector(selectRoomsError);
  const filters = useAppSelector(selectRoomsFilters);
  const pagination = useAppSelector(selectRoomsPagination);

  // Local state for modals and dialogs
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Bed management state
  const [bedFormModalOpen, setBedFormModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [bedDeleteDialogOpen, setBedDeleteDialogOpen] = useState(false);
  const [bedToDelete, setBedToDelete] = useState<Bed | null>(null);
  const [roomForBedOperation, setRoomForBedOperation] = useState<Room | null>(null);

  // Fetch rooms on component mount and when dependencies change
  useEffect(() => {
    dispatch(fetchRooms({ page: pagination.page, limit: pagination.limit, filters }));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch, showToast]);

  // Event handlers
  const handleFiltersChange = useCallback(
    (newFilters: typeof filters) => {
      dispatch(setFilters(newFilters));
      dispatch(setPagination({ page: 1 }));
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    dispatch(setPagination({ page: 1 }));
  }, [dispatch]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      dispatch(setPagination({ page }));
    },
    [dispatch],
  );

  // Room handlers
  const handleAddRoom = useCallback(() => {
    setSelectedRoom(null);
    setFormModalOpen(true);
  }, []);

  const handleEditRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
    setFormModalOpen(true);
  }, []);

  const handleDeleteRoom = useCallback((room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  }, []);

  const handleViewDetails = useCallback((room: Room) => {
    setSelectedRoom(room);
    setDetailsModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CreateRoomDto | UpdateRoomDto) => {
      try {
        if (selectedRoom) {
          await dispatch(updateRoom({ id: selectedRoom.id, data: data as UpdateRoomDto })).unwrap();
          showToast(`Room ${selectedRoom.roomNumber} ${SUCCESS_MESSAGES.UPDATED}`, 'success');
        } else {
          const newRoom = await dispatch(createRoom(data as CreateRoomDto)).unwrap();
          showToast(`Room ${newRoom.roomNumber} ${SUCCESS_MESSAGES.CREATED}`, 'success');
        }
        setFormModalOpen(false);
        setSelectedRoom(null);
      } catch (error) {
        showToast(`Failed to ${selectedRoom ? 'update' : 'create'} room`, 'error');
      }
    },
    [dispatch, selectedRoom, showToast],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (roomToDelete) {
      try {
        await dispatch(deleteRoom(roomToDelete.id)).unwrap();
        showToast(`Room ${roomToDelete.roomNumber} ${SUCCESS_MESSAGES.DELETED}`, 'success');
        setDeleteDialogOpen(false);
        setRoomToDelete(null);
      } catch (error) {
        showToast('Failed to delete room', 'error');
      }
    }
  }, [dispatch, roomToDelete, showToast]);

  // Bed handlers
  const handleAddBed = useCallback((room: Room) => {
    setRoomForBedOperation(room);
    setSelectedBed(null);
    setBedFormModalOpen(true);
  }, []);

  const handleEditBed = useCallback(
    (bed: Bed) => {
      const room = rooms.find((r) => r.beds.some((b) => b.id === bed.id));
      if (room) {
        setRoomForBedOperation(room);
        setSelectedBed(bed);
        setBedFormModalOpen(true);
      }
    },
    [rooms],
  );

  const handleDeleteBed = useCallback((bed: Bed) => {
    setBedToDelete(bed);
    setBedDeleteDialogOpen(true);
  }, []);

  const handleBedFormSubmit = useCallback(
    async (data: CreateBedDto | UpdateBedDto) => {
      try {
        if (selectedBed) {
          await dispatch(updateBed({ id: selectedBed.id, data: data as UpdateBedDto })).unwrap();
          showToast(`Bed ${selectedBed.bedNumber} ${SUCCESS_MESSAGES.UPDATED}`, 'success');
        } else {
          const newBed = await dispatch(createBed(data as CreateBedDto)).unwrap();
          showToast(`Bed ${newBed.bedNumber} ${SUCCESS_MESSAGES.CREATED}`, 'success');
        }
        setBedFormModalOpen(false);
        setSelectedBed(null);
        setRoomForBedOperation(null);
      } catch (error) {
        showToast(`Failed to ${selectedBed ? 'update' : 'add'} bed`, 'error');
      }
    },
    [dispatch, selectedBed, showToast],
  );

  const handleConfirmBedDelete = useCallback(async () => {
    if (bedToDelete) {
      try {
        await dispatch(deleteBed(bedToDelete.id)).unwrap();
        showToast(`Bed ${bedToDelete.bedNumber} ${SUCCESS_MESSAGES.DELETED}`, 'success');
        setBedDeleteDialogOpen(false);
        setBedToDelete(null);
      } catch (error) {
        showToast('Failed to delete bed', 'error');
      }
    }
  }, [dispatch, bedToDelete, showToast]);

  // Memoized room cards for performance
  const memoizedRoomCards = useMemo(() => {
    return rooms.map((room) => (
      <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 4', xl: 'span 3' } }} key={room.id}>
        <RoomCard room={room} onEdit={handleEditRoom} onDelete={handleDeleteRoom} onViewDetails={handleViewDetails} />
      </Grid>
    ));
  }, [rooms, handleEditRoom, handleDeleteRoom, handleViewDetails]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  // Loading state
  if (loading && rooms.length === 0) {
    return <LoadingSpinner message="Loading rooms..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('rooms.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage hostel rooms and bed assignments
          </Typography>
        </Box>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddRoom}
            size="large"
            sx={{ borderRadius: 3, px: 3 }}
          >
            {t('rooms.addRoom')}
          </Button>
        )}
      </Box>

      {/* Filters */}
      <RoomFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />

      {/* Content */}
      {rooms.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {memoizedRoomCards}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState
          title={t('rooms.noRoomsFound')}
          description={
            hasActiveFilters
              ? 'Try adjusting your filters to see more results'
              : 'Get started by adding your first room'
          }
          actionLabel={t('rooms.addRoom')}
          onAction={handleAddRoom}
        />
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add room"
          onClick={handleAddRoom}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Modals and Dialogs */}
      <RoomFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        room={selectedRoom}
        loading={loading}
      />

      <RoomDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        room={selectedRoom}
        onEditRoom={handleEditRoom}
        onDeleteRoom={handleDeleteRoom}
        onAddBed={handleAddBed}
        onEditBed={handleEditBed}
        onDeleteBed={handleDeleteBed}
      />

      <BedFormModal
        open={bedFormModalOpen}
        onClose={() => setBedFormModalOpen(false)}
        onSubmit={handleBedFormSubmit}
        bed={selectedBed}
        roomId={roomForBedOperation?.id || ''}
        roomNumber={roomForBedOperation?.roomNumber || ''}
        loading={loading}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete Room"
        message={`Are you sure you want to delete room ${roomToDelete?.roomNumber}? This action cannot be undone and will also delete all beds in this room.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />

      <ConfirmDialog
        open={bedDeleteDialogOpen}
        onClose={() => setBedDeleteDialogOpen(false)}
        onConfirm={handleConfirmBedDelete}
        title="Confirm Delete Bed"
        message={`Are you sure you want to delete bed ${bedToDelete?.bedNumber}? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

RoomManagement.displayName = 'RoomManagement';

export { RoomManagement };