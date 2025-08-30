import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import { masterBoardingApi } from '~/features/boarding/core/services/masterBoardingApi';
import {
  BoardingPackageType,
  BoardingPackageTypeFilters,
  CreateBoardingPackageTypeDto,
  UpdateBoardingPackageTypeDto,
  BoardingMenuCategory,
  BoardingMenuCategoryFilters,
  CreateBoardingMenuCategoryDto,
  UpdateBoardingMenuCategoryDto,
  BoardingSubMenuCategory,
  BoardingSubMenuCategoryFilters,
  CreateBoardingSubMenuCategoryDto,
  UpdateBoardingSubMenuCategoryDto,
  BoardingMealType,
  BoardingMealTypeFilters,
  CreateBoardingMealTypeDto,
  UpdateBoardingMealTypeDto,
  BoardingMenuItem,
  BoardingMenuItemFilters,
  CreateBoardingMenuItemDto,
  UpdateBoardingMenuItemDto,
  BoardingPackage,
  BoardingPackageFilters,
  CreateBoardingPackageDto,
  UpdateBoardingPackageDto,
  BoardingPackageMenuItem,
  CreateBoardingPackageMenuItemDto,
  // UpdateBoardingPackageMenuItemDto, // এই DTO সম্ভবত ব্যবহৃত হচ্ছে না, schema এও নেই
  BoardingPackageMenuItemFilters,
  UpdateBoardingPackageMenuItemDto, // নতুন ইম্পোর্ট
  BoardingMealPackageFilters,
  CreateBoardingMealPackageDto,
  UpdateBoardingMealPackageDto,
  FullDayMealPackage,
  FullDayMealPackageFilters,
  CreateFullDayMealPackageDto,
  UpdateFullDayMealPackageDto,
} from '~/features/boarding/core/types/masterBoardingType';
import { UI_CONSTANTS } from '~/app/constants';

/**
 * Boarding slice state interface
 */
