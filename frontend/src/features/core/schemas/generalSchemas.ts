// frontend/src/features/core/schemas/generalSchemas.ts
import { z } from 'zod';

/**
 * Validation schema for simple name-based entities
 */
export const nameEntitySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
});

/**
 * Address validation schema
 */
export const addressSchema = z.object({
  nationalityId: z.string().optional(),
  divisionId: z.string().optional(),
  districtId: z.string().optional(),
  subDistrictId: z.string().optional(),
  postOfficeId: z.string().optional(),
  villageId: z.string().optional(),
});

/**
 * Guardian validation schema
 */
export const guardianSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  phone: z.number()
    .min(5, 'Invalid phone number')
    .max(999999999999999, 'Invalid phone number'),
  email: z.string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email format',
    }),
  occupation: z.string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'Occupation must be less than 100 characters',
    }),
  photoUrl: z.string().optional(),
  student_id: z.string()
    .min(1, 'Student selection is required'),
  student: z.object({
    first_name: z.string(),
    last_name: z.string(),
    photo: z.string().optional(),
  }).optional(),
  relation: z.string()
    .min(1, 'Relation selection is required'),
  presentAddress: addressSchema.optional(),
  permanentAddress: addressSchema.optional(),
  sameAsPresent: z.boolean().optional(),
  details: z.string()
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: 'Details must be less than 500 characters',
    }),
});


/**
 * Validation schema for Designation entity
 */
export const designationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  designationCategoryId: z.string()
    .min(1, 'Designation category is required'),
});


/**
 * Export individual schemas
 */
export const genderSchema = nameEntitySchema;
export const bloodGroupSchema = nameEntitySchema;
export const residentialStatusSchema = nameEntitySchema;
export const religionSchema = nameEntitySchema;
export const personCategorySchema = nameEntitySchema;

export const designationCategorySchema = nameEntitySchema;
export const relationSchema = nameEntitySchema;
export const maritalStatusSchema = nameEntitySchema;
export const jobRuleSchema = nameEntitySchema;
export const educationalMentorSchema = guardianSchema;