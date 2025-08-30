// '~/features/education/students/types/studentApi'

import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
  StudentFilters,
  StudentLegacyFlat,
} from '../types';
import type { PaginatedResponse, Status } from '~/shared/types/common';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

import type { Person, PersonFilter } from '~/features/education/person/types/personType';
import { personApi } from '~/features/education/person/services/personApi';

// ⬇️ person category resolve করার জন্য generalApi দরকার
import { generalApi } from '~/features/core/services/generalApi';

/** ✅ মিনিমাল স্টোরেজ */
const mockStudentsMinimal: Student[] = [
  { id: 'st1', personStudentId: 'p1', status: STATUSES_OBJECT.ACTIVE, createdAt: new Date().toISOString() },
  { id: 'st2', personStudentId: 'p2', status: STATUSES_OBJECT.ACTIVE, createdAt: new Date().toISOString() },
];

function toLegacyFlat(st: Student, p?: Person | null): StudentLegacyFlat {
  return {
    id: st.id,
    createdAt: (st as any).createdAt,
    updatedAt: (st as any).updatedAt,

    personStudentId: st.personStudentId,
    status: st.status as Status,

    firstName: p?.firstName ?? '',
    lastName: p?.lastName ?? '',
    fatherName: p?.fatherName ?? '',
    motherName: p?.motherName,
    dateOfBirth: p?.dateOfBirth ?? '',
    email: p?.email,
    healthCondition: p?.healthCondition,
    nidNumber: p?.nidNumber,
    brnNumber: p?.brnNumber,

    genderId: p?.genderId ?? '',
    bloodGroupId: p?.bloodGroupId,
    religionId: p?.religionId,
    nationalityId: p?.nationalityId,

    presentAddress: p?.presentAddress,
    permanentAddress: p?.permanentAddress,
    sameAsPresent: p?.sameAsPresent,

    photo: p?.photo,
    nidFile: p?.nidFile,
    brnFile: p?.brnFile,
    fatherNidFile: p?.fatherNidFile,
    motherNidFile: p?.motherNidFile,
    digitalSignatureFile: p?.digitalSignatureFile,

    studentNidFileName: p?.necessary?.nidFileName,
    studentBrnFileName: p?.necessary?.brnFileName,
    fatherNidFileName: p?.necessary?.fatherNidFileName,
    motherNidFileName: p?.necessary?.motherNidFileName,
    digitalSignatureFileName: p?.necessary?.digitalSignatureFileName,
    genderName: p?.necessary?.genderName,
    bloodGroupName: p?.necessary?.bloodGroupName,
    religionName: p?.necessary?.religionName,
    nationalityName: p?.necessary?.nationalityName,
  };
}

class StudentApiService extends BaseApiService {
  private students: Student[] = [...mockStudentsMinimal];
  private mockIdCounter = 1000;

  /** 🔐 cache for resolved 'student' category id */
  private studentCategoryIdCache: string | null = null;

  /** Resolve and cache PersonCategory.id for name 'student' */
  private async resolveStudentCategoryId(): Promise<string> {
    if (this.studentCategoryIdCache) return this.studentCategoryIdCache;
    const { data: cats } = await generalApi.getPersonCategories({ page: 1, limit: 100 });
    const found = cats.find(pc => pc.name.toLowerCase() === 'student');
    if (!found) throw new Error('Person category "student" not found');
    this.studentCategoryIdCache = found.id;
    return found.id;
  }

  /** guard: given personId must be of student category */
  private async ensureStudentPerson(personId: string): Promise<void> {
    const studentId = await this.resolveStudentCategoryId();
    const p = await personApi.getPersonById(personId);
    if (p.personCategoryId !== studentId) {
      throw new Error('Linked person is not a student category');
    }
  }

  /** batch join + paginate -> legacy flat */
  private async pageAndProject(
    list: Student[],
    page: number,
    limit: number,
    /** If true, filter to only student-category persons */
    enforceStudentCategory = true
  ): Promise<PaginatedResponse<StudentLegacyFlat>> {
    let effective = [...list];

    if (enforceStudentCategory) {
      const studentId = await this.resolveStudentCategoryId();
      // keep only those whose linked person is student
      const persons = await personApi.getPersons({
        page: 1,
        limit: 10000,
        filters: { personCategoryId: studentId },
      });
      const allow = new Set(persons.data.map(p => p.id));
      effective = effective.filter(s => allow.has(s.personStudentId));
    }

    const total = effective.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const slice = effective.slice(startIndex, startIndex + limit);

    // batch persons for the page
    const personIds = slice.map(s => s.personStudentId);
    const people = await personApi.getPersonsByIds(personIds);
    const map = new Map(people.map(p => [p.id, p]));

    const data = slice.map(st => toLegacyFlat(st, map.get(st.personStudentId)));
    return { data, total, page, limit, totalPages };
  }

  /** ✅ শুধুই student-ক্যাটাগরির Person লিস্ট */
  // async getStudentPersons(params: {
  //   page?: number;
  //   limit?: number;
  //   filters?: PersonFilter;
  // } = {}): Promise<PaginatedResponse<Person>> {
  //   const { page = 1, limit = 10, filters = {} } = params;
  //   const studentId = await this.resolveStudentCategoryId();
  //   const merged: PersonFilter = { ...filters, personCategoryId: studentId };
  //   return personApi.getPersons({ page, limit, filters: merged });
  // }

