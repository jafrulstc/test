// features/education/staff/services/staffApi.ts
import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  StaffFilters,
  StaffDetail,
} from '../types/staffType';
import type { PaginatedResponse } from '~/shared/types/common';
import { personApi } from '~/features/education/person/services/personApi';
import type { Person } from '~/features/education/person/types/personType';
import { generalApi } from '~/features/core/services/generalApi';
import { geographyApi } from '~/features/core/services/geographyApi';

/** ------------------------------
 * Mock Staffs (FK → Person only)
 * ------------------------------ */
const mockStaffs: Staff[] = [
  {
    id: 't1',
    // FK to a STAFF person (ensure your mock persons have this id)
    personStaffId: 'p2',

    educationalQualifications: [
      { id: 'eq1', degreeName: 'B.Sc in Mathematics', institution: 'University of Dhaka', year: '2007', grade: 'First Class' },
      { id: 'eq2', degreeName: 'M.Sc in Mathematics', institution: 'University of Dhaka', year: '2009', grade: 'First Class' },
    ],
    professionalExperience: [
      { id: 'pe1', companyName: 'Dhaka College', jobTitle: 'Lecturer', startDate: '2010-01-01', endDate: '2015-12-31', responsibilities: 'Teaching Mathematics.' },
      { id: 'pe2', companyName: 'Notre Dame College', jobTitle: 'Assistant Professor', startDate: '2016-01-01', responsibilities: 'Advanced Mathematics & Algebra.' },
    ],
    references: [
      { id: 'ref1', name: 'Prof. Jamal Uddin', relationship: 'Former Supervisor', contactNumber: '+8801711888899', email: 'jamal.uddin@du.ac.bd' },
    ],

    salaryExpectation: 60000,
    joiningDate: '2025-01-15',
    digitalSignatureUrl: '',
    yearsOfExperience: 15,
    noticePeriod: '2 months',

    subjectIds: ['sub1', 'sub3'],
    gradeLevelIds: ['gl2', 'gl3'],
    languageProficiencyIds: ['lp1', 'lp2'],

    computerSkills: 'MS Office, Google Classroom, LaTeX',
    teachingMethodology: 'Interactive learning.',
    onlineProfiles: { linkedin: '' },
    details: 'Dedicated Mathematics staff.',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

/** ===========================
 * Staff API service class
 * =========================== */
class StaffApiService extends BaseApiService {
  private staffs = [...mockStaffs];
  private mockIdCounter = 1000;


  /** resolve person category id for STAFF */
  private async resolveStaffCategoryId(): Promise<string | null> {
    const cats = await generalApi.getPersonCategories({ page: 1, limit: 1000, filters: {} });
    const staff = cats.data.find(c => c.name.toLowerCase() === 'staff');
    return staff?.id ?? null;
  }

  /** ✅ resolve designation category id for "Teaching Staff" (by name) */
  private async resolveTeachingDesignationCategoryId(): Promise<string | null> {
    const cats = await generalApi.getDesignationCategories({ page: 1, limit: 1000, filters: {} });
    const teaching = cats.data.find(c => c.name.toLowerCase() === 'teaching staff');
    return teaching?.id ?? null;
  }

  // ...

  /** ✅ Assignable STAFF persons (not yet staffs) — but only Teaching Staff */
  async getAssignableStaffPersons(params: {
    page?: number;
    limit?: number;
    includePersonId?: string;
    search?: string;
  } = {}): Promise<PaginatedResponse<Person>> {
    await this.simulateDelay(150);
    const { page = 1, limit = 10, includePersonId, search } = params;

    const staffCatId = await this.resolveStaffCategoryId();
    const teachingCatId = await this.resolveTeachingDesignationCategoryId();

    // যদি কোনটা না পাওয়া যায়, খালি রেজাল্ট ফেরত দেই
    if (!staffCatId || !teachingCatId) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }

    // সব STAFF person নিয়ে আসি
    const personsRes = await personApi.getPersons({
      page: 1,
      limit: 10000,
      filters: { personCategoryId: staffCatId },
    });

    // already-assigned staffs বাদ
    const assigned = new Set(this.staffs.map(t => t.personStaffId));
    if (includePersonId) assigned.delete(includePersonId); // edit মোডে current allow

    // ✅ কেবল Teaching Staff category-র লোকেরা + not assigned
    let pool = personsRes.data.filter(p =>
      !assigned.has(p.id) &&
      p.designationCategoryId === teachingCatId
    );

    // includePersonId থাকলে—সেটাকে সবসময় তালিকায় রাখি (যদি আগের ফিল্টারে বাদ পড়ে)
    if (includePersonId) {
      const current = personsRes.data.find(p => p.id === includePersonId);
      if (current) {
        pool = [current, ...pool.filter(p => p.id !== includePersonId)];
      }
    }

    // Optional search
    if (search) {
      const s = search.toLowerCase();
      pool = pool.filter(p =>
        p.firstName.toLowerCase().includes(s) ||
        p.lastName.toLowerCase().includes(s) ||
        (p.email ?? '').toLowerCase().includes(s)
      );
    }

    // paginate
    const total = pool.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = pool.slice(start, start + limit);

    return { data, total, page, limit, totalPages };
  }

  /** Build lookup maps for names */
  private async buildLookups() {
    const simple = await generalApi.getAllSimpleEntities(); // designations, designationCategories, genders, bloodGroups, maritalStatuses, etc.
    const geo = await geographyApi.getAllGeographyData();
    const toMap = <T extends { id: string; name: string }>(arr: T[] = []) =>
      new Map(arr.map(x => [x.id, x.name]));

    return {
      designationNames: toMap(simple.designations ?? []),
      designationCategoryNames: toMap(simple.designationCategories ?? []),
      genderNames: toMap(simple.genders ?? []),
      bloodGroupNames: toMap(simple.bloodGroups ?? []),
      maritalStatusNames: toMap(simple.maritalStatuses ?? []),
      nationalityNames: toMap(geo.nationalities ?? []),
    };
  }

  /** Batch persons by ids -> Map */
  private async personsMapByIds(ids: string[]): Promise<Map<string, Person>> {
    if (ids.length === 0) return new Map();
    const uniq = Array.from(new Set(ids));
    const people = await personApi.getPersonsByIds(uniq);
    return new Map(people.map(p => [p.id, p]));
  }

  /** Project a Staff + Person + lookups => StaffDetail */
  private toDetail(
    t: Staff,
    person: Person | undefined,
    L: Awaited<ReturnType<typeof this.buildLookups>>
  ): StaffDetail {
    // designations/categories derive from Person (not Staff)
    const desigs = person?.designationId
      ? [{ id: person.designationId, name: L.designationNames.get(person.designationId) ?? '' }]
      : undefined;

    const desigCats = person?.designationCategoryId
      ? [{ id: person.designationCategoryId, name: L.designationCategoryNames.get(person.designationCategoryId) ?? '' }]
      : undefined;

    // person snapshot (subset)
    const personSnap = person
      ? {
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        fatherName: person.fatherName,
        motherName: person.motherName,
        dateOfBirth: person.dateOfBirth,
        email: person.email,
        phone: person.phone,
        emergencyCont: person.emergencyCont,
        genderId: person.genderId,
        bloodGroupId: person.bloodGroupId,
        nationalityId: person.nationalityId,
        maritalStatusId: person.maritalStatusId,
        presentAddress: person.presentAddress,
        permanentAddress: person.permanentAddress,
        sameAsPresent: person.sameAsPresent,
        photo: person.photo,
        digitalSignatureFile: person.digitalSignatureFile,
        status: person.status,
      }
      : null;

    return {
      ...t,
      person: personSnap,

      // optional lookup names
      gender: person?.genderId ? { id: person.genderId, name: L.genderNames.get(person.genderId) ?? '' } : undefined,
      bloodGroup: person?.bloodGroupId ? { id: person.bloodGroupId, name: L.bloodGroupNames.get(person.bloodGroupId) ?? '' } : undefined,
      nationality: person?.nationalityId ? { id: person.nationalityId, name: L.nationalityNames.get(person.nationalityId) ?? '' } : undefined,
      maritalStatus: person?.maritalStatusId ? { id: person.maritalStatusId, name: L.maritalStatusNames.get(person.maritalStatusId) ?? '' } : undefined,

      designations: desigs,
      designationCategories: desigCats,
    };
  }

  /** Main list with filters + pagination + populated details */
  async getStaffs(
    params: { page?: number; limit?: number; filters?: StaffFilters } = {}
  ): Promise<PaginatedResponse<StaffDetail>> {
    await this.simulateDelay(250);
    const { page = 1, limit = 10, filters = {} } = params;

    // Work on a copy
    let list = [...this.staffs];

    // Person join (for search + person-derived filters)
    const personIds = list.map(t => t.personStaffId);
    const pMap = await this.personsMapByIds(personIds);

    // Text search on person fields (first/last/email/phone)
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(t => {
        const p = pMap.get(t.personStaffId);
        if (!p) return false;
        const nameHit =
          p.firstName.toLowerCase().includes(s) ||
          p.lastName.toLowerCase().includes(s);
        const emailHit = (p.email ?? '').toLowerCase().includes(s);
        const phoneHit = (p.phone != null ? String(p.phone) : '').includes(s);
        return nameHit || emailHit || phoneHit;
      });
    }

    // staff.status
    if (filters.status) {
      list = list.filter(t => t.status === filters.status);
    }

    // person-derived filters
    if (filters.genderId) {
      list = list.filter(t => pMap.get(t.personStaffId)?.genderId === filters.genderId);
    }
    if (filters.nationalityId) {
      list = list.filter(t => pMap.get(t.personStaffId)?.nationalityId === filters.nationalityId);
    }
    if (filters.maritalStatusId) {
      list = list.filter(t => pMap.get(t.personStaffId)?.maritalStatusId === filters.maritalStatusId);
    }

    // teaching filters
    if (filters.subjectId) {
      list = list.filter(t => t.subjectIds.includes(filters.subjectId!));
    }
    if (filters.gradeLevelId) {
      list = list.filter(t => t.gradeLevelIds.includes(filters.gradeLevelId!));
    }
    if (filters.languageProficiencyId) {
      list = list.filter(t => t.languageProficiencyIds.includes(filters.languageProficiencyId!));
    }
    if (filters.subjectIds?.length) {
      list = list.filter(t => t.subjectIds.some(id => filters.subjectIds!.includes(id)));
    }
    if (filters.gradeLevelIds?.length) {
      list = list.filter(t => t.gradeLevelIds.some(id => filters.gradeLevelIds!.includes(id)));
    }
    if (filters.languageProficiencyIds?.length) {
      list = list.filter(t => t.languageProficiencyIds.some(id => filters.languageProficiencyIds!.includes(id)));
    }

    // designation filter (now via Person.designationId)
    if (filters.designationIds?.length) {
      list = list.filter(t => {
        const p = pMap.get(t.personStaffId);
        return p?.designationId ? filters.designationIds!.includes(p.designationId) : false;
      });
    }

    // paginate
    const total = list.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const slice = list.slice(startIndex, startIndex + limit);

    // populate
    const L = await this.buildLookups();
    const pagePersonIds = slice.map(t => t.personStaffId);
    const pagePMap = await this.personsMapByIds(pagePersonIds);
    const data = slice.map(t => this.toDetail(t, pagePMap.get(t.personStaffId), L));

    return { data, total, page, limit, totalPages };
  }

  /** Single-by-id with populated details */
  async getStaffById(id: string): Promise<StaffDetail> {
    await this.simulateDelay(150);
    const t = this.staffs.find(x => x.id === id);
    if (!t) throw new Error('Staff not found');

    const L = await this.buildLookups();
    const p = await personApi.getPersonById(t.personStaffId);
    return this.toDetail(t, p, L);
  }

  /** Create */
  async createStaff(data: CreateStaffDto): Promise<Staff> {
    await this.simulateDelay(300);

    // Validate person exists and is STAFF
    const person = await personApi.getPersonById(data.personStaffId);
    const staffCat = await this.resolveStaffCategoryId();
    if (!staffCat || person.personCategoryId !== staffCat) {
      throw new Error('Selected person is not a STAFF category person');
    }

    // Generate IDs for nested arrays
    const educationalQualifications =
      (data.educationalQualifications ?? []).map((eq, i) => ({ ...eq, id: `eq${this.mockIdCounter + i}` }));
    const professionalExperience =
      (data.professionalExperience ?? []).map((pe, i) => ({ ...pe, id: `pe${this.mockIdCounter + 100 + i}` }));
    const references =
      (data.references ?? []).map((r, i) => ({ ...r, id: `ref${this.mockIdCounter + 200 + i}` }));

    // Prevent duplicate assignment of same staff → staff
    if (this.staffs.some(t => t.personStaffId === data.personStaffId)) {
      throw new Error('This staff person is already assigned as a staff');
    }

    const newStaff: Staff = {
      id: `t${this.mockIdCounter++}`,
      personStaffId: data.personStaffId,

      educationalQualifications,
      professionalExperience,
      references,

      salaryExpectation: data.salaryExpectation,
      joiningDate: data.joiningDate,
      digitalSignatureUrl: data.digitalSignatureUrl,
      yearsOfExperience: data.yearsOfExperience,
      noticePeriod: data.noticePeriod,

      subjectIds: data.subjectIds ?? [],
      gradeLevelIds: data.gradeLevelIds ?? [],
      languageProficiencyIds: data.languageProficiencyIds ?? [],

      computerSkills: data.computerSkills,
      teachingMethodology: data.teachingMethodology,
      onlineProfiles: data.onlineProfiles,

      details: data.details,
      status: data.status,
      createdAt: new Date().toISOString(),
    };

    this.staffs = [newStaff, ...this.staffs];
    return newStaff;
  }

  /** Update */
  async updateStaff(id: string, data: UpdateStaffDto): Promise<Staff> {
    await this.simulateDelay(300);
    const idx = this.staffs.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Staff not found');

    // If personStaffId is being changed, validate staff + uniqueness
    if (data.personStaffId && data.personStaffId !== this.staffs[idx].personStaffId) {
      const person = await personApi.getPersonById(data.personStaffId);
      const staffCat = await this.resolveStaffCategoryId();
      if (!staffCat || person.personCategoryId !== staffCat) {
        throw new Error('Selected person is not a STAFF category person');
      }
      if (this.staffs.some(t => t.personStaffId === data.personStaffId)) {
        throw new Error('This staff person is already assigned as a staff');
      }
    }

    this.staffs[idx] = {
      ...this.staffs[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.staffs[idx];
  }

  /** Delete */
  async deleteStaff(id: string): Promise<void> {
    await this.simulateDelay(150);
    const before = this.staffs.length;
    this.staffs = this.staffs.filter(t => t.id !== id);
    if (this.staffs.length === before) throw new Error('Staff not found');
  }

}

export const staffApi = new StaffApiService();
