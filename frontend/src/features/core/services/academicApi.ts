import BaseApiService from '~/shared/services/api/baseApi';
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
  CreateAcademicClassDto,
  CreateShiftDto,
  CreateSectionDto,
  CreateClassGroupMappingDto,
  CreateSubjectDto,
  CreateGradeLevelDto,
  CreateLanguageProficiencyDto,
  UpdateEducationLevelDto,
  UpdateAcademicYearDto,
  UpdateAcademicGroupDto,
  UpdateAcademicClassDto,
  UpdateShiftDto,
  UpdateSectionDto,
  UpdateClassGroupMappingDto,
  UpdateSubjectDto,
  UpdateGradeLevelDto,
  UpdateLanguageProficiencyDto,
  AcademicFilters,
} from '../types/academic';
import type { PaginatedResponse } from '~/shared/types/common';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

/**
 * Mock data for development
 */
const mockEducationLevels: EducationLevel[] = [
  {
    id: 'el1',
    name: 'SSC',
    description: 'Secondary School Certificate',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'el2',
    name: 'HSC',
    description: 'Higher Secondary Certificate',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'el3',
    name: 'Degree',
    description: 'Bachelor Degree',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

const mockAcademicYears: AcademicYear[] = [
  {
    id: 'ay1',
    name: '2024-2025',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ay2',
    name: '2023-2024',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: STATUSES_OBJECT.INACTIVE,
    // status: 'Inactive',
    createdAt: new Date().toISOString(),
  },
];

const mockAcademicGroups: AcademicGroup[] = [
  {
    id: 'ag1',
    name: 'Science',
    educationLevelIds: ['el1', 'el2'],
    educationLevels: [mockEducationLevels[0], mockEducationLevels[1]],
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ag2',
    name: 'Commerce',
    educationLevelIds: ['el1', 'el2'],
    educationLevels: [mockEducationLevels[0], mockEducationLevels[1]],
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ag3',
    name: 'Arts',
    educationLevelIds: ['el1', 'el2'],
    educationLevels: [mockEducationLevels[0], mockEducationLevels[1]],
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

const mockAcademicClasses: AcademicClass[] = [
  {
    id: 'ac1',
    name: 'Class 9',
    educationLevelId: 'el1',
    academicGroupIds: ['ag1', 'ag2', 'ag3'],
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ac2',
    name: 'Class 10',
    educationLevelId: 'el1',
    academicGroupIds: ['ag1', 'ag2', 'ag3'],
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ac3',
    name: 'XI',
    educationLevelId: 'el2',
    academicGroupIds: ['ag1', 'ag2', 'ag3'],
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

const mockShifts: Shift[] = [
  {
    id: 's1',
    name: 'Morning',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's2',
    name: 'Day',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's3',
    name: 'Evening',
    status: STATUSES_OBJECT.INACTIVE,
    // status: 'Inactive',
    createdAt: new Date().toISOString(),
  },
];

const mockSections: Section[] = [
  {
    id: 'sec1',
    name: 'A',
    capacity: 40,
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sec2',
    name: 'B',
    capacity: 35,
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sec3',
    name: 'C',
    capacity: 30,
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

const mockClassGroupMappings: ClassGroupMapping[] = [
  {
    id: 'cgm1',
    academicClassId: 'ac1',
    academicGroupId: 'ag1',
    academicYearId: 'ay1',
    shiftSectionMapping: [
      {
        shiftId: 's1',
        sectionIds: ['sec1', 'sec2'],
      },
      {
        shiftId: 's2',
        sectionIds: ['sec1'],
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

const mockSubjects: Subject[] = [
  {
    id: 'sub1',
    name: 'Mathematics',
    code: 'MATH',
    description: 'Mathematics and Algebra',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub2',
    name: 'English',
    code: 'ENG',
    description: 'English Language and Literature',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub3',
    name: 'Science',
    code: 'SCI',
    description: 'General Science',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub4',
    name: 'History',
    code: 'HIST',
    description: 'World and Local History',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub5',
    name: 'Geography',
    code: 'GEO',
    description: 'Physical and Human Geography',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

const mockGradeLevels: GradeLevel[] = [
  {
    id: 'gl1',
    name: 'Primary',
    description: 'Primary level education (Grades 1-5)',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gl2',
    name: 'Secondary',
    description: 'Secondary level education (Grades 6-10)',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gl3',
    name: 'Higher Secondary',
    description: 'Higher secondary level education (Grades 11-12)',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

const mockLanguageProficiencies: LanguageProficiency[] = [
  {
    id: 'lp1',
    name: 'Bengali',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lp2',
    name: 'English',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lp3',
    name: 'Arabic',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lp4',
    name: 'Hindi',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lp5',
    name: 'Urdu',
    status: STATUSES_OBJECT.ACTIVE,
    // status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Academic API service class
 */
class AcademicApiService extends BaseApiService {
  private educationLevels = [...mockEducationLevels];
  private academicYears = [...mockAcademicYears];
  private academicGroups = [...mockAcademicGroups];
  private academicClasses = [...mockAcademicClasses];
  private shifts = [...mockShifts];
  private sections = [...mockSections];
  private classGroupMappings = [...mockClassGroupMappings];
  private subjects = [...mockSubjects];
  private gradeLevels = [...mockGradeLevels];
  private languageProficiencies = [...mockLanguageProficiencies];
  private mockIdCounter = 100;

  // Education Level CRUD operations
  async getEducationLevels(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<EducationLevel>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.educationLevels];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createEducationLevel(data: CreateEducationLevelDto): Promise<EducationLevel> {
    await this.simulateDelay();
    const newEducationLevel: EducationLevel = {
      id: `el${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.educationLevels = [newEducationLevel, ...this.educationLevels];
    return newEducationLevel;
  }

  async updateEducationLevel(id: string, data: UpdateEducationLevelDto): Promise<EducationLevel> {
    await this.simulateDelay();
    const index = this.educationLevels.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Education Level not found');
    
    this.educationLevels[index] = { ...this.educationLevels[index], ...data, updatedAt: new Date().toISOString() };
    return this.educationLevels[index];
  }

  async deleteEducationLevel(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.educationLevels.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Education Level not found');
    
    // Check if education level is used in academic groups
    const isUsed = this.academicGroups.some(group => group.educationLevelIds.includes(id));
    if (isUsed) {
      throw new Error('Cannot delete education level that is used in academic groups');
    }
    
    this.educationLevels = this.educationLevels.filter(item => item.id !== id);
  }

  // Academic Year CRUD operations
  async getAcademicYears(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<AcademicYear>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.academicYears];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createAcademicYear(data: CreateAcademicYearDto): Promise<AcademicYear> {
    await this.simulateDelay();
    const newAcademicYear: AcademicYear = {
      id: `ay${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.academicYears = [newAcademicYear, ...this.academicYears];
    return newAcademicYear;
  }

  async updateAcademicYear(id: string, data: UpdateAcademicYearDto): Promise<AcademicYear> {
    await this.simulateDelay();
    const index = this.academicYears.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Academic Year not found');
    
    this.academicYears[index] = { ...this.academicYears[index], ...data, updatedAt: new Date().toISOString() };
    return this.academicYears[index];
  }

  async deleteAcademicYear(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.academicYears.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Academic Year not found');
    
    this.academicYears = this.academicYears.filter(item => item.id !== id);
  }

  // Shift CRUD operations
  async getShifts(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<Shift>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.shifts];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createShift(data: CreateShiftDto): Promise<Shift> {
    await this.simulateDelay();
    const newShift: Shift = {
      id: `s${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.shifts = [newShift, ...this.shifts];
    return newShift;
  }

  async updateShift(id: string, data: UpdateShiftDto): Promise<Shift> {
    await this.simulateDelay();
    const index = this.shifts.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Shift not found');
    
    this.shifts[index] = { ...this.shifts[index], ...data, updatedAt: new Date().toISOString() };
    return this.shifts[index];
  }

  async deleteShift(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.shifts.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Shift not found');
    
    this.shifts = this.shifts.filter(item => item.id !== id);
  }

  // Section CRUD operations
  async getSections(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<Section>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.sections];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createSection(data: CreateSectionDto): Promise<Section> {
    await this.simulateDelay();
    const newSection: Section = {
      id: `sec${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.sections = [newSection, ...this.sections];
    return newSection;
  }

  async updateSection(id: string, data: UpdateSectionDto): Promise<Section> {
    await this.simulateDelay();
    const index = this.sections.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Section not found');
    
    this.sections[index] = { ...this.sections[index], ...data, updatedAt: new Date().toISOString() };
    return this.sections[index];
  }

  async deleteSection(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.sections.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Section not found');
    
    this.sections = this.sections.filter(item => item.id !== id);
  }

  // Academic Group CRUD operations
  async getAcademicGroups(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<AcademicGroup>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.academicGroups];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.educationLevelId) {
      filtered = filtered.filter(item => item.educationLevelIds.includes(filters.educationLevelId!));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createAcademicGroup(data: CreateAcademicGroupDto): Promise<AcademicGroup> {
    await this.simulateDelay();
    const educationLevels = this.educationLevels.filter(el => data.educationLevelIds.includes(el.id));
    
    const newAcademicGroup: AcademicGroup = {
      id: `ag${this.mockIdCounter++}`,
      ...data,
      educationLevels,
      createdAt: new Date().toISOString(),
    };
    this.academicGroups = [newAcademicGroup, ...this.academicGroups];
    return newAcademicGroup;
  }

  async updateAcademicGroup(id: string, data: UpdateAcademicGroupDto): Promise<AcademicGroup> {
    await this.simulateDelay();
    const index = this.academicGroups.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Academic Group not found');
    
    const educationLevels = data.educationLevelIds 
      ? this.educationLevels.filter(el => data.educationLevelIds!.includes(el.id))
      : this.academicGroups[index].educationLevels;
    
    this.academicGroups[index] = { 
      ...this.academicGroups[index], 
      ...data, 
      educationLevels,
      updatedAt: new Date().toISOString() 
    };
    return this.academicGroups[index];
  }

  async deleteAcademicGroup(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.academicGroups.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Academic Group not found');
    
    // Check if academic group is used in academic classes
    const isUsed = this.academicClasses.some(cls => cls.academicGroupIds.includes(id));
    if (isUsed) {
      throw new Error('Cannot delete academic group that is used in academic classes');
    }
    
    this.academicGroups = this.academicGroups.filter(item => item.id !== id);
  }

  // Academic Class CRUD operations
  async getAcademicClasses(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<AcademicClass>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.academicClasses];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.educationLevelId) {
      filtered = filtered.filter(item => item.educationLevelId === filters.educationLevelId);
    }

    if (filters.academicGroupId) {
      filtered = filtered.filter(item => item.academicGroupIds.includes(filters.academicGroupId!));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createAcademicClass(data: CreateAcademicClassDto): Promise<AcademicClass> {
    await this.simulateDelay();
    const educationLevel = this.educationLevels.find(el => el.id === data.educationLevelId);
    const academicGroups = this.academicGroups.filter(ag => data.academicGroupIds.includes(ag.id));
    
    const newAcademicClass: AcademicClass = {
      id: `ac${this.mockIdCounter++}`,
      ...data,
      educationLevel,
      academicGroups,
      createdAt: new Date().toISOString(),
    };
    this.academicClasses = [newAcademicClass, ...this.academicClasses];
    return newAcademicClass;
  }

  async updateAcademicClass(id: string, data: UpdateAcademicClassDto): Promise<AcademicClass> {
    await this.simulateDelay();
    const index = this.academicClasses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Academic Class not found');
    
    const educationLevel = data.educationLevelId 
      ? this.educationLevels.find(el => el.id === data.educationLevelId)
      : this.academicClasses[index].educationLevel;
    
    const academicGroups = data.academicGroupIds 
      ? this.academicGroups.filter(ag => data.academicGroupIds!.includes(ag.id))
      : this.academicClasses[index].academicGroups;
    
    this.academicClasses[index] = { 
      ...this.academicClasses[index], 
      ...data, 
      educationLevel,
      academicGroups,
      updatedAt: new Date().toISOString() 
    };
    return this.academicClasses[index];
  }

  async deleteAcademicClass(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.academicClasses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Academic Class not found');
    
    // Check if academic class is used in class group mappings
    const isUsed = this.classGroupMappings.some(mapping => mapping.academicClassId === id);
    if (isUsed) {
      throw new Error('Cannot delete academic class that is used in class group mappings');
    }
    
    this.academicClasses = this.academicClasses.filter(item => item.id !== id);
  }

  // Class Group Mapping CRUD operations
  async getClassGroupMappings(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<ClassGroupMapping>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.classGroupMappings];
    
    if (filters.academicClassId) {
      filtered = filtered.filter(item => item.academicClassId === filters.academicClassId);
    }

    if (filters.academicGroupId) {
      filtered = filtered.filter(item => item.academicGroupId === filters.academicGroupId);
    }

    if (filters.academicYearId) {
      filtered = filtered.filter(item => item.academicYearId === filters.academicYearId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createClassGroupMapping(data: CreateClassGroupMappingDto): Promise<ClassGroupMapping> {
    await this.simulateDelay();
    const academicClass = this.academicClasses.find(ac => ac.id === data.academicClassId);
    const academicGroup = this.academicGroups.find(ag => ag.id === data.academicGroupId);
    const academicYear = this.academicYears.find(ay => ay.id === data.academicYearId);
    
    const newClassGroupMapping: ClassGroupMapping = {
      id: `cgm${this.mockIdCounter++}`,
      ...data,
      academicClass,
      academicGroup,
      academicYear,
      createdAt: new Date().toISOString(),
    };
    this.classGroupMappings = [newClassGroupMapping, ...this.classGroupMappings];
    return newClassGroupMapping;
  }

  async updateClassGroupMapping(id: string, data: UpdateClassGroupMappingDto): Promise<ClassGroupMapping> {
    await this.simulateDelay();
    const index = this.classGroupMappings.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Class Group Mapping not found');
    
    const academicClass = data.academicClassId 
      ? this.academicClasses.find(ac => ac.id === data.academicClassId)
      : this.classGroupMappings[index].academicClass;
    
    const academicGroup = data.academicGroupId 
      ? this.academicGroups.find(ag => ag.id === data.academicGroupId)
      : this.classGroupMappings[index].academicGroup;
    
    const academicYear = data.academicYearId 
      ? this.academicYears.find(ay => ay.id === data.academicYearId)
      : this.classGroupMappings[index].academicYear;
    
    this.classGroupMappings[index] = { 
      ...this.classGroupMappings[index], 
      ...data, 
      academicClass,
      academicGroup,
      academicYear,
      updatedAt: new Date().toISOString() 
    };
    return this.classGroupMappings[index];
  }

  async deleteClassGroupMapping(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.classGroupMappings.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Class Group Mapping not found');
    
    this.classGroupMappings = this.classGroupMappings.filter(item => item.id !== id);
  }

  // Subject CRUD operations
  async getSubjects(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<Subject>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.subjects];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.code?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createSubject(data: CreateSubjectDto): Promise<Subject> {
    await this.simulateDelay();
    const newSubject: Subject = {
      id: `sub${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.subjects = [newSubject, ...this.subjects];
    return newSubject;
  }

  async updateSubject(id: string, data: UpdateSubjectDto): Promise<Subject> {
    await this.simulateDelay();
    const index = this.subjects.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Subject not found');
    
    this.subjects[index] = { ...this.subjects[index], ...data, updatedAt: new Date().toISOString() };
    return this.subjects[index];
  }

  async deleteSubject(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.subjects.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Subject not found');
    
    this.subjects = this.subjects.filter(item => item.id !== id);
  }

  // Grade Level CRUD operations
  async getGradeLevels(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<GradeLevel>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.gradeLevels];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createGradeLevel(data: CreateGradeLevelDto): Promise<GradeLevel> {
    await this.simulateDelay();
    const newGradeLevel: GradeLevel = {
      id: `gl${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.gradeLevels = [newGradeLevel, ...this.gradeLevels];
    return newGradeLevel;
  }

  async updateGradeLevel(id: string, data: UpdateGradeLevelDto): Promise<GradeLevel> {
    await this.simulateDelay();
    const index = this.gradeLevels.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Grade Level not found');
    
    this.gradeLevels[index] = { ...this.gradeLevels[index], ...data, updatedAt: new Date().toISOString() };
    return this.gradeLevels[index];
  }

  async deleteGradeLevel(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.gradeLevels.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Grade Level not found');
    
    this.gradeLevels = this.gradeLevels.filter(item => item.id !== id);
  }

  // Language Proficiency CRUD operations
  async getLanguageProficiencies(params: { page?: number; limit?: number; filters?: AcademicFilters } = {}): Promise<PaginatedResponse<LanguageProficiency>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.languageProficiencies];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createLanguageProficiency(data: CreateLanguageProficiencyDto): Promise<LanguageProficiency> {
    await this.simulateDelay();
    const newLanguageProficiency: LanguageProficiency = {
      id: `lp${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.languageProficiencies = [newLanguageProficiency, ...this.languageProficiencies];
    return newLanguageProficiency;
  }

  async updateLanguageProficiency(id: string, data: UpdateLanguageProficiencyDto): Promise<LanguageProficiency> {
    await this.simulateDelay();
    const index = this.languageProficiencies.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Language Proficiency not found');
    
    this.languageProficiencies[index] = { ...this.languageProficiencies[index], ...data, updatedAt: new Date().toISOString() };
    return this.languageProficiencies[index];
  }

  async deleteLanguageProficiency(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.languageProficiencies.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Language Proficiency not found');
    
    this.languageProficiencies = this.languageProficiencies.filter(item => item.id !== id);
  }

  // Get all simple entities for dropdowns
  async getAllAcademicEntities(): Promise<{
    educationLevels: EducationLevel[];
    academicYears: AcademicYear[];
    academicGroups: AcademicGroup[];
    academicClasses: AcademicClass[];
    shifts: Shift[];
    sections: Section[];
    subjects: Subject[];
    gradeLevels: GradeLevel[];
    languageProficiencies: LanguageProficiency[];
  }> {
    await this.simulateDelay(200);
    return {
      educationLevels: this.educationLevels,
      academicYears: this.academicYears,
      academicGroups: this.academicGroups,
      academicClasses: this.academicClasses,
      shifts: this.shifts,
      sections: this.sections,
      subjects: this.subjects,
      gradeLevels: this.gradeLevels,
      languageProficiencies: this.languageProficiencies,
    };
  }
}

export const academicApi = new AcademicApiService();