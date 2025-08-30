import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Admission,
  CreateAdmissionDto,
  UpdateAdmissionDto,
  AdmissionFilters,
} from '../types';
import type { PaginatedResponse } from '~/shared/types/common';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

/**
 * Mock data for development
 */
// const mockAdmissions: Admission[] = [
//   {
//     id: 'a1',
//     admissionNumber: 1,
//     admissionDate: '2024-01-15',
//     registrationNumber: 'REG2024001',
//     guardianId: 'gd1',
//     studentId: 's1',
//     academicYearId: 'ay1',
//     academicClassId: 'ac1',
//     academicGroupId: 'ag1',
//     shiftId: 's1',
//     sectionId: 'sec1',
//     rollNumber: '001',
//     admissionFee: 5000,
//     status: STATUSES_OBJECT.ACTIVE,
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 'a2',
//     admissionNumber: 2,
//     admissionDate: '2024-01-20',
//     registrationNumber: 'REG2024002',
//     teacherId: 't1', // No guardian, using teacher
//     studentId: 's2',
//     academicYearId: 'ay1',
//     academicClassId: 'ac1',
//     academicGroupId: 'ag1',
//     shiftId: 's1',
//     sectionId: 'sec1',
//     rollNumber: '002',
//     admissionFee: 5000,
//     status: STATUSES_OBJECT.ACTIVE,
//     createdAt: new Date().toISOString(),
//   },
// ];

const mockAdmissions: Admission[] = [
  // --- previous ---
  {
    id: 'adm1',
    classRole: 1,
    admissionNumber: 1001,
    admissionDate: '2025-01-05',
    registrationNumber: 'REG-2025-001',
    guardianId: 'gdn1',
    studentId: 'st1',
    academicYearId: 'ay1',
    academicClassId: 'ac1',
    academicGroupId: 'ag1',
    shiftId: 's1',
    sectionId: 'sec1',
    rollNumber: 23,
    admissionFee: 5000,
    previousSchoolDetails: [
      {
        schoolName: 'Dhaka Government Primary School',
        className: 'Class 8',
        result: 4.5,
        tcNumber: 'TC12345',
        tcFileUrl: '',
        tcFileName: '',
        schoolPhone: '+880255556666',
        schoolEmail: 'info@dhakaps.edu.bd',
        details: 'Transferred after completing Class 8.',
      },
    ],
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
    student: { id: 'st1', firstName: 'Nafis', lastName: 'Rahman' },
    guardian: { id: 'gdn1', name: 'Abdul Karim' },
    academicYear: { id: 'ay1', name: '2024-2025' },
    academicClass: { id: 'ac1', name: 'Class 9' },
    academicGroup: { id: 'ag1', name: 'Science' },
  },
  {
    id: 'adm2',
    classRole: 2,
    admissionNumber: 1002,
    admissionDate: '2025-01-10',
    registrationNumber: 'REG-2025-002',
    teacherId: 't2',
    studentId: 'st2',
    academicYearId: 'ay1',
    academicClassId: 'ac3',
    academicGroupId: 'ag3',
    shiftId: 's2',
    sectionId: 'sec2',
    rollNumber:353,
    admissionFee: 6000,
    previousSchoolDetails: [
      {
        schoolName: 'Chittagong City School',
        className: 'Class 10',
        result: 5.0,
        tcNumber: 'TC67890',
        tcFileUrl: '',
        tcFileName: '',
        schoolPhone: '+880312345678',
        schoolEmail: 'admin@ctgcityschool.edu.bd',
        details: 'Completed SSC before admission.',
      },
    ],
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
    student: { id: 'st2', firstName: 'Moumita', lastName: 'Chowdhury' },
    teacher: { id: 't2', firstName: 'Farhana', lastName: 'Akter' },
    academicYear: { id: 'ay1', name: '2024-2025' },
    academicClass: { id: 'ac3', name: 'XI' },
    academicGroup: { id: 'ag3', name: 'Arts' },
  },

  // --- new (2 more) ---
  {
    id: 'adm3',
    classRole: 3,
    admissionNumber: 1003,
    admissionDate: '2025-01-18',
    registrationNumber: 'REG-2025-003',
    guardianId: 'gdn2',     // Shamsun Nahar
    studentId: 'st3',       // Arif Hossain
    academicYearId: 'ay1',
    academicClassId: 'ac2', // Class 10
    academicGroupId: 'ag2', // Commerce
    shiftId: 's1',          // Morning
    sectionId: 'sec2',      // B
    rollNumber: 5325,
    admissionFee: 5500,
    // no previousSchoolDetails to show optional case
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
    student: { id: 'st3', firstName: 'Arif', lastName: 'Hossain' },
    guardian: { id: 'gdn2', name: 'Shamsun Nahar' },
    academicYear: { id: 'ay1', name: '2024-2025' },
    academicClass: { id: 'ac2', name: 'Class 10' },
    academicGroup: { id: 'ag2', name: 'Commerce' },
  },
  {
    id: 'adm4',
    classRole: 4,
    admissionNumber: 1004,
    admissionDate: '2025-02-02',
    registrationNumber: 'REG-2025-004',
    teacherId: 't1',        // Rahim Uddin (no guardian case)
    studentId: 'st4',       // Sumaiya Islam
    academicYearId: 'ay1',
    academicClassId: 'ac1', // Class 9
    academicGroupId: 'ag1', // Science
    shiftId: 's2',          // Day
    sectionId: 'sec3',      // C
    rollNumber: 5345,
    admissionFee: 5200,
    previousSchoolDetails: [
      {
        schoolName: 'Modern School, Dhaka',
        className: 'Class 8',
        result: 4.2,
        tcNumber: 'TC88991',
        tcFileUrl: '',
        tcFileName: '',
        schoolPhone: '+88028880011',
        schoolEmail: 'contact@modernschool.edu.bd',
        details: 'Good academic standing.',
      },
    ],
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
    student: { id: 'st4', firstName: 'Sumaiya', lastName: 'Islam' },
    teacher: { id: 't1', firstName: 'Rahim', lastName: 'Uddin' },
    academicYear: { id: 'ay1', name: '2024-2025' },
    academicClass: { id: 'ac1', name: 'Class 9' },
    academicGroup: { id: 'ag1', name: 'Science' },
  },
];


