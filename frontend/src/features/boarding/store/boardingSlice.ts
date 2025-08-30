import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  BoardingPackage,
  PackageChangeHistory,
  MenuItem,
  MealSchedule,
  MealAttendance,
  BoardingBill,
  CookingStaffDutyLog,
  CreateMealScheduleDto,
  CreateMealAttendanceDto,
  CreateBoardingBillDto,
  UpdateMealScheduleDto,
  UpdateMealAttendanceDto,
  UpdateBoardingBillDto,
  MealAttendanceFilters,
  BoardingBillFilters,
} from '~/features/boarding/types/boardingType';
import { boardingApi } from '~/features/boarding/services/boardingApi';

/**
 * Boarding slice state interface
 */
export interface BoardingState {
  // Data


  packageChangeHistory: PackageChangeHistory[];
  mealSchedules: MealSchedule[];
  mealAttendance: MealAttendance[];
  boardingBills: BoardingBill[];
  cookingStaffDutyLogs: CookingStaffDutyLog[];
  
  // UI State
  loading: boolean;
  error: string | null;
  activeSection: 'assignments' | 'attendance' | 'billing' | 'reports';
  filters: {
    attendance: MealAttendanceFilters;
    billing: BoardingBillFilters;
  };
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for boarding slice
 */
const initialState: BoardingState = {
  packageChangeHistory: [],
  mealSchedules: [],
  mealAttendance: [],
  boardingBills: [],
  cookingStaffDutyLogs: [],
  loading: false,
  error: null,
  activeSection: 'assignments',
  filters: {
    attendance: {},
    billing: {},
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks for API operations


// Menu Item operations


// Meal Schedule operations
export const fetchMealSchedules = createAsyncThunk(
  'boarding/fetchMealSchedules',
  async (params: { page?: number; limit?: number; filters?: any } = {}) => {
    return await boardingApi.getMealSchedules(params);
  }
);

export const createMealSchedule = createAsyncThunk(
  'boarding/createMealSchedule',
  async (data: CreateMealScheduleDto) => {
    return await boardingApi.createMealSchedule(data);
  }
);

export const updateMealSchedule = createAsyncThunk(
  'boarding/updateMealSchedule',
  async ({ id, data }: { id: string; data: UpdateMealScheduleDto }) => {
    return await boardingApi.updateMealSchedule(id, data);
  }
);

export const deleteMealSchedule = createAsyncThunk(
  'boarding/deleteMealSchedule',
  async (id: string) => {
    await boardingApi.deleteMealSchedule(id);
    return id;
  }
);

// Meal Attendance operations
export const fetchMealAttendance = createAsyncThunk(
  'boarding/fetchMealAttendance',
  async (params: { page?: number; limit?: number; filters?: MealAttendanceFilters } = {}) => {
    return await boardingApi.getMealAttendance(params);
  }
);

export const createMealAttendance = createAsyncThunk(
  'boarding/createMealAttendance',
  async (data: CreateMealAttendanceDto) => {
    return await boardingApi.createMealAttendance(data);
  }
);

export const updateMealAttendance = createAsyncThunk(
  'boarding/updateMealAttendance',
  async ({ id, data }: { id: string; data: UpdateMealAttendanceDto }) => {
    return await boardingApi.updateMealAttendance(id, data);
  }
);

// Boarding Bill operations
export const fetchBoardingBills = createAsyncThunk(
  'boarding/fetchBoardingBills',
  async (params: { page?: number; limit?: number; filters?: BoardingBillFilters } = {}) => {
    return await boardingApi.getBoardingBills(params);
  }
);

export const createBoardingBill = createAsyncThunk(
  'boarding/createBoardingBill',
  async (data: CreateBoardingBillDto) => {
    return await boardingApi.createBoardingBill(data);
  }
);

export const updateBoardingBill = createAsyncThunk(
  'boarding/updateBoardingBill',
  async ({ id, data }: { id: string; data: UpdateBoardingBillDto }) => {
    return await boardingApi.updateBoardingBill(id, data);
  }
);

export const deleteBoardingBill = createAsyncThunk(
  'boarding/deleteBoardingBill',
  async (id: string) => {
    await boardingApi.deleteBoardingBill(id);
    return id;
  }
);

// Fetch all data for dropdowns


/**
 * Boarding slice definition
 */
const boardingSlice = createSlice({
  name: 'boarding',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<typeof initialState.activeSection>) => {
      state.activeSection = action.payload;
      state.pagination.page = 1; // Reset pagination when changing section
    },
    setFilters: (state, action: PayloadAction<{ section: keyof typeof initialState.filters; filters: any }>) => {
      const { section, filters } = action.payload;
      state.filters[section] = filters;
      state.pagination.page = 1; // Reset pagination when filtering
    },
    clearFilters: (state, action: PayloadAction<keyof typeof initialState.filters>) => {
      state.filters[action.payload] = {};
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Boarding Package Type operations


      // Menu Item operations

      // Meal Schedule operations
      .addCase(fetchMealSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.mealSchedules = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchMealSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meal schedules';
      })
      .addCase(createMealSchedule.fulfilled, (state, action) => {
        state.mealSchedules.unshift(action.payload);
      })
      .addCase(updateMealSchedule.fulfilled, (state, action) => {
        const index = state.mealSchedules.findIndex(schedule => schedule.id === action.payload.id);
        if (index !== -1) {
          state.mealSchedules[index] = action.payload;
        }
      })
      .addCase(deleteMealSchedule.fulfilled, (state, action) => {
        state.mealSchedules = state.mealSchedules.filter(schedule => schedule.id !== action.payload);
      })

      // Meal Attendance operations
      .addCase(fetchMealAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.mealAttendance = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchMealAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meal attendance';
      })
      .addCase(createMealAttendance.fulfilled, (state, action) => {
        state.mealAttendance.unshift(action.payload);
      })
      .addCase(updateMealAttendance.fulfilled, (state, action) => {
        const index = state.mealAttendance.findIndex(attendance => attendance.id === action.payload.id);
        if (index !== -1) {
          state.mealAttendance[index] = action.payload;
        }
      })

      // Boarding Bill operations
      .addCase(fetchBoardingBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingBills.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingBills = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding bills';
      })
      .addCase(createBoardingBill.fulfilled, (state, action) => {
        state.boardingBills.unshift(action.payload);
      })
      .addCase(updateBoardingBill.fulfilled, (state, action) => {
        const index = state.boardingBills.findIndex(bill => bill.id === action.payload.id);
        if (index !== -1) {
          state.boardingBills[index] = action.payload;
        }
      })
      .addCase(deleteBoardingBill.fulfilled, (state, action) => {
        state.boardingBills = state.boardingBills.filter(bill => bill.id !== action.payload);
      })

      // Fetch all data
  },
});

// Export actions
export const {
  setActiveSection,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = boardingSlice.actions;

// Export selectors
export const selectBoardingState = (state: { boarding: BoardingState }) => state.boarding;
export const selectPackageChangeHistory = (state: { boarding: BoardingState }) => state.boarding.packageChangeHistory;
export const selectMealSchedules = (state: { boarding: BoardingState }) => state.boarding.mealSchedules;
export const selectMealAttendance = (state: { boarding: BoardingState }) => state.boarding.mealAttendance;
export const selectBoardingBills = (state: { boarding: BoardingState }) => state.boarding.boardingBills;
export const selectCookingStaffDutyLogs = (state: { boarding: BoardingState }) => state.boarding.cookingStaffDutyLogs;
export const selectBoardingLoading = (state: { boarding: BoardingState }) => state.boarding.loading;
export const selectBoardingError = (state: { boarding: BoardingState }) => state.boarding.error;
export const selectActiveSection = (state: { boarding: BoardingState }) => state.boarding.activeSection;
export const selectBoardingFilters = (state: { boarding: BoardingState }) => state.boarding.filters;
export const selectBoardingPagination = (state: { boarding: BoardingState }) => state.boarding.pagination;

// Export reducer
export default boardingSlice.reducer;