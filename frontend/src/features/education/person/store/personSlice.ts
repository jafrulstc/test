// features/person/store/personSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Person,
  PersonDetails,
  CreatePersonDTO,
  UpdatePersonDTO,
  PersonFilter,
} from '~/features/education/person/types/personType';
import { personApi } from '~/features/education/person/services/personApi';

/**
 * Person slice state interface
 */


export interface PersonState {
  // Data
  persons: Person[];
  selectedPerson: Person | null;
  selectedPersonDetails: PersonDetails | null;
  personsForDropdown: { id: string; firstName: string; lastName: string }[];

  // UI State
  loading: boolean;
  error: string | null;
  filters: PersonFilter;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for person slice
 */
const initialState: PersonState = {
  persons: [],
  selectedPerson: null,
  selectedPersonDetails: null,
  personsForDropdown: [],
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

/* ============================
 * Async thunks for API operations
 * ============================ */

/** Fetch persons with pagination and filtering */
export const fetchPersons = createAsyncThunk(
  'person/fetchPersons',
  async (params: { page?: number; limit?: number; filters?: PersonFilter } = {}) => {
    return await personApi.getPersons(params);
  }
);

/** (Optional) Fetch persons but cast to details on the fly */
// export const fetchPersonsWithDetails = createAsyncThunk(
//   'person/fetchPersonsWithDetails',
//   async (params: { page?: number; limit?: number; filters?: PersonFilter } = {}) => {
//     // personApi.getPersonsWithDetails returns PaginatedResponse<PersonDetails>
//     return await personApi.getPersonsWithDetails(params);
//   }
// );

/** Fetch person by ID */
export const fetchPersonById = createAsyncThunk(
  'person/fetchPersonById',
  async (id: string) => {
    return await personApi.getPersonById(id);
  }
);

/** (Optional) Fetch person details by ID */
export const fetchPersonDetailsById = createAsyncThunk(
  'person/fetchPersonDetailsById',
  async (id: string) => {
    return await personApi.getPersonDetailsById(id);
  }
);

/** Create new person */
export const createPerson = createAsyncThunk(
  'person/createPerson',
  async (data: CreatePersonDTO) => {
    return await personApi.createPerson(data);
  }
);

/** Update person */
export const updatePerson = createAsyncThunk(
  'person/updatePerson',
  async ({ id, data }: { id: string; data: UpdatePersonDTO }) => {
    return await personApi.updatePerson(id, data);
  }
);

/** Delete person */
export const deletePerson = createAsyncThunk(
  'person/deletePerson',
  async (id: string) => {
    await personApi.deletePerson(id);
    return id;
  }
);

/** Fetch all persons for dropdown */
export const fetchPersonsForDropdown = createAsyncThunk(
  'person/fetchPersonsForDropdown',
  async () => {
    return await personApi.getAllPersonsForDropdown();
  }
);

/* ============================
 * Slice definition
 * ============================ */

const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PersonFilter>) => {
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
    clearSelectedPerson: (state) => {
      state.selectedPerson = null;
    },
    clearSelectedPersonDetails: (state) => {
      state.selectedPersonDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch persons */
      .addCase(fetchPersons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersons.fulfilled, (state, action) => {
        state.loading = false;
        state.persons = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchPersons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch persons';
      })

      /* (Optional) Fetch persons with details */
    //   .addCase(fetchPersonsWithDetails.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchPersonsWithDetails.fulfilled, (state, action) => {
    //     state.loading = false;
    //     // action.payload.data is PersonDetails[]
    //     // চাইলে UI-তে ডিরেক্ট details ব্যবহার করবে; এখানে persons-এ কাস্ট করতে চাইলে map করা যাবে
    //     state.persons = action.payload.data as unknown as Person[];
    //     state.pagination = {
    //       page: action.payload.page,
    //       limit: action.payload.limit,
    //       total: action.payload.total,
    //       totalPages: action.payload.totalPages,
    //     };
    //   })
    //   .addCase(fetchPersonsWithDetails.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message || 'Failed to fetch persons (details)';
    //   })

      /* Fetch person by ID */
      .addCase(fetchPersonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPerson = action.payload;
      })
      .addCase(fetchPersonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch person';
      })

      /* (Optional) Fetch person details by ID */
      .addCase(fetchPersonDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPersonDetails = action.payload;
      })
      .addCase(fetchPersonDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch person details';
      })

      /* Create person */
      .addCase(createPerson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPerson.fulfilled, (state, action) => {
        state.loading = false;
        state.persons.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create person';
      })

      /* Update person */
      .addCase(updatePerson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.persons.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.persons[index] = action.payload;
        if (state.selectedPerson?.id === action.payload.id) {
          state.selectedPerson = action.payload;
        }
        if (state.selectedPersonDetails?.id === action.payload.id) {
          // PersonDetails এখন Person-এর mirror; প্রয়োজনে shallow merge
          state.selectedPersonDetails = { ...(state.selectedPersonDetails as PersonDetails), ...action.payload };
        }
      })
      .addCase(updatePerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update person';
      })

      /* Delete person */
      .addCase(deletePerson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.loading = false;
        state.persons = state.persons.filter(p => p.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedPerson?.id === action.payload) state.selectedPerson = null;
        if (state.selectedPersonDetails?.id === action.payload) state.selectedPersonDetails = null;
      })
      .addCase(deletePerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete person';
      })

      /* Dropdown */
      .addCase(fetchPersonsForDropdown.fulfilled, (state, action) => {
        state.personsForDropdown = action.payload;
      });
  },
});

/* ========= Actions ========= */
export const {
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearSelectedPerson,
  clearSelectedPersonDetails,
} = personSlice.actions;

/* ========= Selectors ========= */
export const selectPersonState = (state: { persons: PersonState }) => state.persons;
export const selectPersons = (state: { persons: PersonState }) => state.persons.persons;
export const selectSelectedPerson = (state: { persons: PersonState }) => state.persons.selectedPerson;
export const selectSelectedPersonDetails = (state: { persons: PersonState }) => state.persons.selectedPersonDetails;
export const selectPersonsForDropdown = (state: { persons: PersonState }) => state.persons.personsForDropdown;
export const selectPersonLoading = (state: { persons: PersonState }) => state.persons.loading;
export const selectPersonError = (state: { persons: PersonState }) => state.persons.error;
export const selectPersonFilters = (state: { persons: PersonState }) => state.persons.filters;
export const selectPersonPagination = (state: { persons: PersonState }) => state.persons.pagination;

/* ========= Reducer ========= */
export default personSlice.reducer;
