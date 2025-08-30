// frontend/src/features/core/store/generalSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Gender,
  BloodGroup,
  ResidentialStatus,
  Religion,
  Designation,
  Relation,
  MaritalStatus,
  JobRule,
  Guardian,
  DesignationCategory,
  EducationalMentor,
  PersonCategory,
  CreateGenderDto,
  CreateBloodGroupDto,
  CreateResidentialStatusDto,
  CreateReligionDto,
  CreateDesignationDto,
  CreateRelationDto,
  CreateMaritalStatusDto,
  CreateJobRuleDto,
  CreateDesignationCategoryDto,
  CreateEducationalMentorDto,
  CreateGuardianDto,
  CreatePersonCategoryDto,
  UpdateGenderDto,
  UpdateBloodGroupDto,
  UpdateResidentialStatusDto,
  UpdateReligionDto,
  UpdateDesignationDto,
  UpdateRelationDto,
  UpdateMaritalStatusDto,
  UpdateJobRuleDto,
  UpdateDesignationCategoryDto,
  UpdateEducationalMentorDto,
  UpdateGuardianDto,
  UpdatePersonCategoryDto,
  GeneralFilters,
  GeneralEntityType,
} from '~/features/core/types/general';
import { generalApi } from '~/features/core/services/generalApi';

/**
 * General slice state interface
 */
export interface GeneralState {
  // Data
  genders: Gender[];
  bloodGroups: BloodGroup[];
  residentialStatuses: ResidentialStatus[];
  religions: Religion[];
  designations: Designation[];
  relations: Relation[];
  maritalStatuses: MaritalStatus[];
  jobRules: JobRule[];
  guardians: Guardian[];
  designationCategories: DesignationCategory[];
  educationalMentors: EducationalMentor[];
  personCategories: PersonCategory[];
  
  // UI State
  loading: boolean;
  error: string | null;
  activeEntity: GeneralEntityType;
  filters: GeneralFilters;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for general slice
 */
const initialState: GeneralState = {
  genders: [],
  bloodGroups: [],
  residentialStatuses: [],
  religions: [],
  designations: [],
  relations: [],
  maritalStatuses: [],
  jobRules: [],
  guardians: [],
  designationCategories: [],
  educationalMentors: [],
  personCategories: [],
  loading: false,
  error: null,
  activeEntity: 'gender',
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks for API operations

// Gender operations
export const fetchGenders = createAsyncThunk(
  'general/fetchGenders',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getGenders(params);
  }
);

export const createGender = createAsyncThunk(
  'general/createGender',
  async (data: CreateGenderDto) => {
    return await generalApi.createGender(data);
  }
);

export const updateGender = createAsyncThunk(
  'general/updateGender',
  async ({ id, data }: { id: string; data: UpdateGenderDto }) => {
    return await generalApi.updateGender(id, data);
  }
);

export const deleteGender = createAsyncThunk(
  'general/deleteGender',
  async (id: string) => {
    await generalApi.deleteGender(id);
    return id;
  }
);

// Blood Group operations
export const fetchBloodGroups = createAsyncThunk(
  'general/fetchBloodGroups',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getBloodGroups(params);
  }
);

export const createBloodGroup = createAsyncThunk(
  'general/createBloodGroup',
  async (data: CreateBloodGroupDto) => {
    return await generalApi.createBloodGroup(data);
  }
);

export const updateBloodGroup = createAsyncThunk(
  'general/updateBloodGroup',
  async ({ id, data }: { id: string; data: UpdateBloodGroupDto }) => {
    return await generalApi.updateBloodGroup(id, data);
  }
);

export const deleteBloodGroup = createAsyncThunk(
  'general/deleteBloodGroup',
  async (id: string) => {
    await generalApi.deleteBloodGroup(id);
    return id;
  }
);

// Residential Status operations
export const fetchResidentialStatuses = createAsyncThunk(
  'general/fetchResidentialStatuses',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getResidentialStatuses(params);
  }
);

export const createResidentialStatus = createAsyncThunk(
  'general/createResidentialStatus',
  async (data: CreateResidentialStatusDto) => {
    return await generalApi.createResidentialStatus(data);
  }
);

