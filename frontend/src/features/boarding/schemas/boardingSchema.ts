import { z } from 'zod';
import { StatusEnum } from '~/shared/schemas/shareSchemas';

/**
 * Boarding Package Type validation schema
 */


/**
 * Boarding Package validation schema
 */


/**
 * Menu Item validation schema
 */


/**
 * Meal Schedule validation schema
 */
export const mealScheduleSchema = z.object({
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner'], {
    required_error: 'Meal type is required',
  }),
  startTime: z.string()
    .min(1, 'Start time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string()
    .min(1, 'End time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  menuItems: z.record(z.string(), z.array(z.string()))
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one package type menu is required',
    }),
  date: z.string()
    .min(1, 'Date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  status: StatusEnum,
}).refine((data) => {
  const startTime = data.startTime.split(':').map(Number);
  const endTime = data.endTime.split(':').map(Number);
  const startMinutes = startTime[0] * 60 + startTime[1];
  const endMinutes = endTime[0] * 60 + endTime[1];
  return startMinutes < endMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

/**
 * Meal Attendance validation schema
 */
export const mealAttendanceSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  mealScheduleId: z.string().min(1, 'Meal schedule is required'),
  date: z.string()
    .min(1, 'Date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner'], {
    required_error: 'Meal type is required',
  }),
  attended: z.boolean(),
  attendanceTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),
  markedBy: z.string().min(1, 'Marked by is required'),
});

/**
 * Boarding Bill validation schema
 */
export const boardingBillSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  boardingAssignmentId: z.string().min(1, 'Boarding assignment is required'),
  billMonth: z.string()
    .min(1, 'Bill month is required')
    .regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)'),
  baseAmount: z.number()
    .min(0, 'Base amount must be positive'),
  discountPercentage: z.number()
    .min(0, 'Discount percentage must be positive')
    .max(100, 'Discount percentage cannot exceed 100%'),
  discountAmount: z.number()
    .min(0, 'Discount amount must be positive'),
  totalAmount: z.number()
    .min(0, 'Total amount must be positive'),
  paymentStatus: z.enum(['Pending', 'Paid', 'Overdue', 'Cancelled'], {
    required_error: 'Payment status is required',
  }),
  paymentDate: z.string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid payment date format',
    }),
  paymentMethod: z.enum(['Cash', 'Bank Transfer', 'Online', 'Cheque'])
    .optional(),
  receiptNumber: z.string()
    .max(50, 'Receipt number must be less than 50 characters')
    .optional(),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

/**
 * Cooking Staff Duty Log validation schema
 */
export const cookingStaffDutyLogSchema = z.object({
  staffName: z.string()
    .min(1, 'Staff name is required')
    .max(100, 'Staff name must be less than 100 characters')
    .trim(),
  dutyDate: z.string()
    .min(1, 'Duty date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid duty date format',
    }),
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner'], {
    required_error: 'Meal type is required',
  }),
  menuPrepared: z.array(z.string())
    .min(1, 'At least one menu item must be prepared'),
  quantityPrepared: z.number()
    .min(1, 'Quantity prepared must be at least 1'),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  status: z.enum(['Scheduled', 'In Progress', 'Completed'], {
    required_error: 'Status is required',
  }),
});

/**
 * Export form data types
 */

export type MealScheduleFormData = z.infer<typeof mealScheduleSchema>;
export type MealAttendanceFormData = z.infer<typeof mealAttendanceSchema>;
export type BoardingBillFormData = z.infer<typeof boardingBillSchema>;
export type CookingStaffDutyLogFormData = z.infer<typeof cookingStaffDutyLogSchema>;