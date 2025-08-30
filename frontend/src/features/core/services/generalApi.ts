// frontend/src/features/core/services/generalApi.ts
import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Gender,
  BloodGroup,
  ResidentialStatus,
  Religion,
  Designation,
  Guardian,
  DesignationCategory,
  EducationalMentor,
  CreateGenderDto,
  CreateBloodGroupDto,
  CreateResidentialStatusDto,
  CreateReligionDto,
  CreateDesignationDto,
  CreateGuardianDto,
  CreateDesignationCategoryDto,
  CreateEducationalMentorDto,
  UpdateGenderDto,
  UpdateBloodGroupDto,
  UpdateResidentialStatusDto,
  UpdateReligionDto,
  UpdateDesignationDto,
  UpdateGuardianDto,
  UpdateDesignationCategoryDto,
  UpdateEducationalMentorDto,
  GeneralFilters,
  Relation,
  MaritalStatus,
  JobRule,
  CreateRelationDto,
  UpdateRelationDto,
  CreateMaritalStatusDto,
  UpdateMaritalStatusDto,
  CreateJobRuleDto,
  UpdateJobRuleDto,
  PersonCategory,
  CreatePersonCategoryDto,
  UpdatePersonCategoryDto,
} from '~/features/core/types/general';
import type { PaginatedResponse } from '~/shared/types/common';

/**
 * Mock data for development
 */
const mockGenders: Gender[] = [
  { id: 'g1', name: 'Male', createdAt: new Date().toISOString() },
  { id: 'g2', name: 'Female', createdAt: new Date().toISOString() },
  { id: 'g3', name: 'Other', createdAt: new Date().toISOString() },
];


const mockPersonCategory: PersonCategory[] = [
  { id: 'pc1', name: 'student', createdAt: new Date().toISOString() },
  { id: 'pc2', name: 'staff', createdAt: new Date().toISOString() },
];

const mockBloodGroups: BloodGroup[] = [
  { id: 'bg1', name: 'A+', createdAt: new Date().toISOString() },
  { id: 'bg2', name: 'A-', createdAt: new Date().toISOString() },
  { id: 'bg3', name: 'B+', createdAt: new Date().toISOString() },
  { id: 'bg4', name: 'B-', createdAt: new Date().toISOString() },
  { id: 'bg5', name: 'AB+', createdAt: new Date().toISOString() },
  { id: 'bg6', name: 'AB-', createdAt: new Date().toISOString() },
  { id: 'bg7', name: 'O+', createdAt: new Date().toISOString() },
  { id: 'bg8', name: 'O-', createdAt: new Date().toISOString() },
];

const mockResidentialStatuses: ResidentialStatus[] = [
  { id: 'rs1', name: 'Resident', createdAt: new Date().toISOString() },
  { id: 'rs2', name: 'Non-Resident', createdAt: new Date().toISOString() },
  { id: 'rs3', name: 'Day Scholar', createdAt: new Date().toISOString() },
  { id: 'rs4', name: 'Hostel', createdAt: new Date().toISOString() },
];

const mockReligions: Religion[] = [
  { id: 'r1', name: 'Islam', createdAt: new Date().toISOString() },
  { id: 'r2', name: 'Christianity', createdAt: new Date().toISOString() },
  { id: 'r3', name: 'Hinduism', createdAt: new Date().toISOString() },
  { id: 'r4', name: 'Buddhism', createdAt: new Date().toISOString() },
  { id: 'r5', name: 'Judaism', createdAt: new Date().toISOString() },
  { id: 'r6', name: 'Other', createdAt: new Date().toISOString() },
];

const mockDesignations: Designation[] = [
  { id: 'd1', name: 'Teacher', designationCategoryId: 'dc1', createdAt: new Date().toISOString() },
  { id: 'd2', name: 'Principal', designationCategoryId: 'dc1', createdAt: new Date().toISOString() },
  { id: 'd3', name: 'Hostel Manager', designationCategoryId: 'dc2', createdAt: new Date().toISOString() },
  { id: 'd4', name: 'Accountant', designationCategoryId: 'dc2', createdAt: new Date().toISOString() },
  { id: 'd5', name: 'Librarian', designationCategoryId: 'dc3', createdAt: new Date().toISOString() },
];

