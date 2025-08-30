// features/person/schemas/personSchemas.ts
import { z } from 'zod';
import { addressSchema } from '~/features/core/schemas/generalSchemas';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { StatusEnum } from '~/shared/schemas/shareSchemas';

/** display-only */
export const necessarySchema = z.object({
  genderName: z.string().optional(),
  bloodGroupName: z.string().optional(),
  religionName: z.string().optional(),
  nationalityName: z.string().optional(),
  // + NEW
  maritalStatusName: z.string().optional(),

  nidFileName: z.string().optional(),
  brnFileName: z.string().optional(),
  fatherNidFileName: z.string().optional(),
  motherNidFileName: z.string().optional(),
  digitalSignatureFileName: z.string().optional(),
}).optional();

/** Person create/update form schema */
export const personSchema = z.object({
  // Personal
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  fatherName: z.string().min(1).max(100).trim(),
  motherName: z.string().min(1).max(100).trim(),
  dateOfBirth: z.string().min(1).refine(d => !isNaN(Date.parse(d)), { message: 'Invalid date of birth format' }),
  email: z.string().email().optional().or(z.literal('')),
  healthCondition: z.string().max(500).optional(),
  nidNumber: z.string().max(20).optional(),
  brnNumber: z.string().max(20).optional(),
  fatherNidNumber: z.string().max(20).optional(),
  motherBrnNumber: z.string().max(20).optional(),

  // ✅ allow number OR null; default null if missing
  phone: z.union([
    z.coerce.number().int().min(0, 'min number is 0').max(999999999999999, 'max number is 15 digits'),
    z.null(),
  ]).default(null),

  emergencyCont: z.union([
    z.coerce.number().int().min(0, 'min number is 0').max(999999999999999, 'max number is 15 digits'),
    z.null(),
  ]).default(null),

  // Demographics
  genderId: z.string().min(1, 'Gender is required'),
  bloodGroupId: z.string().optional(),
  religionId: z.string().optional(),
  nationalityId: z.string().optional(), 
  maritalStatusId: z.string().optional(),

  // Address
  presentAddress: addressSchema.optional(),
  permanentAddress: addressSchema.optional(),
  sameAsPresent: z.boolean().optional(),

  // Files
  photo: z.string().optional(),
  nidFile: z.string().optional(),
  brnFile: z.string().optional(),
  fatherNidFile: z.string().optional(),
  motherNidFile: z.string().optional(),
  digitalSignatureFile: z.string().optional(),

  // Display-only
  necessary: necessarySchema,

  // Meta
  personCategoryId: z.string().min(1, 'Person category is required'),
  designationCategoryId: z.string().optional(),
  designationId: z.string().optional(),

  // Status (create-এ ডিফল্ট Active রাখলে ফর্ম সহজ হয়)
  status: StatusEnum.default(STATUSES_OBJECT.ACTIVE),
});

/** Update (id আবশ্যিক; বাকিগুলো optional) */
export const updatePersonSchema = personSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
  status: StatusEnum.optional(),
});

export type PersonFormData = z.infer<typeof personSchema>;
export type UpdatePersonFormData = z.infer<typeof updatePersonSchema>;

/** Filters */
export const personFilterSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  email: z.string().optional(),
  nidNumber: z.string().optional(),
  brnNumber: z.string().optional(),

  // ✅ optional + nullable
  phone: z.number().nullable().optional(),
  emergencyCont: z.number().nullable().optional(),

  genderId: z.string().optional(),
  bloodGroupId: z.string().optional(),
  religionId: z.string().optional(),
  nationalityId: z.string().optional(),
  maritalStatusId: z.string().optional(),

  personCategoryId: z.string().optional(),
  designationCategoryId: z.string().optional(),
  designationId: z.string().optional(),

  status: StatusEnum.optional(),

  presentAddress: addressSchema.partial().optional(),
  permanentAddress: addressSchema.partial().optional(),

  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),

  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
export type PersonFilterForm = z.infer<typeof personFilterSchema>;

export type PersonFormValuesIn  = z.input<typeof personSchema>;   // RHF এর জন্য
export type PersonFormValuesOut = z.output<typeof personSchema>;  // parse() এর পরে দরকার হলে
