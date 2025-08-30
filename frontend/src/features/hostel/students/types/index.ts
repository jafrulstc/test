import type { Student, Guardian, AcademicClass, StudentDetail, StudentFilters } from '~/shared/types/student';

/**
 * Create Student DTO
 */
export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  registrationNumber: string;
  dateOfBirth: string;
  gender?: string;
  bloodGroup?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  photoUrl?: string;
  guardianId: string;
  academicClassId: string;
}

/**
 * Update Student DTO
 */
export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  photoUrl?: string;
  roomId?: string;
  bedId?: string;
}

/**
 * Assign Hostel DTO
 */
export interface AssignHostelDto {
  roomId: string;
  bedId: string;
}

/**
 * Students pagination state
 */
export interface StudentsPaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Re-export shared types
export type { Student, Guardian, AcademicClass, StudentDetail, StudentFilters };