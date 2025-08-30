// boardingAssignmentApi.ts

import BaseApiService from '~/shared/services/api/baseApi';
import type {
  BoardingAssignment,
  CreateBoardingAssignmentDto,
  UpdateBoardingAssignmentDto,
  BoardingAssignmentFilters,
  AssignmentSummary,
  UserType,
} from '../types/boardingAssignmentType';
import type { PaginatedResponse } from '~/shared/types/common';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { USER_TYPE } from '../constant/boardingConst';

// Master Boarding API Service import করুন যাতে fullDayMealPackages অ্যাক্সেস করা যায়
import { masterBoardingApi } from '~/features/boarding/core/services/masterBoardingApi'; // <-- এটি যোগ করুন

const mockBoardingAssignments: BoardingAssignment[] = [
  // 1. Student (from Admission adm1 -> st1 Nafis Rahman)
  {
    id: 'ba1',
    userId: 'st1',
    userType: USER_TYPE.STUDENT,
    fullDayMealPackageId: 'fdmp1',
    assignedDate: '2025-01-20',
    discountPercentage: 10,
    originalPrice: 150,
    discountAmount: 15,
    finalPrice: 135,
    status: STATUSES_OBJECT.ACTIVE,
    assignedBy: 'admin1',
    notes: 'Scholarship discount applied',

    user: {
      id: 'st1',
      firstName: 'Nafis',
      lastName: 'Rahman',
      email: 'nafis.rahman@example.com',
      photoUrl: '',
    },
    fullDayMealPackage: {
      id: 'fdmp1',
      name: 'Student Complete Day Package',
      price: 150,
      packageTypeName: 'স্ট্যান্ডার্ড প্যাকেজ',
      packageName: 'ছাত্র স্ট্যান্ডার্ড প্যাকেজ',
    },
    createdAt: new Date().toISOString(),
  },

  // 2. Teacher (Rahim Uddin)
  {
    id: 'ba2',
    userId: 't1',
    userType: USER_TYPE.TEACHER,
    fullDayMealPackageId: 'fdmp2',
    assignedDate: '2025-01-21',
    discountPercentage: 0,
    originalPrice: 250,
    discountAmount: 0,
    finalPrice: 250,
    status: STATUSES_OBJECT.ACTIVE,
    assignedBy: 'admin1',
    notes: 'No discount applied',

    user: {
      id: 't1',
      firstName: 'Rahim',
      lastName: 'Uddin',
      email: 'rahim.uddin@example.com',
      photoUrl: '',
    },
    fullDayMealPackage: {
      id: 'fdmp2',
      name: 'Premium Teacher Full Day Package',
      price: 250,
      packageTypeName: 'প্রিমিয়াম প্যাকেজ',
      packageName: 'ছাত্র প্রিমিয়াম প্যাকেজ',
    },
    createdAt: new Date().toISOString(),
  },

  // 3. Staff (Hasan Mahmud - Librarian)
  {
    id: 'ba3',
    userId: 'st1', // staff id (Hasan Mahmud)
    userType: USER_TYPE.STAFF,
    fullDayMealPackageId: 'fdmp2',
    assignedDate: '2025-01-22',
    discountPercentage: 5,
    originalPrice: 250,
    discountAmount: 12.5,
    finalPrice: 237.5,
    status: STATUSES_OBJECT.ACTIVE,
    assignedBy: 'admin1',
    notes: 'Staff discount applied',

    user: {
      id: 'st1',
      firstName: 'Hasan',
      lastName: 'Mahmud',
      email: 'hasan.mahmud@example.com',
      photoUrl: '',
    },
    fullDayMealPackage: {
      id: 'fdmp2',
      name: 'Premium Teacher Full Day Package',
      price: 250,
      packageTypeName: 'প্রিমিয়াম প্যাকেজ',
      packageName: 'ছাত্র প্রিমিয়াম প্যাকেজ',
    },
    createdAt: new Date().toISOString(),
  },
];


/**
 * Boarding Assignment API service class
 */
class BoardingAssignmentApiService extends BaseApiService {
  private assignments = [...mockBoardingAssignments];
  private mockIdCounter = 100;