export const updateResidentialStatus = createAsyncThunk(
  'general/updateResidentialStatus',
  async ({ id, data }: { id: string; data: UpdateResidentialStatusDto }) => {
    return await generalApi.updateResidentialStatus(id, data);
  }
);

export const deleteResidentialStatus = createAsyncThunk(
  'general/deleteResidentialStatus',
  async (id: string) => {
    await generalApi.deleteResidentialStatus(id);
    return id;
  }
);

// Religion operations
export const fetchReligions = createAsyncThunk(
  'general/fetchReligions',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getReligions(params);
  }
);

export const createReligion = createAsyncThunk(
  'general/createReligion',
  async (data: CreateReligionDto) => {
    return await generalApi.createReligion(data);
  }
);

export const updateReligion = createAsyncThunk(
  'general/updateReligion',
  async ({ id, data }: { id: string; data: UpdateReligionDto }) => {
    return await generalApi.updateReligion(id, data);
  }
);

export const deleteReligion = createAsyncThunk(
  'general/deleteReligion',
  async (id: string) => {
    await generalApi.deleteReligion(id);
    return id;
  }
);

// Designation operations
export const fetchDesignations = createAsyncThunk(
  'general/fetchDesignations',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getDesignations(params);
  }
);

export const createDesignation = createAsyncThunk(
  'general/createDesignation',
  async (data: CreateDesignationDto) => {
    return await generalApi.createDesignation(data);
  }
);

export const updateDesignation = createAsyncThunk(
  'general/updateDesignation',
  async ({ id, data }: { id: string; data: UpdateDesignationDto }) => {
    return await generalApi.updateDesignation(id, data);
  }
);

export const deleteDesignation = createAsyncThunk(
  'general/deleteDesignation',
  async (id: string) => {
    await generalApi.deleteDesignation(id);
    return id;
  }
);

// Relation operations
export const fetchRelations = createAsyncThunk(
  'general/fetchRelations',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getRelations(params);
  }
);

export const createRelation = createAsyncThunk(
  'general/createRelation',
  async (data: CreateRelationDto) => {
    return await generalApi.createRelation(data);
  }
);

export const updateRelation = createAsyncThunk(
  'general/updateRelation',
  async ({ id, data }: { id: string; data: UpdateRelationDto }) => {
    return await generalApi.updateRelation(id, data);
  }
);

export const deleteRelation = createAsyncThunk(
  'general/deleteRelation',
  async (id: string) => {
    await generalApi.deleteRelation(id);
    return id;
  }
);

// Marital Status operations
export const fetchMaritalStatuses = createAsyncThunk(
  'general/fetchMaritalStatuses',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getMaritalStatuses(params);
  }
);

export const createMaritalStatus = createAsyncThunk(
  'general/createMaritalStatus',
  async (data: CreateMaritalStatusDto) => {
    return await generalApi.createMaritalStatus(data);
  }
);

export const updateMaritalStatus = createAsyncThunk(
  'general/updateMaritalStatus',
  async ({ id, data }: { id: string; data: UpdateMaritalStatusDto }) => {
    return await generalApi.updateMaritalStatus(id, data);
  }
);

export const deleteMaritalStatus = createAsyncThunk(
  'general/deleteMaritalStatus',
  async (id: string) => {
    await generalApi.deleteMaritalStatus(id);
    return id;
  }
);

// Job Rule operations
export const fetchJobRules = createAsyncThunk(
  'general/fetchJobRules',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getJobRules(params);
  }
);

export const createJobRule = createAsyncThunk(
  'general/createJobRule',
  async (data: CreateJobRuleDto) => {
    return await generalApi.createJobRule(data);
  }
);

export const updateJobRule = createAsyncThunk(
  'general/updateJobRule',
  async ({ id, data }: { id: string; data: UpdateJobRuleDto }) => {
    return await generalApi.updateJobRule(id, data);
  }
);

export const deleteJobRule = createAsyncThunk(
  'general/deleteJobRule',
  async (id: string) => {
    await generalApi.deleteJobRule(id);
    return id;
  }
);

// Guardian operations
export const fetchGuardians = createAsyncThunk(
  'general/fetchGuardians',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getGuardians(params);
  }
);

export const createGuardian = createAsyncThunk(
  'general/createGuardian',
  async (data: CreateGuardianDto) => {
    return await generalApi.createGuardian(data);
  }
);

