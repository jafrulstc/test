// features/education/teachers/store/teacherSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Teacher,
  TeacherDetail,
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherFilters,
} from '../types/teacherType';
import type { Person } from '~/features/education/person/types/personType';
import { teacherApi } from '../services/teacherApi';

/** ===========================
 * State
 * =========================== */
export interface TeacherState {
  // Data
  teachers: TeacherDetail[];
  selectedTeacher: TeacherDetail | null;

  // Assignable STAFF persons (for Teacher form dropdown)
  assignableTeacherPersons: Person[];
  assignableTeacherPersonsLoading: boolean;

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

const initialState: TeacherState = {
  teachers: [],
  selectedTeacher: null,

  assignableTeacherPersons: [],
  assignableTeacherPersonsLoading: false,

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

// List (paginated) → TeacherDetail[]
export const fetchTeachers = createAsyncThunk(
  'teacher/fetchTeachers',
  async (params: { page?: number; limit?: number; filters?: TeacherFilters } = {}) => {
    return await teacherApi.getTeachers(params);
  }
);

// Single → TeacherDetail
export const fetchTeacherById = createAsyncThunk(
  'teacher/fetchTeacherById',
  async (id: string) => {
    return await teacherApi.getTeacherById(id);
  }
);

// Create → then refetch detail
export const createTeacher = createAsyncThunk(
  'teacher/createTeacher',
  async (data: CreateTeacherDto) => {
    const created: Teacher = await teacherApi.createTeacher(data);
    const detail = await teacherApi.getTeacherById(created.id);
    return detail; // TeacherDetail
  }
);

// Update → then refetch detail
export const updateTeacher = createAsyncThunk(
  'teacher/updateTeacher',
  async ({ id, data }: { id: string; data: UpdateTeacherDto }) => {
    await teacherApi.updateTeacher(id, data);
    const detail = await teacherApi.getTeacherById(id);
    return detail; // TeacherDetail
  }
);

// Delete
export const deleteTeacher = createAsyncThunk(
  'teacher/deleteTeacher',
  async (id: string) => {
    await teacherApi.deleteTeacher(id);
    return id;
  }
);

// Assignable STAFF persons (dropdown)
export const fetchAssignableTeacherPersons = createAsyncThunk(
  'teacher/fetchAssignableTeacherPersons',
  async (params: { page?: number; limit?: number; includePersonId?: string; search?: string } = {}) => {
    const res = await teacherApi.getAssignableTeacherPersons(params);
    return res; // PaginatedResponse<Person>
  }
);

/** ===========================
 * Slice
 * =========================== */
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TeacherFilters>) => {
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
        state.teachers = action.payload.data; // TeacherDetail[]
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
        state.selectedTeacher = action.payload; // TeacherDetail
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
        state.teachers.unshift(action.payload); // TeacherDetail
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
        const idx = state.teachers.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) {
          state.teachers[idx] = action.payload;
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
        state.teachers = state.teachers.filter(t => t.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedTeacher?.id === action.payload) {
          state.selectedTeacher = null;
        }
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete teacher';
      })

      // Assignable teacher persons
      .addCase(fetchAssignableTeacherPersons.pending, (state) => {
        state.assignableTeacherPersonsLoading = true;
      })
      .addCase(fetchAssignableTeacherPersons.fulfilled, (state, action) => {
        state.assignableTeacherPersonsLoading = false;
        state.assignableTeacherPersons = action.payload.data; // Person[]
      })
      .addCase(fetchAssignableTeacherPersons.rejected, (state) => {
        state.assignableTeacherPersonsLoading = false;
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
  clearSelectedTeacher,
} = teacherSlice.actions;

/** ===========================
 * Selectors
 * =========================== */
export const selectTeacherState = (state: { teacher: TeacherState }) => state.teacher;

export const selectTeachers = (state: { teacher: TeacherState }) => state.teacher.teachers; // TeacherDetail[]
export const selectSelectedTeacher = (state: { teacher: TeacherState }) => state.teacher.selectedTeacher; // TeacherDetail | null

export const selectTeacherLoading = (state: { teacher: TeacherState }) => state.teacher.loading;
export const selectTeacherError = (state: { teacher: TeacherState }) => state.teacher.error;

export const selectTeacherFilters = (state: { teacher: TeacherState }) => state.teacher.filters;
export const selectTeacherPagination = (state: { teacher: TeacherState }) => state.teacher.pagination;

// Assignable STAFF persons (dropdown)
export const selectAssignableTeacherPersons = (state: { teacher: TeacherState }) =>
  state.teacher.assignableTeacherPersons;
export const selectAssignableTeacherPersonsLoading = (state: { teacher: TeacherState }) =>
  state.teacher.assignableTeacherPersonsLoading;

/** ===========================
 * Reducer
 * =========================== */
export default teacherSlice.reducer;