  async getStudentPersons(params: {
    page?: number;
    limit?: number;
    filters?: PersonFilter;
    /** NEW: exclude persons already assigned as Student */
    onlyUnassigned?: boolean;
    /** NEW: keep this person in list even if assigned (edit mode) */
    includePersonId?: string;
  } = {}): Promise<PaginatedResponse<Person>> {
    await this.simulateDelay(200);
    const {
      page = 1,
      limit = 10,
      filters = {},
      onlyUnassigned = false,
      includePersonId,
    } = params;

    // 1) শুধু personCategory = student
    const studentCatId = await this.resolveStudentCategoryId();
    const base = await personApi.getPersons({
      page: 1,
      limit: 10000,
      filters: { ...filters, personCategoryId: studentCatId },
    });

    let list = [...base.data];

    // 2) already-assigned বাদ
    if (onlyUnassigned) {
      const assigned = new Set(this.students.map(s => s.personStudentId));
      if (includePersonId) assigned.delete(includePersonId); // edit মোডে allow
      list = list.filter(p => !assigned.has(p.id));
    }

    // 3) paginate
    const total = list.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = list.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }


  /** ✅ Students list (legacy-flat), default: only student-linked */
  async getStudents(params: {
    page?: number;
    limit?: number;
    filters?: StudentFilters;
    enforceStudentCategory?: boolean; // default true
  } = {}): Promise<PaginatedResponse<StudentLegacyFlat>> {
    await this.simulateDelay(300);
    const {
      page = 1,
      limit = 10,
      filters = {},
      enforceStudentCategory = true,
    } = params;

    let filtered = [...this.students];

    // student-level
    if (filters.status) filtered = filtered.filter(s => s.status === filters.status);

    // person-level modern
    if (filters.person) {
      const res = await personApi.getPersons({ page: 1, limit: 10000, filters: filters.person });
      const set = new Set(res.data.map(p => p.id));
      filtered = filtered.filter(s => set.has(s.personStudentId));
    }

    // legacy helpers
    const legacy = async (pf: PersonFilter) => {
      const res = await personApi.getPersons({ page: 1, limit: 10000, filters: pf });
      const set = new Set(res.data.map(p => p.id));
      filtered = filtered.filter(s => set.has(s.personStudentId));
    };

    if (filters.search) await legacy({ search: filters.search });
    if (filters.genderId) await legacy({ genderId: filters.genderId });
    if (filters.bloodGroupId) await legacy({ bloodGroupId: filters.bloodGroupId });
    if (filters.religionId) await legacy({ religionId: filters.religionId });
    if (filters.nationalityId) await legacy({ nationalityId: filters.nationalityId });

    return this.pageAndProject(filtered, page, limit, enforceStudentCategory);
  }

  /** ✅ single (legacy-flat) + category guard */
  async getStudentById(id: string): Promise<StudentLegacyFlat> {
    await this.simulateDelay(200);
    const st = this.students.find(s => s.id === id);
    if (!st) throw new Error('Student not found');
    await this.ensureStudentPerson(st.personStudentId);
    const p = await personApi.getPersonById(st.personStudentId);
    return toLegacyFlat(st, p);
  }

  /** ✅ Create (link OR inline) + enforce student category */
  async createStudent(data: CreateStudentDto): Promise<StudentLegacyFlat> {
    await this.simulateDelay(500);
    const studentId = await this.resolveStudentCategoryId();

    let personId: string;
    if ('personStudentId' in data) {
      personId = data.personStudentId;
      await this.ensureStudentPerson(personId);
    } else {
      // inline person create: force category = student
      const payload = { ...data.person, personCategoryId: studentId };
      const newPerson = await personApi.createPerson(payload);
      personId = newPerson.id;
    }

    const newStudent: Student = {
      id: `s${this.mockIdCounter++}`,
      personStudentId: personId,
      status: data.status,
      createdAt: new Date().toISOString(),
    };

    this.students = [newStudent, ...this.students];
    const p = await personApi.getPersonById(personId);
    return toLegacyFlat(newStudent, p);
  }

  /** ✅ Update + enforce student category + ignore category changes in personPatch */
  async updateStudent(id: string, data: UpdateStudentDto): Promise<StudentLegacyFlat> {
    await this.simulateDelay(500);
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Student not found');

    // optional relink
    if (data.personStudentId) {
      await this.ensureStudentPerson(data.personStudentId);
      this.students[idx].personStudentId = data.personStudentId;
    }

    // status update
    if (typeof data.status !== 'undefined') {
      this.students[idx].status = data.status;
    }

    // optional person patch (strip personCategoryId to prevent cross-category flip)
    if (data.personPatch) {
      const { personCategoryId: _ignored, ...rest } = data.personPatch as any;
      await personApi.updatePerson(this.students[idx].personStudentId, rest);
    }

    this.students[idx] = { ...this.students[idx], updatedAt: new Date().toISOString() };
    const p = await personApi.getPersonById(this.students[idx].personStudentId);
    return toLegacyFlat(this.students[idx], p);
  }

  async deleteStudent(id: string): Promise<void> {
    await this.simulateDelay(300);
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Student not found');
    this.students = this.students.filter(s => s.id !== id);
  }

  /** Dropdown (names from linked Person) — only student persons */
  async getAllStudentsForDropdown(): Promise<{ id: string; firstName: string; lastName: string }[]> {
    await this.simulateDelay(200);
    const studentPersons = await this.getStudentPersons({ page: 1, limit: 10000 });
    const map = new Map(studentPersons.data.map(p => [p.id, p]));
    return this.students
      .filter(s => map.has(s.personStudentId))
      .map(s => {
        const p = map.get(s.personStudentId)!;
        return { id: s.id, firstName: p.firstName ?? '', lastName: p.lastName ?? '' };
      });
  }

  /** (optional) raw */
  async getStudentRawById(id: string): Promise<Student> {
    await this.simulateDelay(100);
    const st = this.students.find(s => s.id === id);
    if (!st) throw new Error('Student not found');
    return st;
  }
}

export const studentApi = new StudentApiService();
