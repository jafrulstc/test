

import BaseApiService from '~/shared/services/api/baseApi';
import type {
  PackageChangeHistory,
  MealSchedule,
  MealAttendance,
  BoardingBill,
  CookingStaffDutyLog,
  CreateMealScheduleDto,
  CreateMealAttendanceDto,
  CreateBoardingBillDto,
  UpdateMealScheduleDto,
  UpdateMealAttendanceDto,
  UpdateBoardingBillDto,
  MealAttendanceFilters,
  BoardingBillFilters,
} from '~/features/boarding/types/boardingType';
import type { PaginatedResponse } from '~/shared/types/common';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
/**
 * Mock data for development
 */


const mockPackageChangeHistory: PackageChangeHistory[] = [
  {
    id: 'pch1',
    studentId: 's1',
    toPackageId: 'bp1',
    changeDate: '2024-01-01',
    changeType: 'Assigned',
    reason: 'Initial boarding assignment',
    changedBy: 'admin1',
    student: {
      id: 's1',
      firstName: 'Rashid',
      lastName: 'Ahmed',
    },
    createdAt: new Date().toISOString(),
  },
];


const mockMealSchedules: MealSchedule[] = [
  {
    id: 'ms1',
    mealType: 'Breakfast',
    startTime: '07:00',
    endTime: '09:00',
    menuItems: {
      bpt1: ['mi1'],
      bpt2: ['mi1', 'mi3'],
    },
    date: '2024-01-15',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ms2',
    mealType: 'Lunch',
    startTime: '12:00',
    endTime: '14:00',
    menuItems: {
      bpt1: ['mi1'],
      bpt2: ['mi1', 'mi2'],
    },
    date: '2024-01-15',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
  },
];

const mockMealAttendance: MealAttendance[] = [
  {
    id: 'ma1',
    studentId: 's1',
    mealScheduleId: 'ms1',
    date: '2024-01-15',
    mealType: 'Breakfast',
    attended: true,
    attendanceTime: '07:30',
    markedBy: 'admin1',
    student: {
      id: 's1',
      firstName: 'Rashid',
      lastName: 'Ahmed',
    },
    createdAt: new Date().toISOString(),
  },
];

const mockBoardingBills: BoardingBill[] = [
  {
    id: 'bb1',
    studentId: 's1',
    boardingAssignmentId: 'sba1',
    billMonth: '2024-01',
    baseAmount: 8000,
    discountPercentage: 0,
    discountAmount: 0,
    totalAmount: 8000,
    paymentStatus: 'Paid',
    paymentDate: '2024-01-05',
    paymentMethod: 'Cash',
    receiptNumber: 'RCP001',
    student: {
      id: 's1',
      firstName: 'Rashid',
      lastName: 'Ahmed',
    },
    createdAt: new Date().toISOString(),
  },
];

