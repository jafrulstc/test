import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  EducationLevel,
  AcademicYear,
  AcademicGroup,
  AcademicClass,
  Shift,
  Section,
  ClassGroupMapping,
  Subject,
  GradeLevel,
  LanguageProficiency,
  CreateEducationLevelDto,
  CreateAcademicYearDto,
  CreateAcademicGroupDto,
  CreateSubjectDto,
  CreateGradeLevelDto,
  CreateLanguageProficiencyDto,
  UpdateEducationLevelDto,
  UpdateAcademicYearDto,
  UpdateAcademicGroupDto,
  UpdateSubjectDto,
  UpdateGradeLevelDto,
  UpdateLanguageProficiencyDto,
  AcademicFilters,
  AcademicEntityType,
  UpdateAcademicClassDto,
  CreateShiftDto,
  UpdateShiftDto,
  CreateSectionDto,
  UpdateSectionDto,
  CreateAcademicClassDto,
  CreateClassGroupMappingDto,
  UpdateClassGroupMappingDto,
} from '~/features/core/types/academic';
import { academicApi } from '~/features/core/services/academicApi';

/**
 * Academic slice state interface
 */
export interface AcademicState {
  // Data
  educationLevels: EducationLevel[];
  academicYears: AcademicYear[];
  academicGroups: AcademicGroup[];
  academicClasses: AcademicClass[];
  shifts: Shift[];
  sections: Section[];
  classGroupMappings: ClassGroupMapping[];
  subjects: Subject[];
  gradeLevels: GradeLevel[];
  languageProficiencies: LanguageProficiency[];
  
  // UI State
  loading: boolean;
  error: string | null;
  activeEntity: AcademicEntityType;
  filters: AcademicFilters;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for academic slice
 */
const initialState: AcademicState = {
  educationLevels: [],
  academicYears: [],
  academicGroups: [],
  academicClasses: [],
  shifts: [],
  sections: [],
  classGroupMappings: [],
  subjects: [],
  gradeLevels: [],
  languageProficiencies: [],
  loading: false,
  error: null,
  activeEntity: 'educationLevel',
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks for API operations

// Education Level operations
export const fetchEducationLevels = createAsyncThunk(
  'academic/fetchEducationLevels',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getEducationLevels(params);
  }
);

export const createEducationLevel = createAsyncThunk(
  'academic/createEducationLevel',
  async (data: CreateEducationLevelDto) => {
    return await academicApi.createEducationLevel(data);
  }
);

export const updateEducationLevel = createAsyncThunk(
  'academic/updateEducationLevel',
  async ({ id, data }: { id: string; data: UpdateEducationLevelDto }) => {
    return await academicApi.updateEducationLevel(id, data);
  }
);

export const deleteEducationLevel = createAsyncThunk(
  'academic/deleteEducationLevel',
  async (id: string) => {
    await academicApi.deleteEducationLevel(id);
    return id;
  }
);

// Academic Year operations
export const fetchAcademicYears = createAsyncThunk(
  'academic/fetchAcademicYears',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getAcademicYears(params);
  }
);

export const createAcademicYear = createAsyncThunk(
  'academic/createAcademicYear',
  async (data: CreateAcademicYearDto) => {
    return await academicApi.createAcademicYear(data);
  }
);

export const updateAcademicYear = createAsyncThunk(
  'academic/updateAcademicYear',
  async ({ id, data }: { id: string; data: UpdateAcademicYearDto }) => {
    return await academicApi.updateAcademicYear(id, data);
  }
);

export const deleteAcademicYear = createAsyncThunk(
  'academic/deleteAcademicYear',
  async (id: string) => {
    await academicApi.deleteAcademicYear(id);
    return id;
  }
);

// Shift operations
export const fetchShifts = createAsyncThunk(
  'academic/fetchShifts',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getShifts(params);
  }
);

export const createShift = createAsyncThunk(
  'academic/createShift',
  async (data: CreateShiftDto) => {
    return await academicApi.createShift(data);
  }
);

export const updateShift = createAsyncThunk(
  'academic/updateShift',
  async ({ id, data }: { id: string; data: UpdateShiftDto }) => {
    return await academicApi.updateShift(id, data);
  }
);

export const deleteShift = createAsyncThunk(
  'academic/deleteShift',
  async (id: string) => {
    await academicApi.deleteShift(id);
    return id;
  }
);

// Section operations
export const fetchSections = createAsyncThunk(
  'academic/fetchSections',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getSections(params);
  }
);