export const updateGuardian = createAsyncThunk(
  'general/updateGuardian',
  async ({ id, data }: { id: string; data: UpdateGuardianDto }) => {
    return await generalApi.updateGuardian(id, data);
  }
);

export const deleteGuardian = createAsyncThunk(
  'general/deleteGuardian',
  async (id: string) => {
    await generalApi.deleteGuardian(id);
    return id;
  }
);

// Designation Category operations
export const fetchDesignationCategories = createAsyncThunk(
  'general/fetchDesignationCategories',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getDesignationCategories(params);
  }
);

export const createDesignationCategory = createAsyncThunk(
  'general/createDesignationCategory',
  async (data: CreateDesignationCategoryDto) => {
    return await generalApi.createDesignationCategory(data);
  }
);

export const updateDesignationCategory = createAsyncThunk(
  'general/updateDesignationCategory',
  async ({ id, data }: { id: string; data: UpdateDesignationCategoryDto }) => {
    return await generalApi.updateDesignationCategory(id, data);
  }
);

export const deleteDesignationCategory = createAsyncThunk(
  'general/deleteDesignationCategory',
  async (id: string) => {
    await generalApi.deleteDesignationCategory(id);
    return id;
  }
);

// Educational Mentor operations
export const fetchEducationalMentors = createAsyncThunk(
  'general/fetchEducationalMentors',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getEducationalMentors(params);
  }
);

export const createEducationalMentor = createAsyncThunk(
  'general/createEducationalMentor',
  async (data: CreateEducationalMentorDto) => {
    return await generalApi.createEducationalMentor(data);
  }
);

export const updateEducationalMentor = createAsyncThunk(
  'general/updateEducationalMentor',
  async ({ id, data }: { id: string; data: UpdateEducationalMentorDto }) => {
    return await generalApi.updateEducationalMentor(id, data);
  }
);

export const deleteEducationalMentor = createAsyncThunk(
  'general/deleteEducationalMentor',
  async (id: string) => {
    await generalApi.deleteEducationalMentor(id);
    return id;
  }
);

// Person Category operations
export const fetchPersonCategories = createAsyncThunk(
  'general/fetchPersonCategories',
  async (params: { page?: number; limit?: number; filters?: GeneralFilters } = {}) => {
    return await generalApi.getPersonCategories(params);
  }
);

export const createPersonCategory = createAsyncThunk(
  'general/createPersonCategory',
  async (data: CreatePersonCategoryDto) => {
    return await generalApi.createPersonCategory(data);
  }
);

export const updatePersonCategory = createAsyncThunk(
  'general/updatePersonCategory',
  async ({ id, data }: { id: string; data: UpdatePersonCategoryDto }) => {
    return await generalApi.updatePersonCategory(id, data);
  }
);

export const deletePersonCategory = createAsyncThunk(
  'general/deletePersonCategory',
  async (id: string) => {
    await generalApi.deletePersonCategory(id);
    return id;
  }
);

// Fetch all simple entities for dropdowns
export const fetchAllSimpleEntities = createAsyncThunk(
  'general/fetchAllSimpleEntities',
  async () => {
    return await generalApi.getAllSimpleEntities();
  }
);

/**
 * General slice definition
 */
