import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  BoardingAssignment,
  CreateBoardingAssignmentDto,
  UpdateBoardingAssignmentDto,
  BoardingAssignmentFilters,
  AssignmentSummary,
} from '../types/boardingAssignmentType';
import { boardingAssignmentApi } from '../services/boardingAssignmentApi';

/**
 * Boarding Assignment slice state interface
 */
export interface BoardingAssignmentState {
  // Data
  assignments: BoardingAssignment[];
  selectedAssignment: BoardingAssignment | null;
  assignmentSummary: AssignmentSummary | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  filters: BoardingAssignmentFilters;
  activeTab: 'assigned' | 'assign';
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
}

/**
 * Initial state for boarding assignment slice
 */
const initialState: BoardingAssignmentState = {
  assignments: [],
  selectedAssignment: null,
  assignmentSummary: null,
  loading: false,
  error: null,
  filters: {},
  activeTab: 'assigned',
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks for API operations

/**
 * Fetch boarding assignments with pagination and filtering
 */
export const fetchBoardingAssignments = createAsyncThunk(
  'boardingAssignment/fetchBoardingAssignments',
  async (params: { page?: number; limit?: number; filters?: BoardingAssignmentFilters } = {}) => {
    return await boardingAssignmentApi.getBoardingAssignments(params);
  }
);

/**
 * Create new boarding assignment
 */
export const createBoardingAssignment = createAsyncThunk(
  'boardingAssignment/createBoardingAssignment',
  async (data: CreateBoardingAssignmentDto) => {
    return await boardingAssignmentApi.createBoardingAssignment(data);
  }
);

/**
 * Update boarding assignment
 */
export const updateBoardingAssignment = createAsyncThunk(
  'boardingAssignment/updateBoardingAssignment',
  async ({ id, data }: { id: string; data: UpdateBoardingAssignmentDto }) => {
    return await boardingAssignmentApi.updateBoardingAssignment(id, data);
  }
);

/**
 * Delete boarding assignment
 */
export const deleteBoardingAssignment = createAsyncThunk(
  'boardingAssignment/deleteBoardingAssignment',
  async (id: string) => {
    await boardingAssignmentApi.deleteBoardingAssignment(id);
    return id;
  }
);

/**
 * Fetch assignment summary
 */
export const fetchAssignmentSummary = createAsyncThunk(
  'boardingAssignment/fetchAssignmentSummary',
  async () => {
    return await boardingAssignmentApi.getAssignmentSummary();
  }
);

/**
 * Boarding Assignment slice definition
 */
const boardingAssignmentSlice = createSlice({
  name: 'boardingAssignment',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'assigned' | 'assign'>) => {
      state.activeTab = action.payload;
    },
    setFilters: (state, action: PayloadAction<BoardingAssignmentFilters>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset pagination when filtering
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
    clearSelectedAssignment: (state) => {
      state.selectedAssignment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch boarding assignments
      .addCase(fetchBoardingAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding assignments';
      })

      // Create boarding assignment
      .addCase(createBoardingAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoardingAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createBoardingAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create boarding assignment';
      })

      // Update boarding assignment
      .addCase(updateBoardingAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoardingAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex(assignment => assignment.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.selectedAssignment?.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
      })
      .addCase(updateBoardingAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update boarding assignment';
      })

      // Delete boarding assignment
      .addCase(deleteBoardingAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoardingAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const deletedAssignment = state.assignments.find(assignment => assignment.id === action.payload);
        state.assignments = state.assignments.filter(assignment => assignment.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedAssignment?.id === action.payload) {
          state.selectedAssignment = null;
        }
      })
      .addCase(deleteBoardingAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete boarding assignment';
      })

      // Fetch assignment summary
      .addCase(fetchAssignmentSummary.fulfilled, (state, action) => {
        state.assignmentSummary = action.payload;
      });
  },
});

// Export actions
export const {
  setActiveTab,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearSelectedAssignment,
} = boardingAssignmentSlice.actions;

// Export selectors
export const selectBoardingAssignmentState = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment;
export const selectBoardingAssignments = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment.assignments;
export const selectSelectedAssignment = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment.selectedAssignment;
export const selectAssignmentSummary = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment.assignmentSummary;
export const selectBoardingAssignmentLoading = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment.loading;
export const selectBoardingAssignmentError = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment.error;
export const selectBoardingAssignmentFilters = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment.filters;
export const selectActiveTab = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment.activeTab;
export const selectBoardingAssignmentPagination = (state: { boardingAssignment: BoardingAssignmentState }) => state.boardingAssignment.pagination;

// Export reducer
export default boardingAssignmentSlice.reducer;