export const createSection = createAsyncThunk(
  'academic/createSection',
  async (data: CreateSectionDto) => {
    return await academicApi.createSection(data);
  }
);

export const updateSection = createAsyncThunk(
  'academic/updateSection',
  async ({ id, data }: { id: string; data: UpdateSectionDto }) => {
    return await academicApi.updateSection(id, data);
  }
);

export const deleteSection = createAsyncThunk(
  'academic/deleteSection',
  async (id: string) => {
    await academicApi.deleteSection(id);
    return id;
  }
);

// Academic Group operations
export const fetchAcademicGroups = createAsyncThunk(
  'academic/fetchAcademicGroups',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getAcademicGroups(params);
  }
);

export const createAcademicGroup = createAsyncThunk(
  'academic/createAcademicGroup',
  async (data: CreateAcademicGroupDto) => {
    return await academicApi.createAcademicGroup(data);
  }
);

export const updateAcademicGroup = createAsyncThunk(
  'academic/updateAcademicGroup',
  async ({ id, data }: { id: string; data: UpdateAcademicGroupDto }) => {
    return await academicApi.updateAcademicGroup(id, data);
  }
);

export const deleteAcademicGroup = createAsyncThunk(
  'academic/deleteAcademicGroup',
  async (id: string) => {
    await academicApi.deleteAcademicGroup(id);
    return id;
  }
);

// Academic Class operations
export const fetchAcademicClasses = createAsyncThunk(
  'academic/fetchAcademicClasses',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getAcademicClasses(params);
  }
);

export const createAcademicClass = createAsyncThunk(
  'academic/createAcademicClass',
  async (data: CreateAcademicClassDto) => {
    return await academicApi.createAcademicClass(data);
  }
);

export const updateAcademicClass = createAsyncThunk(
  'academic/updateAcademicClass',
  async ({ id, data }: { id: string; data: UpdateAcademicClassDto }) => {
    return await academicApi.updateAcademicClass(id, data);
  }
);

export const deleteAcademicClass = createAsyncThunk(
  'academic/deleteAcademicClass',
  async (id: string) => {
    await academicApi.deleteAcademicClass(id);
    return id;
  }
);

// Class Group Mapping operations
export const fetchClassGroupMappings = createAsyncThunk(
  'academic/fetchClassGroupMappings',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getClassGroupMappings(params);
  }
);

export const createClassGroupMapping = createAsyncThunk(
  'academic/createClassGroupMapping',
  async (data: CreateClassGroupMappingDto) => {
    return await academicApi.createClassGroupMapping(data);
  }
);

export const updateClassGroupMapping = createAsyncThunk(
  'academic/updateClassGroupMapping',
  async ({ id, data }: { id: string; data: UpdateClassGroupMappingDto }) => {
    return await academicApi.updateClassGroupMapping(id, data);
  }
);

export const deleteClassGroupMapping = createAsyncThunk(
  'academic/deleteClassGroupMapping',
  async (id: string) => {
    await academicApi.deleteClassGroupMapping(id);
    return id;
  }
);

// Subject operations
export const fetchSubjects = createAsyncThunk(
  'academic/fetchSubjects',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getSubjects(params);
  }
);

export const createSubject = createAsyncThunk(
  'academic/createSubject',
  async (data: CreateSubjectDto) => {
    return await academicApi.createSubject(data);
  }
);

export const updateSubject = createAsyncThunk(
  'academic/updateSubject',
  async ({ id, data }: { id: string; data: UpdateSubjectDto }) => {
    return await academicApi.updateSubject(id, data);
  }
);

export const deleteSubject = createAsyncThunk(
  'academic/deleteSubject',
  async (id: string) => {
    await academicApi.deleteSubject(id);
    return id;
  }
);

// Grade Level operations
export const fetchGradeLevels = createAsyncThunk(
  'academic/fetchGradeLevels',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getGradeLevels(params);
  }
);

export const createGradeLevel = createAsyncThunk(
  'academic/createGradeLevel',
  async (data: CreateGradeLevelDto) => {
    return await academicApi.createGradeLevel(data);
  }
);

export const updateGradeLevel = createAsyncThunk(
  'academic/updateGradeLevel',
  async ({ id, data }: { id: string; data: UpdateGradeLevelDto }) => {
    return await academicApi.updateGradeLevel(id, data);
  }
);

