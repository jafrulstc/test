import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Teacher,
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherFilters,
} from '../types/teacherType';
import { teacherApi } from '../services/teacherApi';

/**
 * Teacher slice state interface
 */
export interface TeacherState {
  // Data
  teachers: Teacher[];
  selectedTeacher: Teacher | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  filters: TeacherFilters;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for teacher slice
 */
const initialState: TeacherState = {
  teachers: [],
  selectedTeacher: null,
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
 * Fetch teachers with pagination and filtering
 */
export const fetchTeachers = createAsyncThunk(
  'teacher/fetchTeachers',
  async (params: { page?: number; limit?: number; filters?: TeacherFilters } = {}) => {
    return await teacherApi.getTeachers(params);
  }
);

/**
 * Fetch teacher by ID
 */
export const fetchTeacherById = createAsyncThunk(
  'teacher/fetchTeacherById',
  async (id: string) => {
    return await teacherApi.getTeacherById(id);
  }
);

/**
 * Create new teacher
 */
export const createTeacher = createAsyncThunk(
  'teacher/createTeacher',
  async (data: CreateTeacherDto) => {
    return await teacherApi.createTeacher(data);
  }
);

/**
 * Update teacher
 */
export const updateTeacher = createAsyncThunk(
  'teacher/updateTeacher',
  async ({ id, data }: { id: string; data: UpdateTeacherDto }) => {
    return await teacherApi.updateTeacher(id, data);
  }
);

/**
 * Delete teacher
 */
export const deleteTeacher = createAsyncThunk(
  'teacher/deleteTeacher',
  async (id: string) => {
    await teacherApi.deleteTeacher(id);
    return id;
  }
);

/**
 * Teacher slice definition
 */
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TeacherFilters>) => {
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
    clearSelectedTeacher: (state) => {
      state.selectedTeacher = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teachers';
      })

      // Fetch teacher by ID
      .addCase(fetchTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeacher = action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teacher';
      })

      // Create teacher
      .addCase(createTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create teacher';
      })

      // Update teacher
      .addCase(updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teachers.findIndex(teacher => teacher.id === action.payload.id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
        if (state.selectedTeacher?.id === action.payload.id) {
          state.selectedTeacher = action.payload;
        }
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update teacher';
      })

      // Delete teacher
      .addCase(deleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = state.teachers.filter(teacher => teacher.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedTeacher?.id === action.payload) {
          state.selectedTeacher = null;
        }
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete teacher';
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearSelectedTeacher,
} = teacherSlice.actions;

// Export selectors
export const selectTeacherState = (state: { teacher: TeacherState }) => state.teacher;
export const selectTeachers = (state: { teacher: TeacherState }) => state.teacher.teachers;
export const selectSelectedTeacher = (state: { teacher: TeacherState }) => state.teacher.selectedTeacher;
export const selectTeacherLoading = (state: { teacher: TeacherState }) => state.teacher.loading;
export const selectTeacherError = (state: { teacher: TeacherState }) => state.teacher.error;
export const selectTeacherFilters = (state: { teacher: TeacherState }) => state.teacher.filters;
export const selectTeacherPagination = (state: { teacher: TeacherState }) => state.teacher.pagination;

// Export reducer
export default teacherSlice.reducer;