import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Admission,
  CreateAdmissionDto,
  UpdateAdmissionDto,
  AdmissionFilters,
  Student, 
} from '../types';
import { admissionApi } from '../services/admissionApi';
import { selectStudents } from './studentSlice';
import { RootState } from '~/app/store/'; 

/**
 * Admission slice state interface
 */
export interface AdmissionState {
  // Data
  admissions: Admission[];
  selectedAdmission: Admission | null;
  nextAdmissionNumber: number;

  // UI State
  loading: boolean;
  error: string | null;
  filters: AdmissionFilters;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for admission slice
 */
const initialState: AdmissionState = {
  admissions: [],
  selectedAdmission: null,
  nextAdmissionNumber: 1,
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
 * Fetch admissions with pagination and filtering
 */
export const fetchAdmissions = createAsyncThunk(
  'admission/fetchAdmissions',
  async (params: { page?: number; limit?: number; filters?: AdmissionFilters } = {}, { getState }) => {
    const response = await admissionApi.getAdmissions(params);

    const allStudents = selectStudents(getState() as RootState);

    const hydratedData = response.data.map(admission => {

      if (admission.student && admission.student.firstName && admission.student.lastName) {
        return admission;
      }
      const student = allStudents.find(s => s.id === admission.studentId);
      return {
        ...admission,
        student: student ? {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
        } as Student : null,
      };
    });

    return { ...response, data: hydratedData };
  }
);

/**
 * Fetch admission by ID
 */
export const fetchAdmissionById = createAsyncThunk(
  'admission/fetchAdmissionById',
  async (id: string, { getState }) => {
    const admission = await admissionApi.getAdmissionById(id);
    const allStudents = selectStudents(getState() as RootState);

    // Fetch করা অ্যাডমিশনে ছাত্রের তথ্য যোগ করা
    if (admission && !admission.student) {
      const student = allStudents.find(s => s.id === admission.studentId);
      return {
        ...admission,
        student: student ? {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
        } as Student : null,
      };
    }
    return admission;
  }
);

/**
 * Create new admission
 */
export const createAdmission = createAsyncThunk(
  'admission/createAdmission',
  async (data: CreateAdmissionDto, { getState }) => {
    const newAdmission = await admissionApi.createAdmission(data);
    const allStudents = selectStudents(getState() as RootState);

    // নতুন তৈরি হওয়া অ্যাডমিশনে ছাত্রের তথ্য যোগ করা
    if (newAdmission && !newAdmission.student) {
      const student = allStudents.find(s => s.id === newAdmission.studentId);
      return {
        ...newAdmission,
        student: student ? {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
        } as Student : null,
      };
    }
    return newAdmission;
  }
);

/**
 * Update admission
 */
export const updateAdmission = createAsyncThunk(
  'admission/updateAdmission',
  async ({ id, data }: { id: string; data: UpdateAdmissionDto }, { getState }) => {
    const updatedAdmission = await admissionApi.updateAdmission(id, data);
    const allStudents = selectStudents(getState() as RootState);

    if (updatedAdmission && !updatedAdmission.student) {
      const student = allStudents.find(s => s.id === updatedAdmission.studentId);
      return {
        ...updatedAdmission,
        student: student ? {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
        } as Student : null,
      };
    }
    return updatedAdmission;
  }
);

/**
 * Delete admission
 */
export const deleteAdmission = createAsyncThunk(
  'admission/deleteAdmission',
  async (id: string) => {
    await admissionApi.deleteAdmission(id);
    return id;
  }
);

/**
 * Fetch next admission number
 */
export const fetchNextAdmissionNumber = createAsyncThunk(
  'admission/fetchNextAdmissionNumber',
  async () => {
    return await admissionApi.getNextAdmissionNumber();
  }
);

/**
 * Admission slice definition
 */
const admissionSlice = createSlice({
  name: 'admission',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<AdmissionFilters>) => {
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
    clearSelectedAdmission: (state) => {
      state.selectedAdmission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admissions
      .addCase(fetchAdmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.admissions = action.payload.data; // এখানে ডেটা ইতিমধ্যেই হাইড্রেটেড
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAdmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch admissions';
      })

      // Fetch admission by ID
      .addCase(fetchAdmissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdmission = action.payload; 
      })
      .addCase(fetchAdmissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch admission';
      })

      // Create admission
      .addCase(createAdmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmission.fulfilled, (state, action) => {
        state.loading = false;
        state.admissions.unshift(action.payload);
        state.pagination.total += 1;
        state.nextAdmissionNumber += 1;
      })
      .addCase(createAdmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create admission';
      })

      // Update admission
      .addCase(updateAdmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmission.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.admissions.findIndex(admission => admission.id === action.payload.id);
        if (index !== -1) {
          state.admissions[index] = action.payload; 
        }
        if (state.selectedAdmission?.id === action.payload.id) {
          state.selectedAdmission = action.payload; 
        }
      })
      .addCase(updateAdmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update admission';
      })

      // Delete admission
      .addCase(deleteAdmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdmission.fulfilled, (state, action) => {
        state.loading = false;
        state.admissions = state.admissions.filter(admission => admission.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedAdmission?.id === action.payload) {
          state.selectedAdmission = null;
        }
      })
      .addCase(deleteAdmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete admission';
      })

      // Fetch next admission number
      .addCase(fetchNextAdmissionNumber.fulfilled, (state, action) => {
        state.nextAdmissionNumber = action.payload;
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearSelectedAdmission,
} = admissionSlice.actions;

// Export selectors
export const selectAdmissionState = (state: { admission: AdmissionState }) => state.admission;
export const selectAdmissions = (state: { admission: AdmissionState }) => state.admission.admissions;
export const selectSelectedAdmission = (state: { admission: AdmissionState }) => state.admission.selectedAdmission;
export const selectNextAdmissionNumber = (state: { admission: AdmissionState }) => state.admission.nextAdmissionNumber;
export const selectAdmissionLoading = (state: { admission: AdmissionState }) => state.admission.loading;
export const selectAdmissionError = (state: { admission: AdmissionState }) => state.admission.error;
export const selectAdmissionFilters = (state: { admission: AdmissionState }) => state.admission.filters;
export const selectAdmissionPagination = (state: { admission: AdmissionState }) => state.admission.pagination;

// Export reducer
export default admissionSlice.reducer;