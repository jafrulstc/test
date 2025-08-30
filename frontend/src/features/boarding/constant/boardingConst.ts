/**
 * Boarding module constants
 */

/** Boarding Status Types */
export const BOARDING_STATUS_TYPES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type BoardingStatusType = typeof BOARDING_STATUS_TYPES[keyof typeof BOARDING_STATUS_TYPES];

export const USER_TYPE = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  STAFF:  'staff',
} as const;


/** Package Types */
export const PACKAGE_TYPES = {
  PREMIUM: 'Premium',
  NORMAL: 'Normal',
} as const;

export type PackageType = typeof PACKAGE_TYPES[keyof typeof PACKAGE_TYPES];

/** Package Type Colors */
export const PACKAGE_TYPE_COLORS = {
  [PACKAGE_TYPES.PREMIUM]: 'primary',
  [PACKAGE_TYPES.NORMAL]: 'secondary',
} as const;