export const deleteGradeLevel = createAsyncThunk(
  'academic/deleteGradeLevel',
  async (id: string) => {
    await academicApi.deleteGradeLevel(id);
    return id;
  }
);

// Language Proficiency operations
export const fetchLanguageProficiencies = createAsyncThunk(
  'academic/fetchLanguageProficiencies',
  async (params: { page?: number; limit?: number; filters?: AcademicFilters } = {}) => {
    return await academicApi.getLanguageProficiencies(params);
  }
);

export const createLanguageProficiency = createAsyncThunk(
  'academic/createLanguageProficiency',
  async (data: CreateLanguageProficiencyDto) => {
    return await academicApi.createLanguageProficiency(data);
  }
);

export const updateLanguageProficiency = createAsyncThunk(
  'academic/updateLanguageProficiency',
  async ({ id, data }: { id: string; data: UpdateLanguageProficiencyDto }) => {
    return await academicApi.updateLanguageProficiency(id, data);
  }
);

export const deleteLanguageProficiency = createAsyncThunk(
  'academic/deleteLanguageProficiency',
  async (id: string) => {
    await academicApi.deleteLanguageProficiency(id);
    return id;
  }
);

// Fetch all academic entities for dropdowns
export const fetchAllAcademicEntities = createAsyncThunk(
  'academic/fetchAllAcademicEntities',
  async () => {
    return await academicApi.getAllAcademicEntities();
  }
);

/**
 * Academic slice definition
 */