  /**
   * Get boarding assignments with pagination and filtering
   */
  async getBoardingAssignments(params: { page?: number; limit?: number; filters?: BoardingAssignmentFilters } = {}): Promise<PaginatedResponse<BoardingAssignment>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.assignments];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(assignment =>
        // 'user' and 'fullDayMealPackage' are now non-optional in BoardingAssignment interface
        assignment.user.firstName.toLowerCase().includes(search) ||
        assignment.user.lastName.toLowerCase().includes(search) ||
        assignment.user.email?.toLowerCase().includes(search) ||
        assignment.fullDayMealPackage.name.toLowerCase().includes(search)
      );
    }

    if (filters.userType) {
      filtered = filtered.filter(assignment => assignment.userType === filters.userType);
    }

    if (filters.status) {
      filtered = filtered.filter(assignment => assignment.status === filters.status);
    }

    if (filters.assignedDateFrom) {
      filtered = filtered.filter(assignment =>
        new Date(assignment.assignedDate) >= new Date(filters.assignedDateFrom!)
      );
    }

    if (filters.assignedDateTo) {
      filtered = filtered.filter(assignment =>
        new Date(assignment.assignedDate) <= new Date(filters.assignedDateTo!)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  /**
   * Create new boarding assignment
   */
  async createBoardingAssignment(data: CreateBoardingAssignmentDto): Promise<BoardingAssignment> {
    await this.simulateDelay(500);

    // Check if user is already assigned
    const existingAssignment = this.assignments.find(assignment =>
      assignment.userId === data.userId && assignment.userType === data.userType && assignment.status === STATUSES_OBJECT.ACTIVE
    );

    if (existingAssignment) {
      throw new Error('User is already assigned to an active boarding package');
    }

    // The DTO now directly contains the populated user and fullDayMealPackage details from the UI.
    // No need for this API service to "find" or "lookup" them from its own mock data.
    const newAssignment: BoardingAssignment = {
      id: `ba${this.mockIdCounter++}`,
      ...data, // This now correctly spreads all fields including 'user' and 'fullDayMealPackage'
      createdAt: new Date().toISOString(),
      updatedAt: undefined, // Ensure updatedAt is undefined initially
    };

    this.assignments = [newAssignment, ...this.assignments];

    return newAssignment;
  }

  /**
   * Update boarding assignment
   */
  async updateBoardingAssignment(id: string, data: UpdateBoardingAssignmentDto): Promise<BoardingAssignment> {
    await this.simulateDelay(500);
    const index = this.assignments.findIndex(assignment => assignment.id === id);
    if (index === -1) {
      throw new Error('Boarding assignment not found');
    }

    // বিদ্যমান অ্যাসাইনমেন্ট অবজেক্টের কপি তৈরি করুন
    let updatedAssignment: BoardingAssignment = {
        ...this.assignments[index],
        ...data,
        updatedAt: new Date().toISOString()
    };

    // যদি fullDayMealPackageId পরিবর্তিত হয়, তাহলে নতুন প্যাকেজের বিবরণ দিয়ে populated করুন
    if (data.fullDayMealPackageId && data.fullDayMealPackageId !== this.assignments[index].fullDayMealPackageId) {
        // masterBoardingApi থেকে fullDayMealPackages আনুন
        const masterFullDayMealPackages = (await masterBoardingApi.getFullDayMealPackages()).data; // <-- এখানে পরিবর্তন

        const newMealPackage = masterFullDayMealPackages.find(
            (mp) => mp.id === data.fullDayMealPackageId
        );

        if (newMealPackage) {
            updatedAssignment.fullDayMealPackage = {
                id: newMealPackage.id,
                name: newMealPackage.name,
                price: newMealPackage.price,
                packageTypeName: newMealPackage.packageTypeId,
                packageName: newMealPackage.packageId,
            };
        }
    }

    this.assignments[index] = updatedAssignment;

    return this.assignments[index];
  }

  /**
   * Delete boarding assignment
   */
  async deleteBoardingAssignment(id: string): Promise<void> {
    await this.simulateDelay(300);
    const index = this.assignments.findIndex(assignment => assignment.id === id);
    if (index === -1) {
      throw new Error('Boarding assignment not found');
    }

    this.assignments = this.assignments.filter(assignment => assignment.id !== id);
  }

  /**
   * Get assignment summary
   */
  async getAssignmentSummary(): Promise<AssignmentSummary> {
    await this.simulateDelay(200);

    const activeAssignments = this.assignments.filter(a => a.status === STATUSES_OBJECT.ACTIVE);

    return {
      totalAssigned: activeAssignments.length,
      totalStudents: activeAssignments.filter(a => a.userType === 'student').length,
      totalTeachers: activeAssignments.filter(a => a.userType === 'teacher').length,
      totalStaff: activeAssignments.filter(a => a.userType === 'staff').length,
      totalRevenue: activeAssignments.reduce((sum, a) => sum + a.finalPrice, 0),
      averageDiscount: activeAssignments.length > 0
        ? activeAssignments.reduce((sum, a) => sum + a.discountPercentage, 0) / activeAssignments.length
        : 0,
    };
  }
}

export const boardingAssignmentApi = new BoardingAssignmentApiService();