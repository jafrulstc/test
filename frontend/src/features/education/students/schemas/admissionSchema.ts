import { z } from 'zod';
import { StatusEnum } from '~/shared/schemas/shareSchemas';

/**
 * Previous School Details validation schema
 */
const previousSchoolDetailsSchema = z.object({
  schoolName: z.string()
    .min(1, 'School name is required')
    .max(200, 'School name must be less than 200 characters'),
  className: z.string()
    .min(1, 'Class name is required')
    .max(50, 'Class name must be less than 50 characters'),
  result: z.coerce.number()
    .min(0, 'Result must be positive')
    .max(999, 'Result must be less than or equal to 5'),
  tcNumber: z.string()
    .min(1, 'TC number is required')
    .max(50, 'TC number must be less than 50 characters'),
  tcFileUrl: z.string().optional(),
  tcFileName: z.string().optional(),
  schoolPhone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  schoolEmail: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  details: z.string()
    .max(500, 'Details must be less than 500 characters')
    .optional(),
});

/**
 * Admission validation schema
 */
export const admissionSchema = z.object({
  // Admission Details
  admissionDate: z.string()
    .min(1, 'Admission date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid admission date format',
    }),
  registrationNumber: z.string()
    .max(50, 'Registration number must be less than 50 characters')
    .optional(),
  classRole: z.coerce.number(),
  educationalMentorId: z.string().optional(),
  
  // Guardian Information
  guardianId: z.string().optional(),
  teacherId: z.string().optional(),
  
  // Student Information
  studentId: z.string().min(1, 'Student is required'),
  
  // Academic Information
  academicYearId: z.string().min(1, 'Academic year is required'),
  academicClassId: z.string().min(1, 'Academic class is required'),
  academicGroupId: z.string().optional(),
  shiftId: z.string().optional(),
  sectionId: z.string().optional(),
  rollNumber: z.coerce.number()
    .min(0, 'Roll number is required')
    .max(999999999999999, 'Roll number must be less than 20 characters'),
  admissionFee: z.number()
    .min(0, 'Admission fee must be positive'),
  
  // Previous School Details (optional)
  previousSchoolDetails: z.array(previousSchoolDetailsSchema)
    .max(10, 'Maximum 10 previous schools allowed')
    .optional(),
  
  // Status
  // status: z.enum(['Active', 'Inactive', 'Cancelled', 'Transferred'], {
  //   required_error: 'Status is required',
  // }),
  status: StatusEnum
}).refine((data) => {
  // Either guardian or teacher must be selected, but not both
  return (data.guardianId && !data.teacherId) || (!data.guardianId && data.teacherId);
}, {
  message: 'Either guardian or teacher must be selected',
  path: ['guardianId'],
});

export type AdmissionFormData = z.infer<typeof admissionSchema>;