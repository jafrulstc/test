import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  StudentLegacyFlat,
  CreateStudentDto,
  UpdateStudentDto,
  StudentFilters,
} from '../types';
import { studentApi } from '../services/studentApi';
import { PersonFilter } from '../../person/types/personType';

/**
 * Student slice state interface
 */
export interface StudentState {
  // Data
  students: StudentLegacyFlat[];
  selectedStudent: StudentLegacyFlat | null;

  // UI State
  loading: boolean;
  error: string | null;
  filters: StudentFilters;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  assignablePersons: { id: string; firstName: string; lastName: string }[];
  assignableLoading: boolean;
  assignableError: string | null;
}

/**
 * Initial state for student slice
 */
const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  assignablePersons: [],
  assignableLoading: false,
  assignableError: null,
};

// Async thunks for API operations

/**
 * Fetch students with pagination and filtering
 */
// export const fetchStudents = createAsyncThunk(
//   'student/fetchStudents',
//   async (params: { page?: number; limit?: number; filters?: StudentFilters } = {}) => {
//     return await studentApi.getStudents(params);
//   }
// );

export const fetchStudents = createAsyncThunk(
  'student/fetchStudents',
  async (params: { page?: number; limit?: number; filters?: StudentFilters; enforceStudentCategory?: boolean } = {}) => {
    return await studentApi.getStudents(params);
  }
);


export const fetchAssignableStudentPersons = createAsyncThunk(
  'student/fetchAssignableStudentPersons',
  async (params: { page?: number; limit?: number; includePersonId?: string } = {}) => {
    // API লেভেলে onlyUnassigned=true ফোর্স করছি
    return await studentApi.getStudentPersons({ ...params, onlyUnassigned: true });
  }
);



export const fetchStudentPersons = createAsyncThunk(
  'student/fetchStudentPersons',
  async (params: { page?: number; limit?: number; filters?: PersonFilter } = {}) => {
    return await studentApi.getStudentPersons(params);
  }
);


/**
 * Fetch student by ID
 */
export const fetchStudentById = createAsyncThunk(
  'student/fetchStudentById',
  async (id: string) => {
    return await studentApi.getStudentById(id);
  }
);

/**
 * Create new student
 */
export const createStudent = createAsyncThunk(
  'student/createStudent',
  async (data: CreateStudentDto) => {
    return await studentApi.createStudent(data);
  }
);

/**
 * Update student
 */
export const updateStudent = createAsyncThunk(
  'student/updateStudent',
  async ({ id, data }: { id: string; data: UpdateStudentDto }) => {
    return await studentApi.updateStudent(id, data);
  }
);

/**
 * Delete student
 */
export const deleteStudent = createAsyncThunk(
  'student/deleteStudent',
  async (id: string) => {
    await studentApi.deleteStudent(id);
    return id;
  }
);

/**
 * Fetch all students for dropdown
 */
export const fetchStudentsForDropdown = createAsyncThunk(
  'student/fetchStudentsForDropdown',
  async () => {
    return await studentApi.getAllStudentsForDropdown();
  }
);

/**
 * Student slice definition
 */
const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<StudentFilters>) => {
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
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch students';
      })

      // fetch assignableStudent
      .addCase(fetchAssignableStudentPersons.pending, (state) => {
        state.assignableLoading = true;
        state.assignableError = null;
      })
      .addCase(fetchAssignableStudentPersons.fulfilled, (state, action) => {
        state.assignableLoading = false;
        state.assignablePersons = action.payload.data.map(p => ({
          id: p.id, firstName: p.firstName, lastName: p.lastName,
        }));
      })
      .addCase(fetchAssignableStudentPersons.rejected, (state, action) => {
        state.assignableLoading = false;
        state.assignableError = action.error.message || 'Failed to load assignable student persons';
      })

      // Fetch student by ID
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch student';
      })

      // Create student
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create student';
      })

      // Update student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(student => student.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update student';
      })

      // Delete student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(student => student.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedStudent?.id === action.payload) {
          state.selectedStudent = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete student';
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearSelectedStudent,
} = studentSlice.actions;

// Export selectors
export const selectStudentState = (state: { student: StudentState }) => state.student;
export const selectStudents = (state: { student: StudentState }) => state.student.students;
export const selectAssignableStudentPersons = (s: { student: StudentState }) => s.student.assignablePersons;
export const selectAssignableStudentPersonsLoading = (s: { student: StudentState }) => s.student.assignableLoading;
export const selectSelectedStudent = (state: { student: StudentState }) => state.student.selectedStudent;
export const selectStudentLoading = (state: { student: StudentState }) => state.student.loading;
export const selectStudentError = (state: { student: StudentState }) => state.student.error;
export const selectStudentFilters = (state: { student: StudentState }) => state.student.filters;
export const selectStudentPagination = (state: { student: StudentState }) => state.student.pagination;

// Export reducer
export default studentSlice.reducer;