const mockCookingStaffDutyLogs: CookingStaffDutyLog[] = [
  {
    id: 'csdl1',
    staffName: 'Mohammad Ali',
    dutyDate: '2024-01-15',
    mealType: 'Breakfast',
    menuPrepared: ['mi1', 'mi3'],
    quantityPrepared: 50,
    notes: 'Prepared for 50 students',
    status: STATUSES_OBJECT.ACTIVE,//'Completed',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Boarding API service class
 */
class BoardingApiService extends BaseApiService {
  private packageChangeHistory = [...mockPackageChangeHistory];
  private mealSchedules = [...mockMealSchedules];
  private mealAttendance = [...mockMealAttendance];
  private boardingBills = [...mockBoardingBills];
  private cookingStaffDutyLogs = [...mockCookingStaffDutyLogs];
  private mockIdCounter = 100;




  // Meal Schedule CRUD operations
  async getMealSchedules(params: { page?: number; limit?: number; filters?: any } = {}): Promise<PaginatedResponse<MealSchedule>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.mealSchedules];
    
    if (filters.date) {
      filtered = filtered.filter(schedule => schedule.date === filters.date);
    }

    if (filters.mealType) {
      filtered = filtered.filter(schedule => schedule.mealType === filters.mealType);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createMealSchedule(data: CreateMealScheduleDto): Promise<MealSchedule> {
    await this.simulateDelay();
    const newSchedule: MealSchedule = {
      id: `ms${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.mealSchedules = [newSchedule, ...this.mealSchedules];
    return newSchedule;
  }

  async updateMealSchedule(id: string, data: UpdateMealScheduleDto): Promise<MealSchedule> {
    await this.simulateDelay();
    const index = this.mealSchedules.findIndex(schedule => schedule.id === id);
    if (index === -1) throw new Error('Meal schedule not found');
    
    this.mealSchedules[index] = { ...this.mealSchedules[index], ...data, updatedAt: new Date().toISOString() };
    return this.mealSchedules[index];
  }

  async deleteMealSchedule(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.mealSchedules.findIndex(schedule => schedule.id === id);
    if (index === -1) throw new Error('Meal schedule not found');
    
    this.mealSchedules = this.mealSchedules.filter(schedule => schedule.id !== id);
  }

  // Meal Attendance CRUD operations
  async getMealAttendance(params: { page?: number; limit?: number; filters?: MealAttendanceFilters } = {}): Promise<PaginatedResponse<MealAttendance>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.mealAttendance];
    
    if (filters.date) {
      filtered = filtered.filter(attendance => attendance.date === filters.date);
    }

    if (filters.mealType) {
      filtered = filtered.filter(attendance => attendance.mealType === filters.mealType);
    }

    if (filters.attended !== undefined) {
      filtered = filtered.filter(attendance => attendance.attended === filters.attended);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createMealAttendance(data: CreateMealAttendanceDto): Promise<MealAttendance> {
    await this.simulateDelay();
    const newAttendance: MealAttendance = {
      id: `ma${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.mealAttendance = [newAttendance, ...this.mealAttendance];
    return newAttendance;
  }

  async updateMealAttendance(id: string, data: UpdateMealAttendanceDto): Promise<MealAttendance> {
    await this.simulateDelay();
    const index = this.mealAttendance.findIndex(attendance => attendance.id === id);
    if (index === -1) throw new Error('Meal attendance not found');
    
    this.mealAttendance[index] = { ...this.mealAttendance[index], ...data, updatedAt: new Date().toISOString() };
    return this.mealAttendance[index];
  }

  async deleteMealAttendance(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.mealAttendance.findIndex(attendance => attendance.id === id);
    if (index === -1) throw new Error('Meal attendance not found');
    
    this.mealAttendance = this.mealAttendance.filter(attendance => attendance.id !== id);
  }

  // Boarding Bill CRUD operations
  async getBoardingBills(params: { page?: number; limit?: number; filters?: BoardingBillFilters } = {}): Promise<PaginatedResponse<BoardingBill>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.boardingBills];
    
    if (filters.billMonth) {
      filtered = filtered.filter(bill => bill.billMonth === filters.billMonth);
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter(bill => bill.paymentStatus === filters.paymentStatus);
    }

    if (filters.studentId) {
      filtered = filtered.filter(bill => bill.studentId === filters.studentId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBoardingBill(data: CreateBoardingBillDto): Promise<BoardingBill> {
    await this.simulateDelay();
    const newBill: BoardingBill = {
      id: `bb${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.boardingBills = [newBill, ...this.boardingBills];
    return newBill;
  }

  async updateBoardingBill(id: string, data: UpdateBoardingBillDto): Promise<BoardingBill> {
    await this.simulateDelay();
    const index = this.boardingBills.findIndex(bill => bill.id === id);
    if (index === -1) throw new Error('Boarding bill not found');
    
    this.boardingBills[index] = { ...this.boardingBills[index], ...data, updatedAt: new Date().toISOString() };
    return this.boardingBills[index];
  }

  async deleteBoardingBill(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.boardingBills.findIndex(bill => bill.id === id);
    if (index === -1) throw new Error('Boarding bill not found');
    
    this.boardingBills = this.boardingBills.filter(bill => bill.id !== id);
  }
}

export const boardingApi = new BoardingApiService();