const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setActiveEntity: (state, action: PayloadAction<GeneralEntityType>) => {
      state.activeEntity = action.payload;
      state.pagination.page = 1; // Reset pagination when changing entity
    },
    setFilters: (state, action: PayloadAction<GeneralFilters>) => {
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
      // Gender operations
      .addCase(fetchGenders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenders.fulfilled, (state, action) => {
        state.loading = false;
        state.genders = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchGenders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch genders';
      })
      .addCase(createGender.fulfilled, (state, action) => {
        state.genders.unshift(action.payload);
      })
      .addCase(updateGender.fulfilled, (state, action) => {
        const index = state.genders.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.genders[index] = action.payload;
        }
      })
      .addCase(deleteGender.fulfilled, (state, action) => {
        state.genders = state.genders.filter(item => item.id !== action.payload);
      })

      // Blood Group operations
      .addCase(fetchBloodGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodGroups = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchBloodGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blood groups';
      })
      .addCase(createBloodGroup.fulfilled, (state, action) => {
        state.bloodGroups.unshift(action.payload);
      })
      .addCase(updateBloodGroup.fulfilled, (state, action) => {
        const index = state.bloodGroups.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.bloodGroups[index] = action.payload;
        }
      })
      .addCase(deleteBloodGroup.fulfilled, (state, action) => {
        state.bloodGroups = state.bloodGroups.filter(item => item.id !== action.payload);
      })

      // Residential Status operations
      .addCase(fetchResidentialStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidentialStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.residentialStatuses = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchResidentialStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch residential statuses';
      })
      .addCase(createResidentialStatus.fulfilled, (state, action) => {
        state.residentialStatuses.unshift(action.payload);
      })
      .addCase(updateResidentialStatus.fulfilled, (state, action) => {
        const index = state.residentialStatuses.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.residentialStatuses[index] = action.payload;
        }
      })
      .addCase(deleteResidentialStatus.fulfilled, (state, action) => {
        state.residentialStatuses = state.residentialStatuses.filter(item => item.id !== action.payload);
      })

      // Religion operations
      .addCase(fetchReligions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReligions.fulfilled, (state, action) => {
        state.loading = false;
        state.religions = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchReligions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch religions';
      })
      .addCase(createReligion.fulfilled, (state, action) => {
        state.religions.unshift(action.payload);
      })
      .addCase(updateReligion.fulfilled, (state, action) => {
        const index = state.religions.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.religions[index] = action.payload;
        }
      })
      .addCase(deleteReligion.fulfilled, (state, action) => {
        state.religions = state.religions.filter(item => item.id !== action.payload);
      })
      
      // Designation operations
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch designations';
      })
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.designations.unshift(action.payload);
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        const index = state.designations.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.designations[index] = action.payload;
        }
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.designations = state.designations.filter(item => item.id !== action.payload);
      })

      // Relation operations
      .addCase(fetchRelations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelations.fulfilled, (state, action) => {
        state.loading = false;
        state.relations = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchRelations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch relations';
      })
      .addCase(createRelation.fulfilled, (state, action) => {
        state.relations.unshift(action.payload);
      })
      .addCase(updateRelation.fulfilled, (state, action) => {
        const index = state.relations.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.relations[index] = action.payload;
        }
      })
      .addCase(deleteRelation.fulfilled, (state, action) => {
        state.relations = state.relations.filter(item => item.id !== action.payload);
      })

      // Marital Status operations
      .addCase(fetchMaritalStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaritalStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.maritalStatuses = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchMaritalStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch marital statuses';
      })
      .addCase(createMaritalStatus.fulfilled, (state, action) => {
        state.maritalStatuses.unshift(action.payload);
      })
      .addCase(updateMaritalStatus.fulfilled, (state, action) => {
        const index = state.maritalStatuses.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.maritalStatuses[index] = action.payload;
        }
      })
      .addCase(deleteMaritalStatus.fulfilled, (state, action) => {
        state.maritalStatuses = state.maritalStatuses.filter(item => item.id !== action.payload);
      })

      // Job Rule operations
      .addCase(fetchJobRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobRules.fulfilled, (state, action) => {
        state.loading = false;
        state.jobRules = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchJobRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch job rules';
      })
      .addCase(createJobRule.fulfilled, (state, action) => {
        state.jobRules.unshift(action.payload);
      })
      .addCase(updateJobRule.fulfilled, (state, action) => {
        const index = state.jobRules.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.jobRules[index] = action.payload;
        }
      })
      .addCase(deleteJobRule.fulfilled, (state, action) => {
        state.jobRules = state.jobRules.filter(item => item.id !== action.payload);
      })

      // Guardian operations
      .addCase(fetchGuardians.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuardians.fulfilled, (state, action) => {
        state.loading = false;
        state.guardians = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchGuardians.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch guardians';
      })
      .addCase(createGuardian.fulfilled, (state, action) => {
        state.guardians.unshift(action.payload);
      })
      .addCase(updateGuardian.fulfilled, (state, action) => {
        const index = state.guardians.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.guardians[index] = action.payload;
        }
      })
      .addCase(deleteGuardian.fulfilled, (state, action) => {
        state.guardians = state.guardians.filter(item => item.id !== action.payload);
      })

      // Designation Category operations
      .addCase(fetchDesignationCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignationCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.designationCategories = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchDesignationCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch designation categories';
      })
      .addCase(createDesignationCategory.fulfilled, (state, action) => {
        state.designationCategories.unshift(action.payload);
      })
      .addCase(updateDesignationCategory.fulfilled, (state, action) => {
        const index = state.designationCategories.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.designationCategories[index] = action.payload;
        }
      })
      .addCase(deleteDesignationCategory.fulfilled, (state, action) => {
        state.designationCategories = state.designationCategories.filter(item => item.id !== action.payload);
      })

      // Educational Mentor operations
      .addCase(fetchEducationalMentors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducationalMentors.fulfilled, (state, action) => {
        state.loading = false;
        state.educationalMentors = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchEducationalMentors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch educational mentors';
      })
      .addCase(createEducationalMentor.fulfilled, (state, action) => {
        state.educationalMentors.unshift(action.payload);
      })
      .addCase(updateEducationalMentor.fulfilled, (state, action) => {
        const index = state.educationalMentors.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.educationalMentors[index] = action.payload;
        }
      })
      .addCase(deleteEducationalMentor.fulfilled, (state, action) => {
        state.educationalMentors = state.educationalMentors.filter(item => item.id !== action.payload);
      })

      // Person Category operations
      .addCase(fetchPersonCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.personCategories = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchPersonCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch person categories';
      })
      .addCase(createPersonCategory.fulfilled, (state, action) => {
        state.personCategories.unshift(action.payload);
      })
      .addCase(updatePersonCategory.fulfilled, (state, action) => {
        const index = state.personCategories.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.personCategories[index] = action.payload;
        }
      })
      .addCase(deletePersonCategory.fulfilled, (state, action) => {
        state.personCategories = state.personCategories.filter(item => item.id !== action.payload);
      })

      // Fetch all simple entities
      .addCase(fetchAllSimpleEntities.fulfilled, (state, action) => {
        // console.log('Before setting designations:', state.designations);
        // console.log('Fetched designations:', action.payload.designations);
        state.genders = action.payload.genders;
        state.bloodGroups = action.payload.bloodGroups;
        state.residentialStatuses = action.payload.residentialStatuses;
        state.religions = action.payload.religions;
        state.relations = action.payload.relations;
        state.maritalStatuses = action.payload.maritalStatuses;
        state.designations = action.payload.designations;
        state.jobRules = action.payload.jobRules;
        state.designationCategories = action.payload.designationCategories;
        state.personCategories = action.payload.personCategories;
      })
      .addCase(fetchAllSimpleEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch simple entities';
        console.log('fetchAllSimpleEntities error:', action.error);
      });
  },
});

