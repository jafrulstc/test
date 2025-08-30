import type { BaseEntity, Status } from '~/shared/types/common';
import { USER_TYPE } from '../constant/boardingConst';

/**
 * User Type for boarding assignment
 */
// export type UserType = 'student' | 'teacher' | 'staff';
export type UserType = typeof USER_TYPE[keyof typeof USER_TYPE]
/**
 * Boarding Assignment entity interface
 */
export interface BoardingAssignment extends BaseEntity {
  userId: string;
  userType: UserType;
  fullDayMealPackageId: string;
  assignedDate: string;
  discountPercentage: number;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  status: Status;
  assignedBy: string; // User ID who made the assignment
  notes?: string;
  
  // Populated fields - Now non-optional as they are expected to be present upon creation
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    photoUrl?: string;
  };
  fullDayMealPackage: { 
    id: string;
    name: string;
    price: number;
    packageTypeName?: string;
    packageName?: string;
  };
}

/**
 * Create Boarding Assignment DTO
 * Now includes full user and full day meal package details
 */
export interface CreateBoardingAssignmentDto {
  userId: string;
  userType: UserType;
  fullDayMealPackageId: string;
  assignedDate: string;
  discountPercentage: number;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  status: Status;
  assignedBy: string;
  notes?: string;
  // New fields to capture the populated data directly from UI
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    photoUrl?: string;
  };
  fullDayMealPackage: {
    id: string;
    name: string;
    price: number;
    packageTypeName?: string;
    packageName?: string;
  };
}

/**
 * Update Boarding Assignment DTO
 */
export interface UpdateBoardingAssignmentDto {
  fullDayMealPackageId?: string;
  discountPercentage?: number;
  originalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  status?: Status;
  notes?: string;
}

/**
 * Boarding Assignment filters interface
 */
export interface BoardingAssignmentFilters {
  search?: string;
  userType?: UserType;
  status?: Status;
  packageTypeId?: string;
  assignedDateFrom?: string;
  assignedDateTo?: string;
}

/**
 * Combined User interface for assignment
 */
export interface AssignableUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  photoUrl?: string;
  userType: UserType;
  status: string;
  isAssigned: boolean;
  
  // Additional fields based on user type
  rollNumber?: string; // For students
  admissionNumber?: number; // For students
  yearsOfExperience?: number; // For teachers/staff
  subjects?: string[]; // For teachers
  designations?: string[]; // For teachers/staff
}

/**
 * Assignment Summary interface
 */
export interface AssignmentSummary {
  totalAssigned: number;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalRevenue: number;
  averageDiscount: number;
}