const academicSlice = createSlice({
  name: 'academic',
  initialState,
  reducers: {
    setActiveEntity: (state, action: PayloadAction<AcademicEntityType>) => {
      state.activeEntity = action.payload;
      state.pagination.page = 1; // Reset pagination when changing entity
      state.filters = {}; // Clear filters when switching entities
    },
    setFilters: (state, action: PayloadAction<AcademicFilters>) => {
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
      // Education Level operations
      .addCase(fetchEducationLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducationLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.educationLevels = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchEducationLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch education levels';
      })
      .addCase(createEducationLevel.fulfilled, (state, action) => {
        state.educationLevels.unshift(action.payload);
      })
      .addCase(updateEducationLevel.fulfilled, (state, action) => {
        const index = state.educationLevels.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.educationLevels[index] = action.payload;
        }
      })
      .addCase(deleteEducationLevel.fulfilled, (state, action) => {
        state.educationLevels = state.educationLevels.filter(item => item.id !== action.payload);
      })

      // Academic Year operations
      .addCase(fetchAcademicYears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.loading = false;
        state.academicYears = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAcademicYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch academic years';
      })
      .addCase(createAcademicYear.fulfilled, (state, action) => {
        state.academicYears.unshift(action.payload);
      })
      .addCase(updateAcademicYear.fulfilled, (state, action) => {
        const index = state.academicYears.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.academicYears[index] = action.payload;
        }
      })
      .addCase(deleteAcademicYear.fulfilled, (state, action) => {
        state.academicYears = state.academicYears.filter(item => item.id !== action.payload);
      })

      // Shift operations
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shifts';
      })
      .addCase(createShift.fulfilled, (state, action) => {
        state.shifts.unshift(action.payload);
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.shifts.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.shifts = state.shifts.filter(item => item.id !== action.payload);
      })

      // Section operations
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sections';
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.sections.unshift(action.payload);
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.sections[index] = action.payload;
        }
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter(item => item.id !== action.payload);
      })

      // Academic Group operations
      .addCase(fetchAcademicGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcademicGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.academicGroups = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAcademicGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch academic groups';
      })
      .addCase(createAcademicGroup.fulfilled, (state, action) => {
        state.academicGroups.unshift(action.payload);
      })
      .addCase(updateAcademicGroup.fulfilled, (state, action) => {
        const index = state.academicGroups.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.academicGroups[index] = action.payload;
        }
      })
      .addCase(deleteAcademicGroup.fulfilled, (state, action) => {
        state.academicGroups = state.academicGroups.filter(item => item.id !== action.payload);
      })

      // Academic Class operations
      .addCase(fetchAcademicClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcademicClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.academicClasses = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAcademicClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch academic classes';
      })
      .addCase(createAcademicClass.fulfilled, (state, action) => {
        state.academicClasses.unshift(action.payload);
      })
      .addCase(updateAcademicClass.fulfilled, (state, action) => {
        const index = state.academicClasses.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.academicClasses[index] = action.payload;
        }
      })
      .addCase(deleteAcademicClass.fulfilled, (state, action) => {
        state.academicClasses = state.academicClasses.filter(item => item.id !== action.payload);
      })

      // Class Group Mapping operations
      .addCase(fetchClassGroupMappings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassGroupMappings.fulfilled, (state, action) => {
        state.loading = false;
        state.classGroupMappings = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchClassGroupMappings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch class group mappings';
      })
      .addCase(createClassGroupMapping.fulfilled, (state, action) => {
        state.classGroupMappings.unshift(action.payload);
      })
      .addCase(updateClassGroupMapping.fulfilled, (state, action) => {
        const index = state.classGroupMappings.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.classGroupMappings[index] = action.payload;
        }
      })
      .addCase(deleteClassGroupMapping.fulfilled, (state, action) => {
        state.classGroupMappings = state.classGroupMappings.filter(item => item.id !== action.payload);
      })

      // Subject operations
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subjects';
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.unshift(action.payload);
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(item => item.id !== action.payload);
      })

      // Grade Level operations
      .addCase(fetchGradeLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGradeLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.gradeLevels = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchGradeLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch grade levels';
      })
      .addCase(createGradeLevel.fulfilled, (state, action) => {
        state.gradeLevels.unshift(action.payload);
      })
      .addCase(updateGradeLevel.fulfilled, (state, action) => {
        const index = state.gradeLevels.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.gradeLevels[index] = action.payload;
        }
      })
      .addCase(deleteGradeLevel.fulfilled, (state, action) => {
        state.gradeLevels = state.gradeLevels.filter(item => item.id !== action.payload);
      })

      // Language Proficiency operations
      .addCase(fetchLanguageProficiencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguageProficiencies.fulfilled, (state, action) => {
        state.loading = false;
        state.languageProficiencies = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchLanguageProficiencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch language proficiencies';
      })
      .addCase(createLanguageProficiency.fulfilled, (state, action) => {
        state.languageProficiencies.unshift(action.payload);
      })
      .addCase(updateLanguageProficiency.fulfilled, (state, action) => {
        const index = state.languageProficiencies.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.languageProficiencies[index] = action.payload;
        }
      })
      .addCase(deleteLanguageProficiency.fulfilled, (state, action) => {
        state.languageProficiencies = state.languageProficiencies.filter(item => item.id !== action.payload);
      })

      // Fetch all academic entities
      .addCase(fetchAllAcademicEntities.fulfilled, (state, action) => {
        state.educationLevels = action.payload.educationLevels;
        state.academicYears = action.payload.academicYears;
        state.academicGroups = action.payload.academicGroups;
        state.academicClasses = action.payload.academicClasses;
        state.shifts = action.payload.shifts;
        state.sections = action.payload.sections;
        state.subjects = action.payload.subjects;
        state.gradeLevels = action.payload.gradeLevels;
        state.languageProficiencies = action.payload.languageProficiencies;
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
} = academicSlice.actions;

// Export selectors
export const selectAcademicState = (state: { academic: AcademicState }) => state.academic;
export const selectEducationLevels = (state: { academic: AcademicState }) => state.academic.educationLevels;
export const selectAcademicYears = (state: { academic: AcademicState }) => state.academic.academicYears;
export const selectAcademicGroups = (state: { academic: AcademicState }) => state.academic.academicGroups;
export const selectAcademicClasses = (state: { academic: AcademicState }) => state.academic.academicClasses;
export const selectShifts = (state: { academic: AcademicState }) => state.academic.shifts;
export const selectSections = (state: { academic: AcademicState }) => state.academic.sections;
export const selectClassGroupMappings = (state: { academic: AcademicState }) => state.academic.classGroupMappings;
export const selectSubjects = (state: { academic: AcademicState }) => state.academic.subjects;
export const selectGradeLevels = (state: { academic: AcademicState }) => state.academic.gradeLevels;
export const selectLanguageProficiencies = (state: { academic: AcademicState }) => state.academic.languageProficiencies;
export const selectAcademicLoading = (state: { academic: AcademicState }) => state.academic.loading;
export const selectAcademicError = (state: { academic: AcademicState }) => state.academic.error;
export const selectActiveEntity = (state: { academic: AcademicState }) => state.academic.activeEntity;
export const selectAcademicFilters = (state: { academic: AcademicState }) => state.academic.filters;
export const selectAcademicPagination = (state: { academic: AcademicState }) => state.academic.pagination;

// Export reducer
export default academicSlice.reducer;