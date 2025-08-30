/**
 * Boarding Package Type entity interface
 */

import { BaseEntity, Status } from "~/shared/types/common";
import { BoardingPackageType } from "../core/types/masterBoardingType";

/**
 * Boarding Package Types
 */
export type BoardingPackageTypeValue = 'Normal' | 'Premium';

/**
 * Boarding Package entity interface
 */
export interface BoardingPackage extends BaseEntity {
  name: string;
  typeId: string;
  description?: string;
  mealCount: number;
  monthlyFee: number;
  status: Status;
  
  // Populated fields
  type?: BoardingPackageType;
}

/**
 * Package Change History entity interface
 */
export interface PackageChangeHistory extends BaseEntity {
  studentId: string;
  fromPackageId?: string;
  toPackageId?: string;
  changeDate: string;
  changeType: 'Assigned' | 'Upgraded' | 'Downgraded' | 'Removed';
  reason?: string;
  changedBy: string; // User ID who made the change
  
  // Populated fields
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  fromPackage?: BoardingPackage;
  toPackage?: BoardingPackage;
}

/**
 * Meal Types
 */
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

/**
 * Menu Item entity interface
 */
export interface MenuItem extends BaseEntity {
  name: string;
  description?: string;
  category: 'Main Course' | 'Side Dish' | 'Beverage' | 'Dessert' | 'Snack';
  packageTypeIds: string[]; // Which package types can have this item
  status: Status;
  
  // Populated fields
  packageTypes?: BoardingPackageType[];
}

/**
 * Meal Schedule entity interface
 */
export interface MealSchedule extends BaseEntity {
  mealType: MealType;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  menuItems: {
    [packageTypeId: string]: string[]; // MenuItem IDs for each package type
  };
  date: string; // YYYY-MM-DD format
  status: Status;
  
  // Populated fields
  menuItemsByType?: { [packageTypeId: string]: MenuItem[] };
}

/**
 * Meal Attendance entity interface
 */
export interface MealAttendance extends BaseEntity {
  studentId: string;
  mealScheduleId: string;
  date: string; // YYYY-MM-DD format
  mealType: MealType;
  attended: boolean;
  attendanceTime?: string; // HH:MM format when marked
  markedBy: string; // User ID who marked attendance
  
  // Populated fields
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentPhoto?: string;
  };
  mealSchedule?: MealSchedule;
}

/**
 * Boarding Bill entity interface
 */
export interface BoardingBill extends BaseEntity {
  studentId: string;
  boardingAssignmentId: string;
  billMonth: string; // YYYY-MM format
  baseAmount: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentDate?: string;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Online' | 'Cheque';
  receiptNumber?: string;
  notes?: string;
  
  // Populated fields
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  // boardingAssignment?: StudentBoardingAssignment;
}

/**
 * Cooking Staff Duty Log entity interface (Optional)
 */
export interface CookingStaffDutyLog extends BaseEntity {
  staffName: string;
  dutyDate: string; // YYYY-MM-DD format
  mealType: MealType;
  menuPrepared: string[]; // MenuItem IDs
  quantityPrepared: number;
  notes?: string;
  status: Status;
}


/**
 * Create DTOs for each entity
 */
export interface CreateBoardingPackageDto {
  name: string;
  typeId: string;
  description?: string;
  mealCount: number;
  monthlyFee: number;
  status: Status;
}


export interface CreatePackageChangeHistoryDto {
  studentId: string;
  fromPackageId?: string;
  toPackageId?: string;
  changeDate: string;
  changeType: 'Assigned' | 'Upgraded' | 'Downgraded' | 'Removed';
  reason?: string;
  changedBy: string;
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  category: 'Main Course' | 'Side Dish' | 'Beverage' | 'Dessert' | 'Snack';
  packageTypeIds: string[];
  status: Status;
}

export interface CreateMealScheduleDto {
  mealType: MealType;
  startTime: string;
  endTime: string;
  menuItems: {
    [packageTypeId: string]: string[];
  };
  date: string;
  status: Status;
}

export interface CreateMealAttendanceDto {
  studentId: string;
  mealScheduleId: string;
  date: string;
  mealType: MealType;
  attended: boolean;
  attendanceTime?: string;
  markedBy: string;
}

export interface CreateBoardingBillDto {
  studentId: string;
  boardingAssignmentId: string;
  billMonth: string;
  baseAmount: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentDate?: string;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Online' | 'Cheque';
  receiptNumber?: string;
  notes?: string;
}

export interface CreateCookingStaffDutyLogDto {
  staffName: string;
  dutyDate: string;
  mealType: MealType;
  menuPrepared: string[];
  quantityPrepared: number;
  notes?: string;
  status: Status; //'Scheduled' | 'In Progress' | 'Completed';
}



/**
 * Update DTOs for each entity
 */
export interface UpdateBoardingPackageDto {
  name?: string;
  typeId?: string;
  description?: string;
  mealCount?: number;
  monthlyFee?: number;
  status?: 'Active' | 'Inactive';
}



export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  category?: 'Main Course' | 'Side Dish' | 'Beverage' | 'Dessert' | 'Snack';
  packageTypeIds?: string[];
  status?: Status;//'Active' | 'Inactive';
}

export interface UpdateMealScheduleDto {
  mealType?: MealType;
  startTime?: string;
  endTime?: string;
  menuItems?: {
    [packageTypeId: string]: string[];
  };
  date?: string;
  status?: Status; //'Active' | 'Inactive';
}

export interface UpdateMealAttendanceDto {
  attended?: boolean;
  attendanceTime?: string;
  markedBy?: string;
}

export interface UpdateBoardingBillDto {
  baseAmount?: number;
  discountPercentage?: number;
  discountAmount?: number;
  totalAmount?: number;
  paymentStatus?: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentDate?: string;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Online' | 'Cheque';
  receiptNumber?: string;
  notes?: string;
}

export interface UpdateCookingStaffDutyLogDto {
  staffName?: string;
  dutyDate?: string;
  mealType?: MealType;
  menuPrepared?: string[];
  quantityPrepared?: number;
  notes?: string;
  status?: Status;//'Scheduled' | 'In Progress' | 'Completed';
}

/**
 * Filter interfaces
 */

export interface BoardingPackageFilters {
  search?: string;
  typeId?: string;
  status?: string;
}


export interface MealAttendanceFilters {
  search?: string;
  date?: string;
  mealType?: MealType;
  attended?: boolean;
}

export interface BoardingBillFilters {
  search?: string;
  billMonth?: string;
  paymentStatus?: string;
  studentId?: string;
}

/**
 * Report interfaces
 */
export interface MealAttendanceReport {
  date: string;
  mealType: MealType;
  totalStudents: number;
  attendedStudents: number;
  absentStudents: number;
  attendancePercentage: number;
}

export interface StudentMealParticipationReport {
  studentId: string;
  studentName: string;
  packageTypeName: string;
  totalMeals: number;
  attendedMeals: number;
  missedMeals: number;
  participationPercentage: number;
}

export interface BillingReport {
  month: string;
  totalStudents: number;
  totalBilled: number;
  totalPaid: number;
  totalDue: number;
  totalOverdue: number;
}

