// features/education/staff/store/staffSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Staff,
  StaffDetail,
  CreateStaffDto,
  UpdateStaffDto,
  StaffFilters,
} from '../types/staffType';
import type { Person } from '~/features/education/person/types/personType';
import { staffApi } from '../services/staffApi';

/** ===========================
 * State
 * =========================== */
export interface StaffState {
  // Data
  staffs: StaffDetail[];
  selectedStaff: StaffDetail | null;

  // Assignable STAFF persons (for Staff form dropdown)
  assignableStaffPersons: Person[];
  assignableStaffPersonsLoading: boolean;

  // UI State
  loading: boolean;
  error: string | null;
  filters: StaffFilters;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: StaffState = {
  staffs: [],
  selectedStaff: null,

  assignableStaffPersons: [],
  assignableStaffPersonsLoading: false,

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

/** ===========================
 * Thunks (centralized)
 * =========================== */

// List (paginated) → StaffDetail[]
export const fetchStaffs = createAsyncThunk(
  'staff/fetchStaffs',
  async (params: { page?: number; limit?: number; filters?: StaffFilters } = {}) => {
    return await staffApi.getStaffs(params);
  }
);

// Single → StaffDetail
export const fetchStaffById = createAsyncThunk(
  'staff/fetchStaffById',
  async (id: string) => {
    return await staffApi.getStaffById(id);
  }
);

// Create → then refetch detail
export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (data: CreateStaffDto) => {
    const created: Staff = await staffApi.createStaff(data);
    const detail = await staffApi.getStaffById(created.id);
    return detail; // StaffDetail
  }
);

// Update → then refetch detail
export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async ({ id, data }: { id: string; data: UpdateStaffDto }) => {
    await staffApi.updateStaff(id, data);
    const detail = await staffApi.getStaffById(id);
    return detail; // StaffDetail
  }
);

// Delete
export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id: string) => {
    await staffApi.deleteStaff(id);
    return id;
  }
);

// Assignable STAFF persons (dropdown)
export const fetchAssignableStaffPersons = createAsyncThunk(
  'staff/fetchAssignableStaffPersons',
  async (params: { page?: number; limit?: number; includePersonId?: string; search?: string } = {}) => {
    const res = await staffApi.getAssignableStaffPersons(params);
    return res; // PaginatedResponse<Person>
  }
);

/** ===========================
 * Slice
 * =========================== */
const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<StaffFilters>) => {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedStaff: (state) => {
      state.selectedStaff = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch staffs
      .addCase(fetchStaffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffs.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs = action.payload.data; // StaffDetail[]
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchStaffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch staffs';
      })

      // Fetch staff by ID
      .addCase(fetchStaffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStaff = action.payload; // StaffDetail
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch staff';
      })

      // Create staff
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs.unshift(action.payload); // StaffDetail
        state.pagination.total += 1;
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create staff';
      })

      // Update staff
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.staffs.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) {
          state.staffs[idx] = action.payload;
        }
        if (state.selectedStaff?.id === action.payload.id) {
          state.selectedStaff = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update staff';
      })

      // Delete staff
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs = state.staffs.filter(t => t.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedStaff?.id === action.payload) {
          state.selectedStaff = null;
        }
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete staff';
      })

      // Assignable staff persons
      .addCase(fetchAssignableStaffPersons.pending, (state) => {
        state.assignableStaffPersonsLoading = true;
      })
      .addCase(fetchAssignableStaffPersons.fulfilled, (state, action) => {
        state.assignableStaffPersonsLoading = false;
        state.assignableStaffPersons = action.payload.data; // Person[]
      })
      .addCase(fetchAssignableStaffPersons.rejected, (state) => {
        state.assignableStaffPersonsLoading = false;
      });
  },
});

/** ===========================
 * Actions
 * =========================== */
export const {
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearSelectedStaff,
} = staffSlice.actions;

/** ===========================
 * Selectors
 * =========================== */
export const selectStaffState = (state: { staff: StaffState }) => state.staff;

export const selectStaffs = (state: { staff: StaffState }) => state.staff.staffs; // StaffDetail[]
export const selectSelectedStaff = (state: { staff: StaffState }) => state.staff.selectedStaff; // StaffDetail | null

export const selectStaffLoading = (state: { staff: StaffState }) => state.staff.loading;
export const selectStaffError = (state: { staff: StaffState }) => state.staff.error;

export const selectStaffFilters = (state: { staff: StaffState }) => state.staff.filters;
export const selectStaffPagination = (state: { staff: StaffState }) => state.staff.pagination;

// Assignable STAFF persons (dropdown)
export const selectAssignableStaffPersons = (state: { staff: StaffState }) =>
  state.staff.assignableStaffPersons;
export const selectAssignableStaffPersonsLoading = (state: { staff: StaffState }) =>
  state.staff.assignableStaffPersonsLoading;

/** ===========================
 * Reducer
 * =========================== */
export default staffSlice.reducer;
