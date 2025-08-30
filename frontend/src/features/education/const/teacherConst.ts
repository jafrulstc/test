/**
 * Teacher module constants
 */

/** Teacher Status Types */
export const TEACHER_STATUS_TYPES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
} as const;

export type TeacherStatusType = typeof TEACHER_STATUS_TYPES[keyof typeof TEACHER_STATUS_TYPES];

/** Teacher Status Color Mapping */
export const TEACHER_STATUS_COLOR_MAP = {
  [TEACHER_STATUS_TYPES.ACTIVE]: 'success',
  [TEACHER_STATUS_TYPES.INACTIVE]: 'warning',
  [TEACHER_STATUS_TYPES.PENDING]: 'error',
} as const;