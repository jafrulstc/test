import BaseApiService from '~/shared/services/api/baseApi';
import type {
  StudentDetail,
  StudentFilters,
  CreateStudentDto,
  UpdateStudentDto,
  AssignHostelDto,
  Guardian,
  AcademicClass,
} from '../types';
import type { PaginatedResponse } from '~/shared/types/common';
import { mockStudents, mockGuardians, mockAcademicClasses } from './mockData';
import { roomsApi } from '~/features/hostel/rooms/services/roomsApi';

/**
 * Students API service class
 * Handles all student-related API operations
 */
class StudentsApiService extends BaseApiService {
  private students = [...mockStudents];
  private mockIdCounter = mockStudents.length + 1;

  /**
   * Get paginated list of students with optional filters
   */
  async getStudents(params: { 
    page?: number; 
    limit?: number; 
    filters?: StudentFilters; 
  }): Promise<PaginatedResponse<StudentDetail>> {
    await this.simulateDelay();

    const { page = 1, limit = 10, filters = {} } = params;
    let filteredStudents = [...this.students];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.firstName?.toLowerCase().includes(search) ||
          student.lastName?.toLowerCase().includes(search) ||
          student.registrationNumber?.toLowerCase().includes(search) ||
          student.email?.toLowerCase().includes(search),
      );
    }

    if (filters.gender) {
      filteredStudents = filteredStudents.filter((student) => student.gender === filters.gender);
    }

    if (filters.bloodGroup) {
      filteredStudents = filteredStudents.filter((student) => student.bloodGroup === filters.bloodGroup);
    }

    if (filters.academicClass) {
      filteredStudents = filteredStudents.filter((student) => student.academicClassId === filters.academicClass);
    }

    if (filters.roomStatus === 'assigned') {
      filteredStudents = filteredStudents.filter((student) => student.roomId && student.bedId);
    } else if (filters.roomStatus === 'unassigned') {
      filteredStudents = filteredStudents.filter((student) => !student.roomId || !student.bedId);
    }

    if (filters.guardian) {
      filteredStudents = filteredStudents.filter((student) => student.guardianId === filters.guardian);
    }

    const total = filteredStudents.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredStudents.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get student by ID
   */
  async getStudentById(id: string): Promise<StudentDetail> {
    await this.simulateDelay(300);
    const student = this.students.find((s) => s.id === id);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  /**
   * Create new student
   */
  async createStudent(studentData: CreateStudentDto): Promise<StudentDetail> {
    await this.simulateDelay();

    // Find related entities
    const guardian = mockGuardians.find((g) => g.id === studentData.guardianId);
    const academicClass = mockAcademicClasses.find((ac) => ac.id === studentData.academicClassId);

    if (!guardian) {
      throw new Error('Guardian not found');
    }

    if (!academicClass) {
      throw new Error('Academic class not found');
    }

    const newStudent: StudentDetail = {
      id: `s${this.mockIdCounter++}`,
      ...studentData,
      guardian,
      academicClass,
      createdAt: new Date().toISOString(),
    };

    this.students.unshift(newStudent);
    return newStudent;
  }

  /**
   * Update existing student
   */
  async updateStudent(id: string, data: UpdateStudentDto): Promise<StudentDetail> {
    await this.simulateDelay();
    const studentIndex = this.students.findIndex((s) => s.id === id);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    this.students[studentIndex] = {
      ...this.students[studentIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.students[studentIndex];
  }

  /**
   * Delete student
   */
  async deleteStudent(id: string): Promise<void> {
    await this.simulateDelay();
    const studentIndex = this.students.findIndex((s) => s.id === id);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    const student = this.students[studentIndex];

    // If student has a bed assigned, update the bed status to Available
    if (student.bedId) {
      try {
        await roomsApi.updateBedOccupancy(student.bedId);
      } catch (error) {
        console.warn('Failed to update bed occupancy:', error);
      }
    }

    this.students.splice(studentIndex, 1);
  }

  /**
   * Assign hostel to student
   */
  async assignHostel(id: string, data: AssignHostelDto): Promise<StudentDetail> {
    await this.simulateDelay();
    const studentIndex = this.students.findIndex((s) => s.id === id);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    const student = this.students[studentIndex];

    // Update bed occupancy in rooms API with enhanced student information
    try {
      await roomsApi.updateBedOccupancy(data.bedId, {
        id: student.id,
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        registrationNumber: student.registrationNumber || '',
        academicClass: student.academicClass
          ? {
              name: student.academicClass.name || '',
              section: student.academicClass.section || '',
              academicYear: student.academicClass.academicYear || '',
            }
          : undefined,
        contactNumber: student.contactNumber,
        email: student.email,
        bloodGroup: student.bloodGroup,
        guardian: student.guardian
          ? {
              firstName: student.guardian.firstName || '',
              lastName: student.guardian.lastName || '',
              relationship: student.guardian.relationship || '',
              contactNumber: student.guardian.contactNumber || '',
            }
          : undefined,
      });
    } catch (error) {
      console.error('Failed to update bed occupancy:', error);
      throw new Error('Failed to assign hostel: Could not update bed status');
    }

    // Update student with hostel assignment
    this.students[studentIndex] = {
      ...this.students[studentIndex],
      roomId: data.roomId,
      bedId: data.bedId,
      room: {
        id: data.roomId,
        roomNumber: `Room-${data.roomId}`,
        floor: '1st Floor',
        building: 'Main Building',
      },
      bed: {
        id: data.bedId,
        bedNumber: `Bed-${data.bedId}`,
      },
      updatedAt: new Date().toISOString(),
    };

    return this.students[studentIndex];
  }

  /**
   * Remove student from hostel
   */
  async removeFromHostel(id: string): Promise<StudentDetail> {
    await this.simulateDelay();
    const studentIndex = this.students.findIndex((s) => s.id === id);
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    const student = this.students[studentIndex];

    // Update bed occupancy in rooms API to make it available
    if (student.bedId) {
      try {
        await roomsApi.updateBedOccupancy(student.bedId);
      } catch (error) {
        console.warn('Failed to update bed occupancy:', error);
      }
    }

    const updatedStudent = {
      ...this.students[studentIndex],
      roomId: undefined,
      bedId: undefined,
      room: undefined,
      bed: undefined,
      updatedAt: new Date().toISOString(),
    };

    this.students[studentIndex] = updatedStudent;
    return updatedStudent;
  }

  /**
   * Get list of guardians
   */
  async getGuardians(): Promise<Guardian[]> {
    await this.simulateDelay(300);
    return mockGuardians;
  }

  /**
   * Get list of academic classes
   */
  async getAcademicClasses(): Promise<AcademicClass[]> {
    await this.simulateDelay(300);
    return mockAcademicClasses;
  }
}

export const studentsApi = new StudentsApiService();