export interface MasterBoardingState {
  // Data
  boardingPackageTypes: BoardingPackageType[];
  boardingMenuCategories: BoardingMenuCategory[];
  boardingSubMenuCategories: BoardingSubMenuCategory[];
  boardingMealTypes: BoardingMealType[];
  boardingMenuItems: BoardingMenuItem[];
  boardingPackages: BoardingPackage[];
  boardingPackageMenuItems: BoardingPackageMenuItem[];
  fullDayMealPackages: FullDayMealPackage[];
  // UI State
  loading: boolean;
  error: string | null;
  activeSection: 'packageTypes' | 'packages' | 'menu';
  filters: {
    packageTypes: BoardingPackageTypeFilters;
    menuCategories: BoardingMenuCategoryFilters;
    subMenuCategories: BoardingSubMenuCategoryFilters;
    mealTypes: BoardingMealTypeFilters;
    menuItems: BoardingMenuItemFilters;
    packages: BoardingPackageFilters;
    packageMenuItems: BoardingPackageMenuItemFilters; // টাইপ আপডেট করা হয়েছে
    mealPackages: BoardingMealPackageFilters;
    fullDayMealPackages: FullDayMealPackageFilters;
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
const initialState: MasterBoardingState = {
  boardingPackageTypes: [],
  boardingMenuCategories: [],
  boardingSubMenuCategories: [],
  boardingMealTypes: [],
  boardingMenuItems: [],
  boardingPackages: [],
  boardingPackageMenuItems: [],
  fullDayMealPackages: [],
  loading: false,
  error: null,
  activeSection: 'packageTypes',
  filters: {
    packageTypes: {},
    menuCategories: {},
    subMenuCategories: {},
    mealTypes: {},
    menuItems: {},
    packages: {},
    packageMenuItems: {}, // প্রাথমিক মান খালি অবজেক্টই থাকবে, টাইপ উপরে সংজ্ঞায়িত
    mealPackages: {},
    fullDayMealPackages: {},
  },
  pagination: {
    page: 1,
    limit: UI_CONSTANTS.PAGINATION_LIMIT,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks for API operations

// Boarding Package Type operations (এগুলো অপরিবর্তিত থাকবে, API কল ব্যবহার করবে)
export const fetchBoardingPackageTypes = createAsyncThunk(
  'boarding/fetchBoardingPackageTypes',
  async (params: { page?: number; limit?: number; filters?: BoardingPackageTypeFilters } = {}) => {
    return await masterBoardingApi.getBoardingPackageTypes(params);
  }
);

export const createBoardingPackageType = createAsyncThunk(
  'boarding/createBoardingPackageType',
  async (data: CreateBoardingPackageTypeDto) => {
    return await masterBoardingApi.createBoardingPackageType(data);
  }
);

export const updateBoardingPackageType = createAsyncThunk(
  'boarding/updateBoardingPackageType',
  async ({ id, data }: { id: string; data: UpdateBoardingPackageTypeDto }) => {
    return await masterBoardingApi.updateBoardingPackageType(id, data);
  }
);

export const deleteBoardingPackageType = createAsyncThunk(
  'boarding/deleteBoardingPackageType',
  async (id: string) => {
    await masterBoardingApi.deleteBoardingPackageType(id);
    return id; // Return the ID of the deleted item
  }
);

// Boarding Menu Category operations (এগুলো অপরিবর্তিত থাকবে, API কল ব্যবহার করবে)
export const fetchBoardingMenuCategories = createAsyncThunk(
  'boarding/fetchBoardingMenuCategories',
  async (params: { page?: number; limit?: number; filters?: BoardingMenuCategoryFilters } = {}) => {
    return await masterBoardingApi.getBoardingMenuCategories(params);
  }
);

export const createBoardingMenuCategory = createAsyncThunk(
  'boarding/createBoardingMenuCategory',
  async (data: CreateBoardingMenuCategoryDto) => {
    return await masterBoardingApi.createBoardingMenuCategory(data);
  }
);

export const updateBoardingMenuCategory = createAsyncThunk(
  'boarding/updateBoardingMenuCategory',
  async ({ id, data }: { id: string; data: UpdateBoardingMenuCategoryDto }) => {
    return await masterBoardingApi.updateBoardingMenuCategory(id, data);
  }
);

export const deleteBoardingMenuCategory = createAsyncThunk(
  'boarding/deleteBoardingMenuCategory',
  async (id: string) => {
    await masterBoardingApi.deleteBoardingMenuCategory(id);
    return id;
  }
);

// Boarding Sub Menu Category operations (এগুলো অপরিবর্তিত থাকবে, API কল ব্যবহার করবে)
export const fetchBoardingSubMenuCategories = createAsyncThunk(
  'boarding/fetchBoardingSubMenuCategories',
  async (params: { page?: number; limit?: number; filters?: BoardingSubMenuCategoryFilters } = {}) => {
    return await masterBoardingApi.getBoardingSubMenuCategories(params);
  }
);

export const createBoardingSubMenuCategory = createAsyncThunk(
  'boarding/createBoardingSubMenuCategory',
  async (data: CreateBoardingSubMenuCategoryDto) => {
    return await masterBoardingApi.createBoardingSubMenuCategory(data);
  }
);

export const updateBoardingSubMenuCategory = createAsyncThunk(
  'boarding/updateBoardingSubMenuCategory',
  async ({ id, data }: { id: string; data: UpdateBoardingSubMenuCategoryDto }) => {
    return await masterBoardingApi.updateBoardingSubMenuCategory(id, data);
  }
);

export const deleteBoardingSubMenuCategory = createAsyncThunk(
  'boarding/deleteBoardingSubMenuCategory',
  async (id: string) => {
    await masterBoardingApi.deleteBoardingSubMenuCategory(id);
    return id;
  }
);

// Boarding Meal Type operations (এগুলো অপরিবর্তিত থাকবে, API কল ব্যবহার করবে)
export const fetchBoardingMealTypes = createAsyncThunk(
  'boarding/fetchBoardingMealTypes',
  async (params: { page?: number; limit?: number; filters?: BoardingMealTypeFilters } = {}) => {
    return await masterBoardingApi.getBoardingMealTypes(params);
  }
);

export const createBoardingMealType = createAsyncThunk(
  'boarding/createBoardingMealType',
  async (data: CreateBoardingMealTypeDto) => {
    return await masterBoardingApi.createBoardingMealType(data);
  }
);

export const updateBoardingMealType = createAsyncThunk(
  'boarding/updateBoardingMealType',
  async ({ id, data }: { id: string; data: UpdateBoardingMealTypeDto }) => {
    return await masterBoardingApi.updateBoardingMealType(id, data);
  }
);

export const deleteBoardingMealType = createAsyncThunk(
  'boarding/deleteBoardingMealType',
  async (id: string) => {
    await masterBoardingApi.deleteBoardingMealType(id);
    return id;
  }
);

// Boarding Menu Item operations (এগুলো অপরিবর্তিত থাকবে, API কল ব্যবহার করবে)
export const fetchBoardingMenuItems = createAsyncThunk(
  'boarding/fetchBoardingMenuItems',
  async (params: { page?: number; limit?: number; filters?: BoardingMenuItemFilters } = {}) => {
    return await masterBoardingApi.getBoardingMenuItems(params);
  }
);

export const createBoardingMenuItem = createAsyncThunk(
  'boarding/createBoardingMenuItem',
  async (data: CreateBoardingMenuItemDto) => {
    return await masterBoardingApi.createBoardingMenuItem(data);
  }
);

export const updateBoardingMenuItem = createAsyncThunk(
  'boarding/updateBoardingMenuItem',
  async ({ id, data }: { id: string; data: UpdateBoardingMenuItemDto }) => {
    return await masterBoardingApi.updateBoardingMenuItem(id, data);
  }
);

export const deleteBoardingMenuItem = createAsyncThunk(
  'boarding/deleteBoardingMenuItem',
  async (id: string) => {
    await masterBoardingApi.deleteBoardingMenuItem(id);
    return id;
  }
);

// Boarding Package operations (এগুলো অপরিবর্তিত থাকবে, API কল ব্যবহার করবে)
export const fetchBoardingPackages = createAsyncThunk(
  'boarding/fetchBoardingPackages',
  async (params: { page?: number; limit?: number; filters?: BoardingPackageFilters } = {}) => {
    return await masterBoardingApi.getBoardingPackages(params);
  }
);

export const createBoardingPackage = createAsyncThunk(
  'boarding/createBoardingPackage',
  async (data: CreateBoardingPackageDto) => {
    return await masterBoardingApi.createBoardingPackage(data);
  }
);

export const updateBoardingPackage = createAsyncThunk(
  'boarding/updateBoardingPackage',
  async ({ id, data }: { id: string; data: UpdateBoardingPackageDto }) => {
    return await masterBoardingApi.updateBoardingPackage(id, data);
  }
);

export const deleteBoardingPackage = createAsyncThunk(
  'boarding/deleteBoardingPackage',
  async (id: string) => {
    await masterBoardingApi.deleteBoardingPackage(id);
    return id;
  }
);

// Boarding Package Menu Item operations (শুধুমাত্র এইগুলো mock data ব্যবহার করবে)
export const fetchBoardingPackageMenuItems = createAsyncThunk(
  'boarding/fetchBoardingPackageMenuItems',
  // params গ্রহণ করবে, কারণ UI থেকে ফিল্টার এবং পেজিনেশন পাঠানো হচ্ছে
  async (params: { page?: number; limit?: number; filters?: BoardingPackageMenuItemFilters } = {}) => {
    return await masterBoardingApi.getBoardingPackageMenuItems(params);
  }
);

export const createBoardingPackageMenuItem = createAsyncThunk(
  'boarding/createBoardingPackageMenuItem',
  async (data: CreateBoardingPackageMenuItemDto) => {
    return await masterBoardingApi.createBoardingPackageMenuItem(data);
  }
);

export const updateBoardingPackageMenuItem = createAsyncThunk(
  'boarding/updateBoardingPackageMenuItem',
  async ({ id, data }: { id: string; data: UpdateBoardingPackageMenuItemDto }) => {
    return await masterBoardingApi.updateBoardingPackageMenuItem(id, data);
  }
);


export const deleteBoardingPackageMenuItem = createAsyncThunk(
  'boarding/deleteBoardingPackageMenuItem',
  async (id: string) => {
    await masterBoardingApi.deleteBoardingPackageMenuItem(id);
    return id;
  }
);

// Boarding Meal Package operations

// Full Day Meal Package operations
export const fetchFullDayMealPackages = createAsyncThunk(
  'boarding/fetchFullDayMealPackages',
  async (params: { page?: number; limit?: number; filters?: FullDayMealPackageFilters } = {}) => {
    return await masterBoardingApi.getFullDayMealPackages(params);
  }
);

export const createFullDayMealPackage = createAsyncThunk(
  'boarding/createFullDayMealPackage',
  async (data: CreateFullDayMealPackageDto) => {
    return await masterBoardingApi.createFullDayMealPackage(data);
  }
);

export const updateFullDayMealPackage = createAsyncThunk(
  'boarding/updateFullDayMealPackage',
  async ({ id, data }: { id: string; data: UpdateFullDayMealPackageDto }) => {
    return await masterBoardingApi.updateFullDayMealPackage(id, data);
  }
);

export const deleteFullDayMealPackage = createAsyncThunk(
  'boarding/deleteFullDayMealPackage',
  async (id: string) => {
    await masterBoardingApi.deleteFullDayMealPackage(id);
    return id;
  }
);

export const fetchAllMasterBoardingEntities = createAsyncThunk(
  'boarding/fetchAllMasterBoardingEntities',
  async () => {
    return await masterBoardingApi.getAllMasterBoardingEntities();
  }
);

/**
 * Boarding slice definition
 */
const masterBoardingSlice = createSlice({
  name: 'masterBoarding',
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
      .addCase(fetchBoardingPackageTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingPackageTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingPackageTypes = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingPackageTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding package types';
      })
      .addCase(createBoardingPackageType.fulfilled, (state, action) => {
        state.boardingPackageTypes.unshift(action.payload);
      })
      .addCase(updateBoardingPackageType.fulfilled, (state, action) => {
        const index = state.boardingPackageTypes.findIndex(type => type.id === action.payload.id);
        if (index !== -1) {
          state.boardingPackageTypes[index] = action.payload;
        }
      })
      .addCase(deleteBoardingPackageType.fulfilled, (state, action: PayloadAction<string>) => {
        state.boardingPackageTypes = state.boardingPackageTypes.filter(type => type.id !== action.payload);
      })
      // Boarding Menu Category operations
      .addCase(fetchBoardingMenuCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingMenuCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingMenuCategories = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingMenuCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding menu categories';
      })
      .addCase(createBoardingMenuCategory.fulfilled, (state, action) => {
        state.boardingMenuCategories.unshift(action.payload);
      })
      .addCase(updateBoardingMenuCategory.fulfilled, (state, action) => {
        const index = state.boardingMenuCategories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.boardingMenuCategories[index] = action.payload;
        }
      })
      .addCase(deleteBoardingMenuCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.boardingMenuCategories = state.boardingMenuCategories.filter(category => category.id !== action.payload);
      })
      // Boarding Sub Menu Category operations
      .addCase(fetchBoardingSubMenuCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingSubMenuCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingSubMenuCategories = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingSubMenuCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding sub menu categories';
      })
      .addCase(createBoardingSubMenuCategory.fulfilled, (state, action) => {
        state.boardingSubMenuCategories.unshift(action.payload);
      })
      .addCase(updateBoardingSubMenuCategory.fulfilled, (state, action) => {
        const index = state.boardingSubMenuCategories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.boardingSubMenuCategories[index] = action.payload;
        }
      })
      .addCase(deleteBoardingSubMenuCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.boardingSubMenuCategories = state.boardingSubMenuCategories.filter(category => category.id !== action.payload);
      })
      // Boarding Meal Type operations
      .addCase(fetchBoardingMealTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingMealTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingMealTypes = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingMealTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding meal types';
      })
      .addCase(createBoardingMealType.fulfilled, (state, action) => {
        state.boardingMealTypes.unshift(action.payload);
      })
      .addCase(updateBoardingMealType.fulfilled, (state, action) => {
        const index = state.boardingMealTypes.findIndex(type => type.id === action.payload.id);
        if (index !== -1) {
          state.boardingMealTypes[index] = action.payload;
        }
      })
      .addCase(deleteBoardingMealType.fulfilled, (state, action: PayloadAction<string>) => {
        state.boardingMealTypes = state.boardingMealTypes.filter(type => type.id !== action.payload);
      })
      // Boarding Menu Item operations
      .addCase(fetchBoardingMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingMenuItems = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding menu items';
      })
      .addCase(createBoardingMenuItem.fulfilled, (state, action) => {
        state.boardingMenuItems.unshift(action.payload);
      })
      .addCase(updateBoardingMenuItem.fulfilled, (state, action) => {
        const index = state.boardingMenuItems.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.boardingMenuItems[index] = action.payload;
        }
      })
      .addCase(deleteBoardingMenuItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.boardingMenuItems = state.boardingMenuItems.filter(item => item.id !== action.payload);
      })
      // Boarding Package operations
      .addCase(fetchBoardingPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingPackages = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding packages';
      })
      .addCase(createBoardingPackage.fulfilled, (state, action) => {
        state.boardingPackages.unshift(action.payload);
      })
      .addCase(updateBoardingPackage.fulfilled, (state, action) => {
        const index = state.boardingPackages.findIndex(pkg => pkg.id === action.payload.id);
        if (index !== -1) {
          state.boardingPackages[index] = action.payload;
        }
      })
      .addCase(deleteBoardingPackage.fulfilled, (state, action: PayloadAction<string>) => {
        state.boardingPackages = state.boardingPackages.filter(pkg => pkg.id !== action.payload);
      })
      // Boarding Package Menu Item operations (শুধুমাত্র এইগুলো mock data ব্যবহার করবে)
      .addCase(fetchBoardingPackageMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardingPackageMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.boardingPackageMenuItems = action.payload.data; // .data ব্যবহার করুন কারণ API পেজিনেটেড রেসপন্স দেয়
        state.pagination = { // পেজিনেশন স্টেট আপডেট করুন
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBoardingPackageMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boarding package menu items';
      })

      .addCase(createBoardingPackageMenuItem.fulfilled, (state, action) => {
        state.boardingPackageMenuItems.unshift(action.payload);
        // যদি পেজিনেশন থাকে, তাহলে total এবং totalPages আপডেট করা প্রয়োজন হতে পারে,
        // অথবা নতুন ডেটা সহ একটি নতুন fetch কল করা যেতে পারে।
        // এখানে সহজীকরণের জন্য শুধু আনশিফট করা হলো।
      })
      .addCase(updateBoardingPackageMenuItem.fulfilled, (state, action) => {
        const index = state.boardingPackageMenuItems.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.boardingPackageMenuItems[index] = action.payload;
        }
      })

      .addCase(deleteBoardingPackageMenuItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.boardingPackageMenuItems = state.boardingPackageMenuItems.filter(item => item.id !== action.payload);
        // যদি পেজিনেশন থাকে, তাহলে total এবং totalPages আপডেট করা প্রয়োজন হতে পারে,
        // অথবা ডেটা মুছে ফেলার পর একটি নতুন fetch কল করা যেতে পারে।
      })



      // Full Day Meal Package operations
      .addCase(fetchFullDayMealPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFullDayMealPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.fullDayMealPackages = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchFullDayMealPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch full day meal packages';
      })
      .addCase(createFullDayMealPackage.fulfilled, (state, action) => {
        state.fullDayMealPackages.unshift(action.payload);
      })
      .addCase(updateFullDayMealPackage.fulfilled, (state, action) => {
        const index = state.fullDayMealPackages.findIndex(pkg => pkg.id === action.payload.id);
        if (index !== -1) {
          state.fullDayMealPackages[index] = action.payload;
        }
      })
      .addCase(deleteFullDayMealPackage.fulfilled, (state, action: PayloadAction<string>) => {
        state.fullDayMealPackages = state.fullDayMealPackages.filter(pkg => pkg.id !== action.payload);
      })

      // Fetch all master boarding entities
      .addCase(fetchAllMasterBoardingEntities.fulfilled, (state, action) => {
        state.boardingPackageTypes = action.payload.packageTypes;
        state.boardingPackages = action.payload.packages;
        state.fullDayMealPackages = action.payload.fullDayMealPackages;
        state.boardingMealTypes = action.payload.mealTypes;
        state.boardingMenuCategories = action.payload.menuCategories;
        state.boardingSubMenuCategories = action.payload.subMenuCategories;
        state.boardingMenuItems = action.payload.menuItems;
      });
  },
});

// Export actions
export const {
  setActiveSection,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = masterBoardingSlice.actions;

// Export selectors
export const selectMasterBoardingState = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding;
export const selectMasterBoardingPackageTypes = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.boardingPackageTypes;
export const selectMasterBoardingMenuCategories = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.boardingMenuCategories;
export const selectMasterBoardingSubMenuCategories = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.boardingSubMenuCategories;
export const selectMasterBoardingMealTypes = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.boardingMealTypes;
export const selectMasterBoardingMenuItems = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.boardingMenuItems;
export const selectMasterBoardingPackages = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.boardingPackages;
export const selectMasterBoardingPackageMenuItems = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.boardingPackageMenuItems;
export const selectMasterFullDayMealPackages = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.fullDayMealPackages;
export const selectMasterBoardingLoading = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.loading;
export const selectMasterBoardingError = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.error;
export const selectMasterActiveSection = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.activeSection;
export const selectMasterBoardingFilters = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.filters;
export const selectMasterBoardingPagination = (state: { masterBoarding: MasterBoardingState }) => state.masterBoarding.pagination;

// Export reducer
export default masterBoardingSlice.reducer;