/**
 * Admission API service class
 */
class AdmissionApiService extends BaseApiService {
  private admissions = [...mockAdmissions];
  private mockIdCounter = 100;
  private admissionNumberCounter = 3; // Next admission number

  /**
   * Get admissions with pagination and filtering
   */
  async getAdmissions(params: { page?: number; limit?: number; filters?: AdmissionFilters } = {}): Promise<PaginatedResponse<Admission>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.admissions];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(admission => 
        admission.admissionNumber.toString().includes(search) ||
        admission.rollNumber.toString().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(admission => admission.status === filters.status);
    }

    if (filters.academicYearId) {
      filtered = filtered.filter(admission => admission.academicYearId === filters.academicYearId);
    }

    if (filters.academicClassId) {
      filtered = filtered.filter(admission => admission.academicClassId === filters.academicClassId);
    }

    if (filters.academicGroupId) {
      filtered = filtered.filter(admission => admission.academicGroupId === filters.academicGroupId);
    }

    if (filters.admissionDateFrom) {
      filtered = filtered.filter(admission => 
        new Date(admission.admissionDate) >= new Date(filters.admissionDateFrom!)
      );
    }

    if (filters.admissionDateTo) {
      filtered = filtered.filter(admission => 
        new Date(admission.admissionDate) <= new Date(filters.admissionDateTo!)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  /**
   * Get admission by ID
   */
  async getAdmissionById(id: string): Promise<Admission> {
    await this.simulateDelay(200);
    const admission = this.admissions.find(a => a.id === id);
    if (!admission) {
      throw new Error('Admission not found');
    }
    return admission;
  }

  /**
   * Create new admission
   */
  async createAdmission(data: CreateAdmissionDto): Promise<Admission> {
    await this.simulateDelay(500);
    
    // Auto-generate class role if not provided
    const nextClassRole = this.getNextClassRole();
    const admissionWithClassRole = {
      ...data,
      classRole: data.classRole || nextClassRole,
    };
    
    const newAdmission: Admission = {
      id: `a${this.mockIdCounter++}`,
      admissionNumber: this.admissionNumberCounter++,
      ...admissionWithClassRole,
      createdAt: new Date().toISOString(),
    };
    
    this.admissions = [newAdmission, ...this.admissions];
    return newAdmission;
  }

  /**
   * Update admission
   */
  async updateAdmission(id: string, data: UpdateAdmissionDto): Promise<Admission> {
    await this.simulateDelay(500);
    const index = this.admissions.findIndex(admission => admission.id === id);
    if (index === -1) {
      throw new Error('Admission not found');
    }
    
    this.admissions[index] = { 
      ...this.admissions[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return this.admissions[index];
  }

  /**
   * Delete admission
   */
  async deleteAdmission(id: string): Promise<void> {
    await this.simulateDelay(300);
    const index = this.admissions.findIndex(admission => admission.id === id);
    if (index === -1) {
      throw new Error('Admission not found');
    }
    
    this.admissions = this.admissions.filter(admission => admission.id !== id);
  }

  /**
   * Get next admission number
   */
  async getNextAdmissionNumber(): Promise<number> {
    await this.simulateDelay(100);
    return this.admissionNumberCounter;
  }

  /**
   * Get next class role
   */
  private getNextClassRole(): number {
    if (this.admissions.length === 0) return 1; // Start with 1 if no admissions exist
    
    const highestRole = Math.max(...this.admissions.map(admission => {
      // Extract the numeric part from classRole (e.g., 1 from "1", 2 from "2", etc.)
      const roleMatch = admission.classRole?.toString().match(/^(\d+)/);
      return roleMatch ? parseInt(roleMatch[1], 10) : 0;
    }));
    
    return highestRole + 1;
  }
}

export const admissionApi = new AdmissionApiService();