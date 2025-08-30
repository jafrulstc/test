import { z } from 'zod';
import { StatusEnum } from '~/shared/schemas/shareSchemas';

/**
 * User Type validation schema
 */
const userTypeSchema = z.enum(['student', 'teacher', 'staff'], {
  required_error: 'User type is required',
});

/**
 * Boarding Assignment validation schema
 */
export const boardingAssignmentSchema = z.object({
  userId: z.string()
    .min(1, 'User is required'),
  userType: userTypeSchema,
  fullDayMealPackageId: z.string()
    .min(1, 'Meal package is required'),
  assignedDate: z.string()
    .min(1, 'Assigned date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid assigned date format',
    }),
  discountPercentage: z.number()
    .min(0, 'Discount percentage must be positive')
    .max(100, 'Discount percentage cannot exceed 100%'),
  originalPrice: z.number()
    .min(0, 'Original price must be positive'),
  discountAmount: z.number()
    .min(0, 'Discount amount must be positive'),
  finalPrice: z.number()
    .min(0, 'Final price must be positive'),
  status: StatusEnum,
  assignedBy: z.string()
    .min(1, 'Assigned by is required'),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

/**
 * Assignment form validation schema (for the modal)
 */
export const assignmentFormSchema = z.object({
  packageTypeId: z.string()
    .min(1, 'Package type is required'),
  packageId: z.string()
    .min(1, 'Package is required'),
  fullDayMealPackageId: z.string()
    .min(1, 'Meal package is required'),
  discountPercentage: z.number()
    .min(0, 'Discount percentage must be positive')
    .max(100, 'Discount percentage cannot exceed 100%'),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

export type BoardingAssignmentFormData = z.infer<typeof boardingAssignmentSchema>;
export type AssignmentFormData = z.infer<typeof assignmentFormSchema>;