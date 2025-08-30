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
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/\s/g, '')), {
      message: 'Invalid phone number format',
    }),
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
 * Export individual schemas
 */
export const genderSchema = nameEntitySchema;
export const bloodGroupSchema = nameEntitySchema;
export const residentialStatusSchema = nameEntitySchema;
export const religionSchema = nameEntitySchema;