import BaseApiService from '~/shared/services/api/baseApi';
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
} from '../types/geography';
import type { PaginatedResponse } from '~/shared/types/common';

/**
 * Mock data for development
 */
const mockNationalities: Nationality[] = [
  {
    id: 'n1',
    name: 'Bangladesh',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    name: 'India',
    createdAt: new Date().toISOString(),
  },
];

const mockDivisions: Division[] = [
  {
    id: 'd1',
    name: 'Dhaka',
    nationalityId: 'n1',
    nationality: mockNationalities[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    name: 'Chittagong',
    nationalityId: 'n1',
    nationality: mockNationalities[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd3',
    name: 'Sylhet',
    nationalityId: 'n1',
    nationality: mockNationalities[0],
    createdAt: new Date().toISOString(),
  },
];

const mockDistricts: District[] = [
  {
    id: 'dt1',
    name: 'Dhaka',
    divisionId: 'd1',
    division: mockDivisions[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dt2',
    name: 'Gazipur',
    divisionId: 'd1',
    division: mockDivisions[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dt3',
    name: 'Chittagong',
    divisionId: 'd2',
    division: mockDivisions[1],
    createdAt: new Date().toISOString(),
  },
];

const mockSubDistricts: Sub_District[] = [
  {
    id: 'sd1',
    name: 'Dhanmondi',
    districtId: 'dt1',
    district: mockDistricts[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sd2',
    name: 'Gulshan',
    districtId: 'dt1',
    district: mockDistricts[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sd3',
    name: 'Savar',
    districtId: 'dt2',
    district: mockDistricts[1],
    createdAt: new Date().toISOString(),
  },
];

const mockPostOffices: Post_Office[] = [
  {
    id: 'po1',
    name: 'Dhanmondi Post Office',
    subDistrictId: 'sd1',
    subDistrict: mockSubDistricts[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'po2',
    name: 'Gulshan Post Office',
    subDistrictId: 'sd2',
    subDistrict: mockSubDistricts[1],
    createdAt: new Date().toISOString(),
  },
];

const mockVillages: Village[] = [
  {
    id: 'v1',
    name: 'Dhanmondi Residential Area',
    postOfficeId: 'po1',
    postOffice: mockPostOffices[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'v2',
    name: 'Gulshan Model Town',
    postOfficeId: 'po2',
    postOffice: mockPostOffices[1],
    createdAt: new Date().toISOString(),
  },
];

/**
 * Geography API service class
 */
class GeographyApiService extends BaseApiService {
  private nationalities = [...mockNationalities];
  private divisions = [...mockDivisions];
  private districts = [...mockDistricts];
  private subDistricts = [...mockSubDistricts];
  private postOffices = [...mockPostOffices];
  private villages = [...mockVillages];
  private mockIdCounter = 100;

  // Nationality CRUD operations
  async getNationalities(params: { page?: number; limit?: number; filters?: GeographyFilters } = {}): Promise<PaginatedResponse<Nationality>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.nationalities];
    
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

  async createNationality(data: CreateNationalityDto): Promise<Nationality> {
    await this.simulateDelay();
    const newNationality: Nationality = {
      id: `n${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.nationalities = [newNationality, ...this.nationalities];
    return newNationality;
  }

  async updateNationality(id: string, data: UpdateNationalityDto): Promise<Nationality> {
    await this.simulateDelay();
    const index = this.nationalities.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Nationality not found');
    
    this.nationalities[index] = { ...this.nationalities[index], ...data, updatedAt: new Date().toISOString() };
    return this.nationalities[index];
  }

  async deleteNationality(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.nationalities.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Nationality not found');
    
    // Check if nationality has divisions
    const hasDivisions = this.divisions.some(div => div.nationalityId === id);
    if (hasDivisions) {
      throw new Error('Cannot delete nationality with existing divisions');
    }
    
    this.nationalities = this.nationalities.filter(item => item.id !== id);
  }

  // Division CRUD operations
  async getDivisions(params: { page?: number; limit?: number; filters?: GeographyFilters } = {}): Promise<PaginatedResponse<Division>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.divisions];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }
    
    if (filters.nationalityId) {
      filtered = filtered.filter(item => item.nationalityId === filters.nationalityId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createDivision(data: CreateDivisionDto): Promise<Division> {
    await this.simulateDelay();
    const nationality = this.nationalities.find(n => n.id === data.nationalityId);
    if (!nationality) throw new Error('Nationality not found');
    
    const newDivision: Division = {
      id: `d${this.mockIdCounter++}`,
      name: data.name,
      nationalityId: data.nationalityId,
      nationality,
      createdAt: new Date().toISOString(),
    };
    this.divisions = [newDivision, ...this.divisions];
    return newDivision;
  }

  async updateDivision(id: string, data: UpdateDivisionDto): Promise<Division> {
    await this.simulateDelay();
    const existingDivisionIndex = this.divisions.findIndex(item => item.id === id);
    if (existingDivisionIndex === -1) throw new Error('Division not found');
    
    let nationality = this.divisions[existingDivisionIndex].nationality;
    if (data.nationalityId && data.nationalityId !== this.divisions[existingDivisionIndex].nationalityId) {
      nationality = this.nationalities.find(n => n.id === data.nationalityId);
      if (!nationality) throw new Error('Nationality not found');
    }
    
    this.divisions[existingDivisionIndex] = { ...this.divisions[existingDivisionIndex], ...data, nationality, updatedAt: new Date().toISOString() };
    return this.divisions[existingDivisionIndex];
  }

  async deleteDivision(id: string): Promise<void> {
    await this.simulateDelay();
    const existingDivision = this.divisions.find(item => item.id === id);
    if (!existingDivision) throw new Error('Division not found');
    
    // Check if division has districts
    const hasDistricts = this.districts.some(dist => dist.divisionId === id);
    if (hasDistricts) {
      throw new Error('Cannot delete division with existing districts');
    }
    
    this.divisions = this.divisions.filter(item => item.id !== id);
  }

  // District CRUD operations
  async getDistricts(params: { page?: number; limit?: number; filters?: GeographyFilters } = {}): Promise<PaginatedResponse<District>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.districts];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }
    
    if (filters.divisionId) {
      filtered = filtered.filter(item => item.divisionId === filters.divisionId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createDistrict(data: CreateDistrictDto): Promise<District> {
    await this.simulateDelay();
    const division = this.divisions.find(d => d.id === data.divisionId);
    if (!division) throw new Error('Division not found');
    
    const newDistrict: District = {
      id: `dt${this.mockIdCounter++}`,
      name: data.name,
      divisionId: data.divisionId,
      division,
      createdAt: new Date().toISOString(),
    };
    this.districts = [newDistrict, ...this.districts];
    return newDistrict;
  }

  async updateDistrict(id: string, data: UpdateDistrictDto): Promise<District> {
    await this.simulateDelay();
    const existingDistrictIndex = this.districts.findIndex(item => item.id === id);
    if (existingDistrictIndex === -1) throw new Error('District not found');
    
    let division = this.districts[existingDistrictIndex].division;
    if (data.divisionId && data.divisionId !== this.districts[existingDistrictIndex].divisionId) {
      division = this.divisions.find(d => d.id === data.divisionId);
      if (!division) throw new Error('Division not found');
    }
    
    this.districts[existingDistrictIndex] = { ...this.districts[existingDistrictIndex], ...data, division, updatedAt: new Date().toISOString() };
    return this.districts[existingDistrictIndex];
  }

  async deleteDistrict(id: string): Promise<void> {
    await this.simulateDelay();
    const existingDistrict = this.districts.find(item => item.id === id);
    if (!existingDistrict) throw new Error('District not found');
    
    // Check if district has sub districts
    const hasSubDistricts = this.subDistricts.some(sd => sd.districtId === id);
    if (hasSubDistricts) {
      throw new Error('Cannot delete district with existing sub districts');
    }
    
    this.districts = this.districts.filter(item => item.id !== id);
  }

  // Sub District CRUD operations
  async getSubDistricts(params: { page?: number; limit?: number; filters?: GeographyFilters } = {}): Promise<PaginatedResponse<Sub_District>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.subDistricts];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }
    
    if (filters.districtId) {
      filtered = filtered.filter(item => item.districtId === filters.districtId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createSubDistrict(data: CreateSubDistrictDto): Promise<Sub_District> {
    await this.simulateDelay();
    const district = this.districts.find(d => d.id === data.districtId);
    if (!district) throw new Error('District not found');
    
    const newSubDistrict: Sub_District = {
      id: `sd${this.mockIdCounter++}`,
      name: data.name,
      districtId: data.districtId,
      district,
      createdAt: new Date().toISOString(),
    };
    this.subDistricts = [newSubDistrict, ...this.subDistricts];
    return newSubDistrict;
  }

  async updateSubDistrict(id: string, data: UpdateSubDistrictDto): Promise<Sub_District> {
    await this.simulateDelay();
    const existingSubDistrictIndex = this.subDistricts.findIndex(item => item.id === id);
    if (existingSubDistrictIndex === -1) throw new Error('Sub District not found');
    
    let district = this.subDistricts[existingSubDistrictIndex].district;
    if (data.districtId && data.districtId !== this.subDistricts[existingSubDistrictIndex].districtId) {
      district = this.districts.find(d => d.id === data.districtId);
      if (!district) throw new Error('District not found');
    }
    
    this.subDistricts[existingSubDistrictIndex] = { ...this.subDistricts[existingSubDistrictIndex], ...data, district, updatedAt: new Date().toISOString() };
    return this.subDistricts[existingSubDistrictIndex];
  }

  async deleteSubDistrict(id: string): Promise<void> {
    await this.simulateDelay();
    const existingSubDistrict = this.subDistricts.find(item => item.id === id);
    if (!existingSubDistrict) throw new Error('Sub District not found');
    
    // Check if sub district has post offices
    const hasPostOffices = this.postOffices.some(po => po.subDistrictId === id);
    if (hasPostOffices) {
      throw new Error('Cannot delete sub district with existing post offices');
    }
    
    this.subDistricts = this.subDistricts.filter(item => item.id !== id);
  }

  // Post Office CRUD operations
  async getPostOffices(params: { page?: number; limit?: number; filters?: GeographyFilters } = {}): Promise<PaginatedResponse<Post_Office>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.postOffices];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }
    
    if (filters.subDistrictId) {
      filtered = filtered.filter(item => item.subDistrictId === filters.subDistrictId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createPostOffice(data: CreatePostOfficeDto): Promise<Post_Office> {
    await this.simulateDelay();
    const subDistrict = this.subDistricts.find(sd => sd.id === data.subDistrictId);
    if (!subDistrict) throw new Error('Sub District not found');
    
    const newPostOffice: Post_Office = {
      id: `po${this.mockIdCounter++}`,
      name: data.name,
      subDistrictId: data.subDistrictId,
      subDistrict,
      createdAt: new Date().toISOString(),
    };
    this.postOffices = [newPostOffice, ...this.postOffices];
    return newPostOffice;
  }

  async updatePostOffice(id: string, data: UpdatePostOfficeDto): Promise<Post_Office> {
    await this.simulateDelay();
    const existingPostOfficeIndex = this.postOffices.findIndex(item => item.id === id);
    if (existingPostOfficeIndex === -1) throw new Error('Post Office not found');
    
    let subDistrict = this.postOffices[existingPostOfficeIndex].subDistrict;
    if (data.subDistrictId && data.subDistrictId !== this.postOffices[existingPostOfficeIndex].subDistrictId) {
      subDistrict = this.subDistricts.find(sd => sd.id === data.subDistrictId);
      if (!subDistrict) throw new Error('Sub District not found');
    }
    
    this.postOffices[existingPostOfficeIndex] = { ...this.postOffices[existingPostOfficeIndex], ...data, subDistrict, updatedAt: new Date().toISOString() };
    return this.postOffices[existingPostOfficeIndex];
  }

  async deletePostOffice(id: string): Promise<void> {
    await this.simulateDelay();
    const existingPostOffice = this.postOffices.find(item => item.id === id);
    if (!existingPostOffice) throw new Error('Post Office not found');
    
    // Check if post office has villages
    const hasVillages = this.villages.some(v => v.postOfficeId === id);
    if (hasVillages) {
      throw new Error('Cannot delete post office with existing villages');
    }
    
    this.postOffices = this.postOffices.filter(item => item.id !== id);
  }

  // Village CRUD operations
  async getVillages(params: { page?: number; limit?: number; filters?: GeographyFilters } = {}): Promise<PaginatedResponse<Village>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.villages];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }
    
    if (filters.postOfficeId) {
      filtered = filtered.filter(item => item.postOfficeId === filters.postOfficeId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createVillage(data: CreateVillageDto): Promise<Village> {
    await this.simulateDelay();
    const postOffice = this.postOffices.find(po => po.id === data.postOfficeId);
    if (!postOffice) throw new Error('Post Office not found');
    
    const newVillage: Village = {
      id: `v${this.mockIdCounter++}`,
      name: data.name,
      postOfficeId: data.postOfficeId,
      postOffice,
      createdAt: new Date().toISOString(),
    };
    this.villages = [newVillage, ...this.villages];
    return newVillage;
  }

  async updateVillage(id: string, data: UpdateVillageDto): Promise<Village> {
    await this.simulateDelay();
    const existingVillageIndex = this.villages.findIndex(item => item.id === id);
    if (existingVillageIndex === -1) throw new Error('Village not found');
    
    let postOffice = this.villages[existingVillageIndex].postOffice;
    if (data.postOfficeId && data.postOfficeId !== this.villages[existingVillageIndex].postOfficeId) {
      postOffice = this.postOffices.find(po => po.id === data.postOfficeId);
      if (!postOffice) throw new Error('Post Office not found');
    }
    
    this.villages[existingVillageIndex] = { ...this.villages[existingVillageIndex], ...data, postOffice, updatedAt: new Date().toISOString() };
    return this.villages[existingVillageIndex];
  }

  async deleteVillage(id: string): Promise<void> {
    await this.simulateDelay();
    const existingVillage = this.villages.find(item => item.id === id);
    if (!existingVillage) throw new Error('Village not found');
    
    this.villages = this.villages.filter(item => item.id !== id);
  }

  // Get all data for tree view
  async getAllGeographyData(): Promise<{
    nationalities: Nationality[];
    divisions: Division[];
    districts: District[];
    subDistricts: Sub_District[];
    postOffices: Post_Office[];
    villages: Village[];
  }> {
    await this.simulateDelay(500);
    return {
      nationalities: this.nationalities,
      divisions: this.divisions,
      districts: this.districts,
      subDistricts: this.subDistricts,
      postOffices: this.postOffices,
      villages: this.villages,
    };
  }
}

export const geographyApi = new GeographyApiService();