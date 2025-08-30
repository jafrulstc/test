import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Room,
  CreateRoomDto,
  UpdateRoomDto,
  CreateBedDto,
  UpdateBedDto,
  RoomFilters,
} from '../types';
import { roomsApi } from '../services/roomsApi';

/**
 * Rooms slice state interface
 */
export interface RoomsState {
  rooms: Room[];
  selectedRoom: Room | null;
  loading: boolean;
  error: string | null;
  filters: RoomFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for rooms slice
 */
const initialState: RoomsState = {
  rooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks for API operations

/**
 * Fetch paginated rooms with filters
 */
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (params: { page?: number; limit?: number; filters?: RoomFilters }) => {
    const response = await roomsApi.getRooms(params);
    return response;
  },
);

/**
 * Fetch single room by ID
 */
export const fetchRoomById = createAsyncThunk('rooms/fetchRoomById', async (id: string) => {
  const response = await roomsApi.getRoomById(id);
  return response;
});

/**
 * Create new room
 */
export const createRoom = createAsyncThunk('rooms/createRoom', async (roomData: CreateRoomDto) => {
  const response = await roomsApi.createRoom(roomData);
  return response;
});

/**
 * Update existing room
 */
export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, data }: { id: string; data: UpdateRoomDto }) => {
    const response = await roomsApi.updateRoom(id, data);
    return response;
  },
);

/**
 * Delete room
 */
export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (id: string) => {
  await roomsApi.deleteRoom(id);
  return id;
});

/**
 * Create new bed
 */
export const createBed = createAsyncThunk('rooms/createBed', async (bedData: CreateBedDto) => {
  const response = await roomsApi.createBed(bedData);
  return response;
});

/**
 * Update existing bed
 */
export const updateBed = createAsyncThunk(
  'rooms/updateBed',
  async ({ id, data }: { id: string; data: UpdateBedDto }) => {
    const response = await roomsApi.updateBed(id, data);
    return response;
  },
);

/**
 * Delete bed
 */
export const deleteBed = createAsyncThunk('rooms/deleteBed', async (id: string) => {
  await roomsApi.deleteBed(id);
  return id;
});

/**
 * Rooms slice definition
 */
const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    /**
     * Set filters for room list
     */
    setFilters: (state, action: PayloadAction<RoomFilters>) => {
      state.filters = action.payload;
    },
    
    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.filters = {};
    },
    
    /**
     * Set selected room
     */
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
    },
    
    /**
     * Update pagination settings
     */
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    /**
     * Clear error state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rooms';
      })

      // Fetch room by ID
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.selectedRoom = action.payload;
      })

      // Create room
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.unshift(action.payload);
      })

      // Update room
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex((room) => room.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
        if (state.selectedRoom?.id === action.payload.id) {
          state.selectedRoom = action.payload;
        }
      })

      // Delete room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
        if (state.selectedRoom?.id === action.payload) {
          state.selectedRoom = null;
        }
      })

      // Create bed
      .addCase(createBed.fulfilled, (state, action) => {
        const room = state.rooms.find((r) => r.id === action.payload.roomId);
        if (room) {
          room.beds.push(action.payload);
        }
        if (state.selectedRoom?.id === action.payload.roomId) {
          state.selectedRoom.beds.push(action.payload);
        }
      })

      // Update bed
      .addCase(updateBed.fulfilled, (state, action) => {
        const room = state.rooms.find((r) => r.id === action.payload.roomId);
        if (room) {
          const bedIndex = room.beds.findIndex((b) => b.id === action.payload.id);
          if (bedIndex !== -1) {
            room.beds[bedIndex] = action.payload;
          }
        }
        if (state.selectedRoom?.id === action.payload.roomId) {
          const bedIndex = state.selectedRoom.beds.findIndex((b) => b.id === action.payload.id);
          if (bedIndex !== -1) {
            state.selectedRoom.beds[bedIndex] = action.payload;
          }
        }
      })

      // Delete bed
      .addCase(deleteBed.fulfilled, (state, action) => {
        state.rooms.forEach((room) => {
          room.beds = room.beds.filter((bed) => bed.id !== action.payload);
        });
        if (state.selectedRoom) {
          state.selectedRoom.beds = state.selectedRoom.beds.filter((bed) => bed.id !== action.payload);
        }
      });
  },
});

// Export actions
export const { setFilters, clearFilters, setSelectedRoom, setPagination, clearError } = roomsSlice.actions;

// Export selectors
export const selectRooms = (state: { rooms: RoomsState }) => state.rooms.rooms;
export const selectSelectedRoom = (state: { rooms: RoomsState }) => state.rooms.selectedRoom;
export const selectRoomsLoading = (state: { rooms: RoomsState }) => state.rooms.loading;
export const selectRoomsError = (state: { rooms: RoomsState }) => state.rooms.error;
export const selectRoomsFilters = (state: { rooms: RoomsState }) => state.rooms.filters;
export const selectRoomsPagination = (state: { rooms: RoomsState }) => state.rooms.pagination;

// Export reducer
export default roomsSlice.reducer;