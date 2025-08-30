import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Nationality,
  Division,
  District,
  Sub_District,
  Post_Office,
  Village,
  CreateNationalityDto,
  CreateDivisionDto,
  CreateDistrictDto,
  CreateSubDistrictDto,
  CreatePostOfficeDto,
  CreateVillageDto,
  UpdateNationalityDto,
  UpdateDivisionDto,
  UpdateDistrictDto,
  UpdateSubDistrictDto,
  UpdatePostOfficeDto,
  UpdateVillageDto,
  GeographyFilters,
  ViewMode,
} from '~/features/core/types/geography';
import type { GeographyEntityType } from '~/app/constants/index'
import { geographyApi } from '~/features/core/services/geographyApi';

/**
 * Geography slice state interface
 */
export interface GeographyState {
  // Data
  nationalities: Nationality[];
  divisions: Division[];
  districts: District[];
  subDistricts: Sub_District[];
  postOffices: Post_Office[];
  villages: Village[];
  
  // UI State
  loading: boolean;
  error: string | null;
  viewMode: ViewMode;
  activeEntity: GeographyEntityType;
  filters: GeographyFilters;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for geography slice
 */
const initialState: GeographyState = {
  nationalities: [],
  divisions: [],
  districts: [],
  subDistricts: [],
  postOffices: [],
  villages: [],
  loading: false,
  error: null,
  viewMode: 'normal',
  activeEntity: 'nationality',
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks for API operations

// Nationality operations
export const fetchNationalities = createAsyncThunk(
  'geography/fetchNationalities',
  async (params: { page?: number; limit?: number; filters?: GeographyFilters } = {}) => {
    return await geographyApi.getNationalities(params);
  }
);

export const createNationality = createAsyncThunk(
  'geography/createNationality',
  async (data: CreateNationalityDto) => {
    return await geographyApi.createNationality(data);
  }
);

export const updateNationality = createAsyncThunk(
  'geography/updateNationality',
  async ({ id, data }: { id: string; data: UpdateNationalityDto }) => {
    return await geographyApi.updateNationality(id, data);
  }
);

export const deleteNationality = createAsyncThunk(
  'geography/deleteNationality',
  async (id: string) => {
    await geographyApi.deleteNationality(id);
    return id;
  }
);

// Division operations
export const fetchDivisions = createAsyncThunk(
  'geography/fetchDivisions',
  async (params: { page?: number; limit?: number; filters?: GeographyFilters } = {}) => {
    return await geographyApi.getDivisions(params);
  }
);

export const createDivision = createAsyncThunk(
  'geography/createDivision',
  async (data: CreateDivisionDto) => {
    return await geographyApi.createDivision(data);
  }
);

export const updateDivision = createAsyncThunk(
  'geography/updateDivision',
  async ({ id, data }: { id: string; data: UpdateDivisionDto }) => {
    return await geographyApi.updateDivision(id, data);
  }
);

export const deleteDivision = createAsyncThunk(
  'geography/deleteDivision',
  async (id: string) => {
    await geographyApi.deleteDivision(id);
    return id;
  }
);

// District operations
export const fetchDistricts = createAsyncThunk(
  'geography/fetchDistricts',
  async (params: { page?: number; limit?: number; filters?: GeographyFilters } = {}) => {
    return await geographyApi.getDistricts(params);
  }
);

export const createDistrict = createAsyncThunk(
  'geography/createDistrict',
  async (data: CreateDistrictDto) => {
    return await geographyApi.createDistrict(data);
  }
);

export const updateDistrict = createAsyncThunk(
  'geography/updateDistrict',
  async ({ id, data }: { id: string; data: UpdateDistrictDto }) => {
    return await geographyApi.updateDistrict(id, data);
  }
);

export const deleteDistrict = createAsyncThunk(
  'geography/deleteDistrict',
  async (id: string) => {
    await geographyApi.deleteDistrict(id);
    return id;
  }
);

// Sub District operations
export const fetchSubDistricts = createAsyncThunk(
  'geography/fetchSubDistricts',
  async (params: { page?: number; limit?: number; filters?: GeographyFilters } = {}) => {
    return await geographyApi.getSubDistricts(params);
  }
);

export const createSubDistrict = createAsyncThunk(
  'geography/createSubDistrict',
  async (data: CreateSubDistrictDto) => {
    return await geographyApi.createSubDistrict(data);
  }
);

export const updateSubDistrict = createAsyncThunk(
  'geography/updateSubDistrict',
  async ({ id, data }: { id: string; data: UpdateSubDistrictDto }) => {
    return await geographyApi.updateSubDistrict(id, data);
  }
);

export const deleteSubDistrict = createAsyncThunk(
  'geography/deleteSubDistrict',
  async (id: string) => {
    await geographyApi.deleteSubDistrict(id);
    return id;
  }
);

// Post Office operations
export const fetchPostOffices = createAsyncThunk(
  'geography/fetchPostOffices',
  async (params: { page?: number; limit?: number; filters?: GeographyFilters } = {}) => {
    return await geographyApi.getPostOffices(params);
  }
);

export const createPostOffice = createAsyncThunk(
  'geography/createPostOffice',
  async (data: CreatePostOfficeDto) => {
    return await geographyApi.createPostOffice(data);
  }
);

export const updatePostOffice = createAsyncThunk(
  'geography/updatePostOffice',
  async ({ id, data }: { id: string; data: UpdatePostOfficeDto }) => {
    return await geographyApi.updatePostOffice(id, data);
  }
);

export const deletePostOffice = createAsyncThunk(
  'geography/deletePostOffice',
  async (id: string) => {
    await geographyApi.deletePostOffice(id);
    return id;
  }
);

// Village operations
export const fetchVillages = createAsyncThunk(
  'geography/fetchVillages',
  async (params: { page?: number; limit?: number; filters?: GeographyFilters } = {}) => {
    return await geographyApi.getVillages(params);
  }
);

export const createVillage = createAsyncThunk(
  'geography/createVillage',
  async (data: CreateVillageDto) => {
    return await geographyApi.createVillage(data);
  }
);

export const updateVillage = createAsyncThunk(
  'geography/updateVillage',
  async ({ id, data }: { id: string; data: UpdateVillageDto }) => {
    return await geographyApi.updateVillage(id, data);
  }
);

export const deleteVillage = createAsyncThunk(
  'geography/deleteVillage',
  async (id: string) => {
    await geographyApi.deleteVillage(id);
    return id;
  }
);

// Fetch all data for tree view
export const fetchAllGeographyData = createAsyncThunk(
  'geography/fetchAllGeographyData',
  async () => {
    return await geographyApi.getAllGeographyData();
  }
);

/**
 * Geography slice definition
 */
const geographySlice = createSlice({
  name: 'geography',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setActiveEntity: (state, action: PayloadAction<GeographyEntityType>) => {
      state.activeEntity = action.payload;
      state.pagination.page = 1; // Reset pagination when changing entity
    },
    setFilters: (state, action: PayloadAction<GeographyFilters>) => {
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
  },
  extraReducers: (builder) => {
    builder
      // Nationality operations
      .addCase(fetchNationalities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNationalities.fulfilled, (state, action) => {
        state.loading = false;
        state.nationalities = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchNationalities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch nationalities';
      })
      .addCase(createNationality.fulfilled, (state, action) => {
        state.nationalities.unshift(action.payload);
      })
      .addCase(updateNationality.fulfilled, (state, action) => {
        const index = state.nationalities.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.nationalities[index] = action.payload;
        }
      })
      .addCase(deleteNationality.fulfilled, (state, action) => {
        state.nationalities = state.nationalities.filter(item => item.id !== action.payload);
      })

      // Division operations
      .addCase(fetchDivisions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDivisions.fulfilled, (state, action) => {
        state.loading = false;
        state.divisions = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchDivisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch divisions';
      })
      .addCase(createDivision.fulfilled, (state, action) => {
        state.divisions.unshift(action.payload);
      })
      .addCase(updateDivision.fulfilled, (state, action) => {
        const index = state.divisions.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.divisions[index] = action.payload;
        }
      })
      .addCase(deleteDivision.fulfilled, (state, action) => {
        state.divisions = state.divisions.filter(item => item.id !== action.payload);
      })

      // District operations
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch districts';
      })
      .addCase(createDistrict.fulfilled, (state, action) => {
        state.districts.unshift(action.payload);
      })
      .addCase(updateDistrict.fulfilled, (state, action) => {
        const index = state.districts.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.districts[index] = action.payload;
        }
      })
      .addCase(deleteDistrict.fulfilled, (state, action) => {
        state.districts = state.districts.filter(item => item.id !== action.payload);
      })

      // Sub District operations
      .addCase(fetchSubDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.subDistricts = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchSubDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sub districts';
      })
      .addCase(createSubDistrict.fulfilled, (state, action) => {
        state.subDistricts.unshift(action.payload);
      })
      .addCase(updateSubDistrict.fulfilled, (state, action) => {
        const index = state.subDistricts.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.subDistricts[index] = action.payload;
        }
      })
      .addCase(deleteSubDistrict.fulfilled, (state, action) => {
        state.subDistricts = state.subDistricts.filter(item => item.id !== action.payload);
      })

      // Post Office operations
      .addCase(fetchPostOffices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostOffices.fulfilled, (state, action) => {
        state.loading = false;
        state.postOffices = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchPostOffices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch post offices';
      })
      .addCase(createPostOffice.fulfilled, (state, action) => {
        state.postOffices.unshift(action.payload);
      })
      .addCase(updatePostOffice.fulfilled, (state, action) => {
        const index = state.postOffices.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.postOffices[index] = action.payload;
        }
      })
      .addCase(deletePostOffice.fulfilled, (state, action) => {
        state.postOffices = state.postOffices.filter(item => item.id !== action.payload);
      })

      // Village operations
      .addCase(fetchVillages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVillages.fulfilled, (state, action) => {
        state.loading = false;
        state.villages = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchVillages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch villages';
      })
      .addCase(createVillage.fulfilled, (state, action) => {
        state.villages.unshift(action.payload);
      })
      .addCase(updateVillage.fulfilled, (state, action) => {
        const index = state.villages.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.villages[index] = action.payload;
        }
      })
      .addCase(deleteVillage.fulfilled, (state, action) => {
        state.villages = state.villages.filter(item => item.id !== action.payload);
      })

      // Fetch all data for tree view
      .addCase(fetchAllGeographyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGeographyData.fulfilled, (state, action) => {
        state.loading = false;
        state.nationalities = action.payload.nationalities;
        state.divisions = action.payload.divisions;
        state.districts = action.payload.districts;
        state.subDistricts = action.payload.subDistricts;
        state.postOffices = action.payload.postOffices;
        state.villages = action.payload.villages;
      })
      .addCase(fetchAllGeographyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch geography data';
      });
  },
});

