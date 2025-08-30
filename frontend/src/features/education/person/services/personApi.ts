// '~/features/education/person/types/personApi'

import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Person,
  PersonDetails,
  CreatePersonDTO,
  UpdatePersonDTO,
  PersonFilter,
} from '~/features/education/person/types/personType';
import type { PaginatedResponse } from '~/shared/types/common';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

// ⬇️ generalApi থেকে designations / categories লাগবে
import { generalApi } from '~/features/core/services/generalApi';

// ... mockPersons আগের মতই থাকবে ...




const mockPersons: Person[] = [
  {
    id: 'p1',
    firstName: 'Rahim',
    lastName: 'Uddin',
    fatherName: 'Karim Uddin',
    motherName: 'Rokeya Begum',
    dateOfBirth: '2005-08-20',
    email: 'rahim.uddin@example.com',
    healthCondition: 'Excellent',
    nidNumber: '123456789012345',
    brnNumber: 'BRN-ABC-12345',
    fatherNidNumber: '987654321098765',
    motherBrnNumber: 'MBRN-DEF-67890',
    phone: null,
    emergencyCont: null,
    maritalStatusId: 'ms1',
    genderId: 'g1', // Male
    bloodGroupId: 'bg1', // A+
    religionId: 'r1', // Islam
    nationalityId: 'n1', // Assuming 'n1' for Bangladeshi
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1', // Assuming d1 for Dhaka
      districtId: 'dt1', // Assuming dt1 for Dhaka
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
    photo: '/photos/rahim.jpg',
    nidFile: '/files/rahim_nid.pdf',
    brnFile: '/files/rahim_brn.pdf',
    fatherNidFile: '/files/karim_nid.pdf',
    motherNidFile: '/files/rokeya_nid.pdf', // Assuming mother also has NID
    digitalSignatureFile: '/signatures/rahim_signature.png',
    personCategoryId: 'pc1', // student
    designationCategoryId: undefined,
    designationId: undefined,
    status: STATUSES_OBJECT.ACTIVE,
    necessary: {
      genderName: 'Male',
      bloodGroupName: 'A+',
      religionName: 'Islam',
      nationalityName: 'Bangladeshi', // Assuming 'n1' corresponds to 'Bangladeshi'
      nidFileName: 'rahim_nid.pdf',
      brnFileName: 'rahim_brn.pdf',
      fatherNidFileName: 'karim_nid.pdf',
      motherNidFileName: 'rokeya_nid.pdf',
      digitalSignatureFileName: 'rahim_signature.png',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    firstName: 'Fatima',
    lastName: 'Begum',
    fatherName: 'Abul Hossain',
    motherName: 'Khaleda Akter',
    dateOfBirth: '1985-11-22',
    email: 'fatima.begum@example.com',
    healthCondition: 'Asthma (managed)',
    nidNumber: '987654321098765',
    brnNumber: 'BRN-GHI-54321',
    fatherNidNumber: '112233445566778',
    motherBrnNumber: 'MBRN-JKL-98765',
    phone: null,
    emergencyCont: null,
    genderId: 'g2', // Female
    bloodGroupId: 'bg3', // B+
    religionId: 'r1', // Islam
    nationalityId: 'n1', // Assuming 'n1' for Bangladeshi
    maritalStatusId: 'ms2',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2', // Assuming d2 for Chittagong
      districtId: 'dt2', // Assuming dt2 for Chittagong
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
    photo: '/photos/fatima.jpg',
    nidFile: '/files/fatima_nid.pdf',
    brnFile: '/files/fatima_brn.pdf',
    fatherNidFile: '/files/abul_nid.pdf',
    motherNidFile: '/files/khaleda_nid.pdf',
    digitalSignatureFile: '/signatures/fatima_signature.png',
    personCategoryId: 'pc2', // staff
    designationCategoryId: 'dc1', // Teaching Staff
    designationId: 'd1', // Teacher
    status: STATUSES_OBJECT.ACTIVE,
    necessary: {
      genderName: 'Female',
      bloodGroupName: 'B+',
      religionName: 'Islam',
      nationalityName: 'Bangladeshi',
      nidFileName: 'fatima_nid.pdf',
      brnFileName: 'fatima_brn.pdf',
      fatherNidFileName: 'abul_nid.pdf',
      motherNidFileName: 'khaleda_nid.pdf',
      digitalSignatureFileName: 'fatima_signature.png',
    },
    createdAt: new Date().toISOString(),
  },
];

class PersonApiService extends BaseApiService {
  public persons = [...mockPersons];
  private mockIdCounter = 200;


  /** Pagination + filtering */
  async getPersons(params: { page?: number; limit?: number; filters?: PersonFilter } = {}): Promise<PaginatedResponse<Person>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.persons];

    if (filters.firstName) filtered = filtered.filter(p => p.firstName.toLowerCase().includes(filters.firstName!.toLowerCase()));
    if (filters.lastName) filtered = filtered.filter(p => p.lastName.toLowerCase().includes(filters.lastName!.toLowerCase()));
    if (filters.fatherName) filtered = filtered.filter(p => p.fatherName.toLowerCase().includes(filters.fatherName!.toLowerCase()));
    if (filters.motherName) filtered = filtered.filter(p => p.motherName?.toLowerCase().includes(filters.motherName!.toLowerCase()));
    if (filters.email) filtered = filtered.filter(p => p.email?.toLowerCase().includes(filters.email!.toLowerCase()));
    if (filters.nidNumber) filtered = filtered.filter(p => p.nidNumber?.includes(filters.nidNumber!));
    if (filters.brnNumber) filtered = filtered.filter(p => p.brnNumber?.includes(filters.brnNumber!));

    if (filters.status) filtered = filtered.filter(p => p.status === filters.status);
    if (filters.genderId) filtered = filtered.filter(p => p.genderId === filters.genderId);
    if (filters.bloodGroupId) filtered = filtered.filter(p => p.bloodGroupId === filters.bloodGroupId);
    if (filters.religionId) filtered = filtered.filter(p => p.religionId === filters.religionId);
    if (filters.nationalityId) filtered = filtered.filter(p => p.nationalityId === filters.nationalityId);



    if (filters.personCategoryId) {
      filtered = filtered.filter(p => p.personCategoryId === filters.personCategoryId);
    }

    if (filters.designationCategoryId) {
      filtered = filtered.filter(p => p.designationCategoryId === filters.designationCategoryId);
    }

    if (filters.designationId) {
      filtered = filtered.filter(p => p.designationId === filters.designationId);
    }

    // (optional) যদি search ব্যবহার করো:
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.firstName.toLowerCase().includes(s) ||
        p.lastName.toLowerCase().includes(s) ||
        p.email?.toLowerCase().includes(s) ||
        p.nidNumber?.includes(s) ||
        p.brnNumber?.includes(s)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  /** Get person by ID */
  async getPersonById(id: string): Promise<Person> {
    await this.simulateDelay(200);
    const person = this.persons.find(p => p.id === id);
    if (!person) throw new Error('Person not found');
    return person;
  }
  /** Get PersonDetails (same data, শুধু UI তে lookup join করবে redux থেকে) */
  async getPersonDetailsById(id: string): Promise<PersonDetails> {
    const person = await this.getPersonById(id);
    return { ...person }; // এখন সরাসরি Person = PersonDetails
  }

  async getPersonsByIds(ids: string[]): Promise<Person[]> {
    await this.simulateDelay(100);
    const set = new Set(ids);
    return this.persons.filter(p => set.has(p.id));
  }
  /** Create */
  async createPerson(data: CreatePersonDTO): Promise<Person> {
    await this.simulateDelay(500);
    const newPerson: Person = {
      id: `p${this.mockIdCounter++}`,
      ...data,
      status: STATUSES_OBJECT.ACTIVE,
      createdAt: new Date().toISOString(),
    };
    this.persons = [newPerson, ...this.persons];
    return newPerson;
  }

  /** Update */
  async updatePerson(id: string, data: UpdatePersonDTO): Promise<Person> {
    await this.simulateDelay(500);
    const index = this.persons.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Person not found');
    this.persons[index] = { ...this.persons[index], ...data, updatedAt: new Date().toISOString() };
    return this.persons[index];
  }

  /** Delete */
  async deletePerson(id: string): Promise<void> {
    await this.simulateDelay(300);
    this.persons = this.persons.filter(p => p.id !== id);
  }

  /** For dropdown */
  async getAllPersonsForDropdown(): Promise<{ id: string; firstName: string; lastName: string }[]> {
    await this.simulateDelay(200);
    return this.persons.map(p => ({ id: p.id, firstName: p.firstName, lastName: p.lastName }));
  }

  /**
   * 🔎 NEW: Search persons by meta (category/designation) + extra filters
   */
  async findPersonsByMeta(params: {
    page?: number;
    limit?: number;
    personCategoryId?: string;
    designationCategoryId?: string;
    designationId?: string;
    filters?: PersonFilter;
  } = {}): Promise<PaginatedResponse<Person>> {
    const {
      page = 1,
      limit = 10,
      personCategoryId,
      designationCategoryId,
      designationId,
      filters = {},
    } = params;

    const merged: PersonFilter = { ...filters };

    if (personCategoryId) merged.personCategoryId = personCategoryId;

    // If designationId is provided, ensure/derive its category
    if (designationId) {
      merged.designationId = designationId;
      if (!designationCategoryId) {
        // derive designationCategoryId from generalApi
        const { data: allDesignations } = await generalApi.getDesignations({ page: 1, limit: 1000 });
        const match = allDesignations.find(d => d.id === designationId);
        if (match) merged.designationCategoryId = match.designationCategoryId;
      } else {
        merged.designationCategoryId = designationCategoryId;
      }
    } else if (designationCategoryId) {
      merged.designationCategoryId = designationCategoryId;
    }

    return this.getPersons({ page, limit, filters: merged });
  }
}

export const personApi = new PersonApiService();