const mockRelations: Relation[] = [
  { id: 'rel1', name: 'Self', createdAt: new Date().toISOString() },
  { id: 'rel2', name: 'Spouse', createdAt: new Date().toISOString() },
  { id: 'rel3', name: 'Child', createdAt: new Date().toISOString() },
  { id: 'rel4', name: 'Parent', createdAt: new Date().toISOString() },
  { id: 'rel5', name: 'Sibling', createdAt: new Date().toISOString() },
  { id: 'rel6', name: 'Other', createdAt: new Date().toISOString() },
];

const mockMaritalStatuses: MaritalStatus[] = [
  { id: 'ms1', name: 'Single', createdAt: new Date().toISOString() },
  { id: 'ms2', name: 'Married', createdAt: new Date().toISOString() },
  { id: 'ms3', name: 'Divorced', createdAt: new Date().toISOString() },
  { id: 'ms4', name: 'Widowed', createdAt: new Date().toISOString() },
  { id: 'ms5', name: 'Other', createdAt: new Date().toISOString() },
];

const mockJobRules: JobRule[] = [
  { id: 'jr1', name: 'দারোয়ান', createdAt: new Date().toISOString() },
  { id: 'jr2', name: 'বাবুর্চি', createdAt: new Date().toISOString() },
  { id: 'jr3', name: '', createdAt: new Date().toISOString() },
  { id: 'jr4', name: 'খাদেম', createdAt: new Date().toISOString() },
  { id: 'jr5', name: 'সহায়ক', createdAt: new Date().toISOString() },
];

const mockDesignationCategories: DesignationCategory[] = [
  { id: 'dc1', name: 'Teaching Staff', createdAt: new Date().toISOString() },
  { id: 'dc2', name: 'Administrative Staff', createdAt: new Date().toISOString() },
  { id: 'dc3', name: 'Support Staff', createdAt: new Date().toISOString() },
  { id: 'dc4', name: 'Technical Staff', createdAt: new Date().toISOString() },
];

const mockEducationalMentors: EducationalMentor[] = [
  {
    id: 'em1',
    name: 'Dr. Muhammad Ali',
    phone: 1712345678,
    email: 'muhammad.ali@example.com',
    occupation: 'Professor',
    photoUrl: '',
    student_id: 'st1',
    student: {
      first_name: 'Rahim',
      last_name: 'Karim',
      photo: ''
    },
    relation: 'rel3',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',
      subDistrictId: 'sd1',
      postOfficeId: 'po1',
      villageId: 'v1',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',
      subDistrictId: 'sd1',
      postOfficeId: 'po1',
      villageId: 'v1',
    },
    sameAsPresent: true,
    details: 'Academic mentor for PhD students, specializes in Computer Science.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'em2',
    name: 'Prof. Fatema Begum',
    phone: 1812345678,
    email: 'fatema.begum@example.com',
    occupation: 'Associate Professor',
    photoUrl: '',
    student_id: 'st2',
    student: {
      first_name: 'Fatima',
      last_name: 'Begum',
      photo: ''
    },
    relation: 'rel3',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt2',
      subDistrictId: 'sd2',
      postOfficeId: 'po2',
      villageId: 'v2',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt2',
      subDistrictId: 'sd2',
      postOfficeId: 'po2',
      villageId: 'v2',
    },
    sameAsPresent: true,
    details: 'Research mentor for postgraduate students, expert in Biotechnology.',
    createdAt: new Date().toISOString(),
  },
];

const mockGuardians: Guardian[] = [
  {
    id: 'gdn1',
    name: 'Abdul Karim',
    phone: 1711001100,
    email: 'abdul.karim@example.com',
    occupation: 'Businessman',
    photoUrl: '',
    student_id: 'st1',
    student: {
      first_name: 'Rahim',
      last_name: 'Karim',
      photo: ''
    },
    relation: 'rel4',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',
      subDistrictId: 'sd1',
      postOfficeId: 'po1',
      villageId: 'v1',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd3',
      districtId: 'dt3',
    },
    sameAsPresent: false,
    details: 'Father of the student, runs a wholesale shop in Dhaka.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gdn2',
    name: 'Shamsun Nahar',
    phone: 1811223344,
    email: 'shamsun.nahar@example.com',
    occupation: 'Teacher',
    photoUrl: '',
    student_id: 'st2',
    student: {
      first_name: 'Fatima',
      last_name: 'Begum',
      photo: ''
    },
    relation: 'rel4',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
      subDistrictId: 'sd3',
      postOfficeId: 'po2',
      villageId: 'v2',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
    },
    sameAsPresent: true,
    details: 'Mother of the student, teaches at a local school in Chittagong.',
    createdAt: new Date().toISOString(),
  },
];