// Export actions
export const {
  setViewMode,
  setActiveEntity,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = geographySlice.actions;

// Export selectors
export const selectGeographyState = (state: { geography: GeographyState }) => state.geography;
export const selectNationalities = (state: { geography: GeographyState }) => state.geography.nationalities;
export const selectDivisions = (state: { geography: GeographyState }) => state.geography.divisions;
export const selectDistricts = (state: { geography: GeographyState }) => state.geography.districts;
export const selectSubDistricts = (state: { geography: GeographyState }) => state.geography.subDistricts;
export const selectPostOffices = (state: { geography: GeographyState }) => state.geography.postOffices;
export const selectVillages = (state: { geography: GeographyState }) => state.geography.villages;
export const selectGeographyLoading = (state: { geography: GeographyState }) => state.geography.loading;
export const selectGeographyError = (state: { geography: GeographyState }) => state.geography.error;
export const selectViewMode = (state: { geography: GeographyState }) => state.geography.viewMode;
export const selectActiveEntity = (state: { geography: GeographyState }) => state.geography.activeEntity;
export const selectGeographyFilters = (state: { geography: GeographyState }) => state.geography.filters;
export const selectGeographyPagination = (state: { geography: GeographyState }) => state.geography.pagination;

// Export reducer
export default geographySlice.reducer;