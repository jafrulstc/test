// features/education/teachers/schemas/teacherSchema.ts
import { z } from 'zod';
import { StatusEnum } from '~/shared/schemas/shareSchemas';

/** ========= Sub-schemas ========= */

const educationalQualificationSchema = z.object({
  degreeName: z.string().min(1, 'Degree name is required').max(200),
  institution: z.string().min(1, 'Institution is required').max(200),
  year: z.string().min(1, 'Year is required').regex(/^\d{4}$/, 'Year must be a valid 4-digit year'),
  grade: z.string().min(1, 'Grade is required').max(50),
  documentUrl: z.string().optional(),
});

const professionalExperienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  startDate: z.string().min(1, 'Start date is required')
    .refine(d => !isNaN(Date.parse(d)), { message: 'Invalid start date format' }),
  endDate: z.string().optional()
    .refine(d => !d || !isNaN(Date.parse(d)), { message: 'Invalid end date format' }),
  responsibilities: z.string().min(1, 'Responsibilities are required').max(1000),
  achievements: z.string().max(1000).optional(),
});

const referenceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  relationship: z.string().min(1, 'Relationship is required').max(100),
  contactNumber: z.string().min(1, 'Contact number is required')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid contact number format'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  recommendationLetterUrl: z.string().optional(),
});

const onlineProfilesSchema = z.object({
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  personalWebsite: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

/** ========= Main schema (Teacher create/update form) =========
 *  👉 Person-এর তথ্য আলাদা এন্টিটিতে, এখানে শুধু FK + teacher-specific ফিল্ডগুলো
 *  👉 types/api অনুযায়ী educationalQualifications বাধ্যতামূলক (>=1)
 */
export const teacherSchema = z.object({
  /** FK to Person (must be a STAFF person) */
  personTeacherId: z.string().min(1, 'Teacher person is required'),

  // Educational Qualifications (required, at least 1)
  educationalQualifications: z
    .array(educationalQualificationSchema)
    .min(1, 'At least one qualification is required'),

  // Professional Experience / References (optional)
  professionalExperience: z.array(professionalExperienceSchema).optional(),
  references: z.array(referenceSchema).optional(),

  // Employment details
  salaryExpectation: z.number().min(0, 'Salary expectation must be positive').optional(),
  joiningDate: z.string().optional()
    .refine(d => !d || !isNaN(Date.parse(d)), { message: 'Invalid joining date format' }),
  digitalSignatureUrl: z.string().optional(),
  yearsOfExperience: z.number()
    .min(0, 'Years of experience must be positive')
    .max(60, 'Years of experience seems too high')
    .optional(),
  noticePeriod: z.string().max(100, 'Notice period must be less than 100 characters').optional(),

  // Teaching specialization
  subjectIds: z.array(z.string()).min(1, 'At least one subject is required'),
  gradeLevelIds: z.array(z.string()).min(1, 'At least one grade level is required'),
  // API-তে required হলেও খালি লিস্ট allow—UI থেকে না দিলেও [] যাবে
  languageProficiencyIds: z.array(z.string()),

  // Skills & extras
  computerSkills: z.string().max(500).optional(),
  teachingMethodology: z.string().max(500).optional(),
  onlineProfiles: onlineProfilesSchema.optional(),
  details: z.string().max(1000).optional(),

  // Status (shared)
  status: StatusEnum,
})
.refine(
  data =>
    !data.professionalExperience ||
    data.professionalExperience.every(exp => !exp.endDate || new Date(exp.startDate) < new Date(exp.endDate)),
  { message: 'End date must be after start date', path: ['professionalExperience'] }
);

export type TeacherFormData = z.infer<typeof teacherSchema>;
