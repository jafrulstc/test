import { z } from 'zod';
import { STUDENT_CONSTANTS, VALIDATION_CONSTANTS } from '~/app/constants';

/**
 * Student creation validation schema
 */
export const createStudentSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(VALIDATION_CONSTANTS.MAX_STRING_LENGTH.SHORT, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(VALIDATION_CONSTANTS.MAX_STRING_LENGTH.SHORT, 'Last name must be less than 50 characters'),
  registrationNumber: z
    .string()
    .min(1, 'Registration number is required')
    .max(20, 'Registration number must be less than 20 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  contactNumber: z
    .string()
    .max(20, 'Contact number must be less than 20 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(VALIDATION_CONSTANTS.MAX_STRING_LENGTH.MEDIUM, 'Email must be less than 100 characters')
    .optional(),
  address: z
    .string()
    .max(VALIDATION_CONSTANTS.MAX_ADDRESS_LENGTH, 'Address must be less than 200 characters')
    .optional(),
  emergencyContact: z
    .string()
    .max(20, 'Emergency contact must be less than 20 characters')
    .optional(),
  medicalConditions: z
    .string()
    .max(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, 'Medical conditions must be less than 500 characters')
    .optional(),
  photoUrl: z.string().url('Invalid URL format').optional(),
  guardianId: z.string().min(1, 'Guardian is required'),
  academicClassId: z.string().min(1, 'Academic class is required'),
});

/**
 * Student update validation schema
 */
export const updateStudentSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(VALIDATION_CONSTANTS.MAX_STRING_LENGTH.SHORT, 'First name must be less than 50 characters')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(VALIDATION_CONSTANTS.MAX_STRING_LENGTH.SHORT, 'Last name must be less than 50 characters')
    .optional(),
  contactNumber: z
    .string()
    .max(20, 'Contact number must be less than 20 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(VALIDATION_CONSTANTS.MAX_STRING_LENGTH.MEDIUM, 'Email must be less than 100 characters')
    .optional(),
  address: z
    .string()
    .max(VALIDATION_CONSTANTS.MAX_ADDRESS_LENGTH, 'Address must be less than 200 characters')
    .optional(),
  emergencyContact: z
    .string()
    .max(20, 'Emergency contact must be less than 20 characters')
    .optional(),
  medicalConditions: z
    .string()
    .max(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, 'Medical conditions must be less than 500 characters')
    .optional(),
  photoUrl: z.string().url('Invalid URL format').optional(),
});

/**
 * Hostel assignment validation schema
 */
export const assignHostelSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  bedId: z.string().min(1, 'Bed is required'),
});

// Export inferred types
export type CreateStudentFormData = z.infer<typeof createStudentSchema>;
export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>;
export type AssignHostelFormData = z.infer<typeof assignHostelSchema>;