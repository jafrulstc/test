import { z } from 'zod';

/**
 * Education Level validation schema
 */
export const educationLevelSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  status: z.enum(['Active', 'Inactive', 'Archived'], {
    required_error: 'Status is required',
  }),
});

/**
 * Academic Year validation schema
 */
export const academicYearSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  startDate: z.string()
    .min(1, 'Start date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date format',
    }),
  endDate: z.string()
    .min(1, 'End date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date format',
    }),
  status: z.enum(['Active', 'Inactive', 'Archived'], {
    required_error: 'Status is required',
  }),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});


/**
 * Academic Class validation schema
 */
export const academicClassSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  educationLevelId: z.string()
    .min(1, 'Education level is required'),
  academicGroupIds: z.array(z.string())
    .min(1, 'At least one academic group is required'),
  status: z.enum(['Active', 'Inactive', 'Archived'], {
    required_error: 'Status is required',
  }),
});

/**
 * Shift validation schema
 */
export const shiftSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
  }),
});

/**
 * Section validation schema
 */
export const sectionSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(10, 'Name must be less than 10 characters')
    .trim(),
  capacity: z.number()
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity must be less than 100')
    .optional(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
  }),
});

/**
 * Shift Section Mapping validation schema
 */
export const shiftSectionMappingSchema = z.object({
  shiftId: z.string().min(1, 'Shift is required'),
  sectionIds: z.array(z.string()).min(1, 'At least one section is required'),
});

/**
 * Class Group Mapping validation schema
 */
export const classGroupMappingSchema = z.object({
  academicClassId: z.string().min(1, 'Academic class is required'),
  academicGroupId: z.string().min(1, 'Academic group is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  shiftSectionMapping: z.array(shiftSectionMappingSchema)
    .min(1, 'At least one shift-section mapping is required'),
});

/**
 * Academic Group validation schema
 */
export const academicGroupSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  educationLevelIds: z.array(z.string())
    .min(1, 'At least one education level is required'),
  status: z.enum(['Active', 'Inactive', 'Archived'], {
    required_error: 'Status is required',
  }),
});

/**
 * Subject validation schema
 */
export const subjectSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  code: z.string()
    .max(10, 'Code must be less than 10 characters')
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
  }),
});

/**
 * Grade Level validation schema
 */
export const gradeLevelSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
  }),
});

/**
 * Language Proficiency validation schema
 */
export const languageProficiencySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
  }),
});

