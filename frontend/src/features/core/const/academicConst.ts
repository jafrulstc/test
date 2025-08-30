/**
 * Academic module constants
 */

/** Academic Entity Types */
export const ACADEMIC_ENTITIES = {
  EDUCATION_LEVEL: 'educationLevel',
  ACADEMIC_YEAR: 'academicYear',
  ACADEMIC_GROUP: 'academicGroup',
  ACADEMIC_CLASS: 'academicClass',
  SHIFT: 'shift',
  SECTION: 'section',
  CLASS_GROUP_MAPPING: 'classGroupMapping',
} as const;

export type AcademicEntityType = typeof ACADEMIC_ENTITIES[keyof typeof ACADEMIC_ENTITIES];

/** Status Types */
export const ACADEMIC_STATUS_TYPES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ARCHIVED: 'Archived',
} as const;

export type AcademicStatusType = typeof ACADEMIC_STATUS_TYPES[keyof typeof ACADEMIC_STATUS_TYPES];

/** Entity Display Names */
export const ACADEMIC_ENTITY_DISPLAY_NAMES = {
  [ACADEMIC_ENTITIES.EDUCATION_LEVEL]: 'Education Level',
  [ACADEMIC_ENTITIES.ACADEMIC_YEAR]: 'Academic Year',
  [ACADEMIC_ENTITIES.ACADEMIC_GROUP]: 'Academic Group',
  [ACADEMIC_ENTITIES.ACADEMIC_CLASS]: 'Academic Class',
  [ACADEMIC_ENTITIES.SHIFT]: 'Shift',
  [ACADEMIC_ENTITIES.SECTION]: 'Section',
  [ACADEMIC_ENTITIES.CLASS_GROUP_MAPPING]: 'Class Group Mapping',
} as const;