// Export actions
export const {
  setActiveEntity,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = generalSlice.actions;

// Export selectors
export const selectGeneralState = (state: { general: GeneralState }) => state.general;
export const selectGenders = (state: { general: GeneralState }) => state.general.genders;
export const selectBloodGroups = (state: { general: GeneralState }) => state.general.bloodGroups;
export const selectResidentialStatuses = (state: { general: GeneralState }) => state.general.residentialStatuses;
export const selectReligions = (state: { general: GeneralState }) => state.general.religions;
export const selectDesignations = (state: { general: GeneralState }) => state.general.designations;
export const selectGuardians = (state: { general: GeneralState }) => state.general.guardians;
export const selectRelations = (state: { general: GeneralState }) => state.general.relations;
export const selectMaritalStatuses = (state: { general: GeneralState }) => state.general.maritalStatuses;
export const selectJobRules = (state: { general: GeneralState }) => state.general.jobRules;
export const selectDesignationCategories = (state: { general: GeneralState }) => state.general.designationCategories;
export const selectEducationalMentors = (state: { general: GeneralState }) => state.general.educationalMentors;
export const selectPersonCategories = (state: { general: GeneralState }) => state.general.personCategories;
export const selectGeneralLoading = (state: { general: GeneralState }) => state.general.loading;
export const selectGeneralError = (state: { general: GeneralState }) => state.general.error;
export const selectActiveEntity = (state: { general: GeneralState }) => state.general.activeEntity;
export const selectGeneralFilters = (state: { general: GeneralState }) => state.general.filters;
export const selectGeneralPagination = (state: { general: GeneralState }) => state.general.pagination;

// Export reducer
export default generalSlice.reducer;