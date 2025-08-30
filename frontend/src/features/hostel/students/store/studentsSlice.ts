import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  StudentDetail,
  StudentFilters,
  CreateStudentDto,
  UpdateStudentDto,
  AssignHostelDto,
  Guardian,
  AcademicClass,
} from '../types';
import { studentsApi } from '../services/studentsApi';

/**
 * Students slice state interface
 */
export interface StudentsState {
  students: StudentDetail[];
  selectedStudent: StudentDetail | null;
  guardians: Guardian[];
  academicClasses: AcademicClass[];
  loading: boolean;
  error: string | null;
  filters: StudentFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for students slice
 */
const initialState: StudentsState = {
  students: [],
  selectedStudent: null,
  guardians: [],
  academicClasses: [],
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
 * Fetch paginated students with filters
 */
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (params: { page?: number; limit?: number; filters?: StudentFilters }) => {
    const response = await studentsApi.getStudents(params);
    return response;
  },
);

/**
 * Fetch single student by ID
 */
export const fetchStudentById = createAsyncThunk('students/fetchStudentById', async (id: string) => {
  const response = await studentsApi.getStudentById(id);
  return response;
});

/**
 * Create new student
 */
export const createStudent = createAsyncThunk('students/createStudent', async (studentData: CreateStudentDto) => {
  const response = await studentsApi.createStudent(studentData);
  return response;
});

/**
 * Update existing student
 */
export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, data }: { id: string; data: UpdateStudentDto }) => {
    const response = await studentsApi.updateStudent(id, data);
    return response;
  },
);

/**
 * Delete student
 */
export const deleteStudent = createAsyncThunk('students/deleteStudent', async (id: string) => {
  await studentsApi.deleteStudent(id);
  return id;
});

/**
 * Assign hostel to student
 */
export const assignHostel = createAsyncThunk(
  'students/assignHostel',
  async ({ id, data }: { id: string; data: AssignHostelDto }) => {
    const response = await studentsApi.assignHostel(id, data);
    return response;
  },
);

/**
 * Remove student from hostel
 */
export const removeFromHostel = createAsyncThunk('students/removeFromHostel', async (id: string) => {
  const response = await studentsApi.removeFromHostel(id);
  return response;
});

/**
 * Fetch guardians list
 */
export const fetchGuardians = createAsyncThunk('students/fetchGuardians', async () => {
  const response = await studentsApi.getGuardians();
  return response;
});

/**
 * Fetch academic classes list
 */
export const fetchAcademicClasses = createAsyncThunk('students/fetchAcademicClasses', async () => {
  const response = await studentsApi.getAcademicClasses();
  return response;
});

/**
 * Students slice definition
 */
const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    /**
     * Set filters for student list
     */
    setFilters: (state, action: PayloadAction<StudentFilters>) => {
      state.filters = action.payload;
    },
    
    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.filters = {};
    },
    
    /**
     * Set selected student
     */
    setSelectedStudent: (state, action: PayloadAction<StudentDetail | null>) => {
      state.selectedStudent = action.payload;
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

      // Fetch student by ID
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.selectedStudent = action.payload;
      })

      // Create student
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.unshift(action.payload);
      })

      // Update student
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex((student) => student.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = action.payload;
        }
      })

      // Delete student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((student) => student.id !== action.payload);
        if (state.selectedStudent?.id === action.payload) {
          state.selectedStudent = null;
        }
      })

      // Assign hostel
      .addCase(assignHostel.fulfilled, (state, action) => {
        const index = state.students.findIndex((student) => student.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = action.payload;
        }
      })

      // Remove from hostel
      .addCase(removeFromHostel.fulfilled, (state, action) => {
        const index = state.students.findIndex((student) => student.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = action.payload;
        }
      })

      // Fetch guardians
      .addCase(fetchGuardians.fulfilled, (state, action) => {
        state.guardians = action.payload;
      })

      // Fetch academic classes
      .addCase(fetchAcademicClasses.fulfilled, (state, action) => {
        state.academicClasses = action.payload;
      });
  },
});

// Export actions
export const { setFilters, clearFilters, setSelectedStudent, setPagination, clearError } = studentsSlice.actions;

// Export selectors
export const selectStudents = (state: { students: StudentsState }) => state.students.students;
export const selectSelectedStudent = (state: { students: StudentsState }) => state.students.selectedStudent;
export const selectGuardians = (state: { students: StudentsState }) => state.students.guardians;
export const selectAcademicClasses = (state: { students: StudentsState }) => state.students.academicClasses;
export const selectStudentsLoading = (state: { students: StudentsState }) => state.students.loading;
export const selectStudentsError = (state: { students: StudentsState }) => state.students.error;
export const selectStudentsFilters = (state: { students: StudentsState }) => state.students.filters;
export const selectStudentsPagination = (state: { students: StudentsState }) => state.students.pagination;

// Export reducer
export default studentsSlice.reducer;