/**
 * General API service class
 */
class GeneralApiService extends BaseApiService {
  private genders = [...mockGenders];
  private bloodGroups = [...mockBloodGroups];
  private residentialStatuses = [...mockResidentialStatuses];
  private religions = [...mockReligions];
  private designations = [...mockDesignations];
  private relations = [...mockRelations];
  private maritalStatuses = [...mockMaritalStatuses];
  private jobRules = [...mockJobRules];
  private guardians = [...mockGuardians];
  private designationCategories = [...mockDesignationCategories];
  private educationalMentors = [...mockEducationalMentors];
  private personCategories = [...mockPersonCategory];
  private mockIdCounter = 100;

  // Gender CRUD operations
  async getGenders(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Gender>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.genders];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createGender(data: CreateGenderDto): Promise<Gender> {
    await this.simulateDelay();
    const newGender: Gender = {
      id: `g${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.genders = [newGender, ...this.genders];
    return newGender;
  }

  async updateGender(id: string, data: UpdateGenderDto): Promise<Gender> {
    await this.simulateDelay();
    const index = this.genders.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Gender not found');
    
    this.genders[index] = { ...this.genders[index], ...data, updatedAt: new Date().toISOString() };
    return this.genders[index];
  }

  async deleteGender(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.genders.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Gender not found');
    
    this.genders = this.genders.filter(item => item.id !== id);
  }

  // Blood Group CRUD operations
  async getBloodGroups(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<BloodGroup>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.bloodGroups];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBloodGroup(data: CreateBloodGroupDto): Promise<BloodGroup> {
    await this.simulateDelay();
    const newBloodGroup: BloodGroup = {
      id: `bg${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.bloodGroups = [newBloodGroup, ...this.bloodGroups];
    return newBloodGroup;
  }

  async updateBloodGroup(id: string, data: UpdateBloodGroupDto): Promise<BloodGroup> {
    await this.simulateDelay();
    const index = this.bloodGroups.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Blood Group not found');
    
    this.bloodGroups[index] = { ...this.bloodGroups[index], ...data, updatedAt: new Date().toISOString() };
    return this.bloodGroups[index];
  }

  async deleteBloodGroup(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.bloodGroups.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Blood Group not found');
    
    this.bloodGroups = this.bloodGroups.filter(item => item.id !== id);
  }

  // Residential Status CRUD operations
  async getResidentialStatuses(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<ResidentialStatus>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.residentialStatuses];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createResidentialStatus(data: CreateResidentialStatusDto): Promise<ResidentialStatus> {
    await this.simulateDelay();
    const newResidentialStatus: ResidentialStatus = {
      id: `rs${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.residentialStatuses = [newResidentialStatus, ...this.residentialStatuses];
    return newResidentialStatus;
  }

  async updateResidentialStatus(id: string, data: UpdateResidentialStatusDto): Promise<ResidentialStatus> {
    await this.simulateDelay();
    const index = this.residentialStatuses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Residential Status not found');
    
    this.residentialStatuses[index] = { ...this.residentialStatuses[index], ...data, updatedAt: new Date().toISOString() };
    return this.residentialStatuses[index];
  }

  async deleteResidentialStatus(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.residentialStatuses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Residential Status not found');
    
    this.residentialStatuses = this.residentialStatuses.filter(item => item.id !== id);
  }

  // Religion CRUD operations
  async getReligions(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Religion>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.religions];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createReligion(data: CreateReligionDto): Promise<Religion> {
    await this.simulateDelay();
    const newReligion: Religion = {
      id: `r${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.religions = [newReligion, ...this.religions];
    return newReligion;
  }

  async updateReligion(id: string, data: UpdateReligionDto): Promise<Religion> {
    await this.simulateDelay();
    const index = this.religions.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Religion not found');
    
    this.religions[index] = { ...this.religions[index], ...data, updatedAt: new Date().toISOString() };
    return this.religions[index];
  }

  async deleteReligion(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.religions.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Religion not found');
    
    this.religions = this.religions.filter(item => item.id !== id);
  }

  // Designation CRUD operations
  async getDesignations(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Designation>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.designations];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    // Add designationCategory relation
    const dataWithRelations = filtered.map(designation => {
      const category = this.designationCategories.find(cat => cat.id === designation.designationCategoryId);
      return {
        ...designation,
        designationCategory: category ? { name: category.name } : undefined
      };
    });

    const total = dataWithRelations.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = dataWithRelations.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createDesignation(data: CreateDesignationDto): Promise<Designation> {
    await this.simulateDelay();
    const newDesignation: Designation = {
      id: `des${this.mockIdCounter++}`,
      name: data.name,
      designationCategoryId: data.designationCategoryId,
      createdAt: new Date().toISOString(),
    };
    this.designations = [newDesignation, ...this.designations];
    return newDesignation;
  }

  async updateDesignation(id: string, data: UpdateDesignationDto): Promise<Designation> {
    await this.simulateDelay();
    const index = this.designations.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Designation not found');
    
    this.designations[index] = { ...this.designations[index], ...data, updatedAt: new Date().toISOString() };
    return this.designations[index];
  }

  async deleteDesignation(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.designations.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Designation not found');
    
    this.designations = this.designations.filter(item => item.id !== id);
  }

  // Relation CRUD operations
  async getRelations(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Relation>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.relations];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createRelation(data: CreateRelationDto): Promise<Relation> {
    await this.simulateDelay();
    const newRelation: Relation = {
      id: `rel${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.relations = [newRelation, ...this.relations];
    return newRelation;
  }

  async updateRelation(id: string, data: UpdateRelationDto): Promise<Relation> {
    await this.simulateDelay();
    const index = this.relations.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Relation not found');
    
    this.relations[index] = { ...this.relations[index], ...data, updatedAt: new Date().toISOString() };
    return this.relations[index];
  }

  async deleteRelation(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.relations.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Relation not found');
    
    this.relations = this.relations.filter(item => item.id !== id);
  }

  // Marital Status CRUD operations
  async getMaritalStatuses(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<MaritalStatus>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.maritalStatuses];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createMaritalStatus(data: CreateMaritalStatusDto): Promise<MaritalStatus> {
    await this.simulateDelay();
    const newMaritalStatus: MaritalStatus = {
      id: `ms${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.maritalStatuses = [newMaritalStatus, ...this.maritalStatuses];
    return newMaritalStatus;
  }

  async updateMaritalStatus(id: string, data: UpdateMaritalStatusDto): Promise<MaritalStatus> {
    await this.simulateDelay();
    const index = this.maritalStatuses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Marital Status not found');
    
    this.maritalStatuses[index] = { ...this.maritalStatuses[index], ...data, updatedAt: new Date().toISOString() };
    return this.maritalStatuses[index];
  }

  async deleteMaritalStatus(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.maritalStatuses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Marital Status not found');
    
    this.maritalStatuses = this.maritalStatuses.filter(item => item.id !== id);
  }

  // Job Rule CRUD operations
  async getJobRules(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<JobRule>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.jobRules];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createJobRule(data: CreateJobRuleDto): Promise<JobRule> {
    await this.simulateDelay();
    const newJobRule: JobRule = {
      id: `jr${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.jobRules = [newJobRule, ...this.jobRules];
    return newJobRule;
  }

  async updateJobRule(id: string, data: UpdateJobRuleDto): Promise<JobRule> {
    await this.simulateDelay();
    const index = this.jobRules.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Job Rule not found');
    
    this.jobRules[index] = { ...this.jobRules[index], ...data, updatedAt: new Date().toISOString() };
    return this.jobRules[index];
  }

  async deleteJobRule(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.jobRules.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Job Rule not found');
    
    this.jobRules = this.jobRules.filter(item => item.id !== id);
  }

  // Guardian CRUD operations
  async getGuardians(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Guardian>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.guardians];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.toString().includes(search) ||
        item.occupation?.toLowerCase().includes(search) ||
        item.student_id?.toLowerCase().includes(search) ||
        item.relation?.toLowerCase().includes(search) ||
        item.student?.first_name.toLowerCase().includes(search) ||
        item.student?.last_name.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createGuardian(data: CreateGuardianDto): Promise<Guardian> {
    await this.simulateDelay();
    const newGuardian: Guardian = {
      id: `gd${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.guardians = [newGuardian, ...this.guardians];
    return newGuardian;
  }

  async updateGuardian(id: string, data: UpdateGuardianDto): Promise<Guardian> {
    await this.simulateDelay();
    const index = this.guardians.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Guardian not found');
    
    this.guardians[index] = { ...this.guardians[index], ...data, updatedAt: new Date().toISOString() };
    return this.guardians[index];
  }

  async deleteGuardian(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.guardians.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Guardian not found');
    
    this.guardians = this.guardians.filter(item => item.id !== id);
  }

  // Designation Category CRUD operations
  async getDesignationCategories(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<DesignationCategory>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.designationCategories];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createDesignationCategory(data: CreateDesignationCategoryDto): Promise<DesignationCategory> {
    await this.simulateDelay();
    const newDesignationCategory: DesignationCategory = {
      id: `dc${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.designationCategories = [newDesignationCategory, ...this.designationCategories];
    return newDesignationCategory;
  }

  async updateDesignationCategory(id: string, data: UpdateDesignationCategoryDto): Promise<DesignationCategory> {
    await this.simulateDelay();
    const index = this.designationCategories.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Designation Category not found');
    
    this.designationCategories[index] = { ...this.designationCategories[index], ...data, updatedAt: new Date().toISOString() };
    return this.designationCategories[index];
  }

  async deleteDesignationCategory(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.designationCategories.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Designation Category not found');
    
    this.designationCategories = this.designationCategories.filter(item => item.id !== id);
  }

  // Educational Mentor CRUD operations
  async getEducationalMentors(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<EducationalMentor>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.educationalMentors];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.occupation?.toLowerCase().includes(search) ||
        item.student_id?.toLowerCase().includes(search) ||
        item.relation?.toLowerCase().includes(search) ||
        item.student?.first_name.toLowerCase().includes(search) ||
        item.student?.last_name.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createEducationalMentor(data: CreateEducationalMentorDto): Promise<EducationalMentor> {
    await this.simulateDelay();
    const newEducationalMentor: EducationalMentor = {
      id: `em${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.educationalMentors = [newEducationalMentor, ...this.educationalMentors];
    return newEducationalMentor;
  }

  async updateEducationalMentor(id: string, data: UpdateEducationalMentorDto): Promise<EducationalMentor> {
    await this.simulateDelay();
    const index = this.educationalMentors.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Educational Mentor not found');
    
    this.educationalMentors[index] = { ...this.educationalMentors[index], ...data, updatedAt: new Date().toISOString() };
    return this.educationalMentors[index];
  }

  async deleteEducationalMentor(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.educationalMentors.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Educational Mentor not found');
    
    this.educationalMentors = this.educationalMentors.filter(item => item.id !== id);
  }

  // Person Category CRUD operations
  async getPersonCategories(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<PersonCategory>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.personCategories];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createPersonCategory(data: CreatePersonCategoryDto): Promise<PersonCategory> {
    await this.simulateDelay();
    const newPersonCategory: PersonCategory = {
      id: `pc${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.personCategories = [newPersonCategory, ...this.personCategories];
    return newPersonCategory;
  }

  async updatePersonCategory(id: string, data: UpdatePersonCategoryDto): Promise<PersonCategory> {
    await this.simulateDelay();
    const index = this.personCategories.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Person Category not found');
    
    this.personCategories[index] = { ...this.personCategories[index], ...data, updatedAt: new Date().toISOString() };
    return this.personCategories[index];
  }

  async deletePersonCategory(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.personCategories.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Person Category not found');
    
    this.personCategories = this.personCategories.filter(item => item.id !== id);
  }

  // Get all simple entities for dropdowns
  async getAllSimpleEntities(): Promise<{
    genders: Gender[];
    bloodGroups: BloodGroup[];
    residentialStatuses: ResidentialStatus[];
    religions: Religion[];
    relations: Relation[];
    maritalStatuses: MaritalStatus[];
    jobRules: JobRule[];
    designations: Designation[];
    designationCategories: DesignationCategory[];
    personCategories: PersonCategory[];
  }> {
    await this.simulateDelay(200);
    console.log('Returning designations:', this.designations);
    return {
      genders: this.genders,
      bloodGroups: this.bloodGroups,
      residentialStatuses: this.residentialStatuses,
      religions: this.religions,
      relations: this.relations,
      maritalStatuses: this.maritalStatuses,
      jobRules: this.jobRules,
      designations: this.designations,
      designationCategories: this.designationCategories,
      personCategories: this.personCategories,
    };
  }
}

export const generalApi = new GeneralApiService();