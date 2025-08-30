/**
 * Student module constants
 */

/** Student Status Types */
export const STUDENT_STATUS_TYPES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  GRADUATED: 'Graduated',
  TRANSFERRED: 'Transferred',
  CANCELLED: 'Cancelled',
} as const;

export type StudentStatusType = typeof STUDENT_STATUS_TYPES[keyof typeof STUDENT_STATUS_TYPES];

/** Student Status Color Mapping */
export const STUDENT_STATUS_COLOR_MAP = {
  [STUDENT_STATUS_TYPES.ACTIVE]: 'success',
  [STUDENT_STATUS_TYPES.INACTIVE]: 'warning',
  [STUDENT_STATUS_TYPES.GRADUATED]: 'info',
  [STUDENT_STATUS_TYPES.TRANSFERRED]: 'info',
  [STUDENT_STATUS_TYPES.CANCELLED]: 'error',
} as const;

/** Admission Status Types */
export const ADMISSION_STATUS_TYPES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  CANCELLED: 'Cancelled',
  TRANSFERRED: 'Transferred',
} as const;

export type AdmissionStatusType = typeof ADMISSION_STATUS_TYPES[keyof typeof ADMISSION_STATUS_TYPES];

/** Admission Status Color Mapping */
export const ADMISSION_STATUS_COLOR_MAP = {
  [ADMISSION_STATUS_TYPES.ACTIVE]: 'success',
  [ADMISSION_STATUS_TYPES.INACTIVE]: 'warning',
  [ADMISSION_STATUS_TYPES.CANCELLED]: 'error',
  [ADMISSION_STATUS_TYPES.TRANSFERRED]: 'info',
} as const;