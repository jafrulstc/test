// frontend/src/app/constants/index.ts
/**
 * Application-wide constants
 */

/** API Configuration */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

/** UI Constants */
export const UI_CONSTANTS = {
  DRAWER_WIDTH: 280,
  HEADER_HEIGHT: 64,
  PAGINATION_LIMIT: 10,
  TOAST_DURATION: 6000,
  DEBOUNCE_DELAY: 300,
} as const;

/** Room Management Constants */
export const ROOM_CONSTANTS = {
  STATUS_OPTIONS: ['Available', 'Occupied', 'Maintenance', 'Reserved'] as const,
  TYPE_OPTIONS: ['Standard', 'Premium', 'Deluxe', 'Suite'] as const,
  FLOOR_OPTIONS: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'] as const,
  BUILDING_OPTIONS: ['Main Building', 'North Wing', 'South Wing', 'East Block', 'West Block'] as const,
  MAX_CAPACITY: 20,
  MIN_CAPACITY: 1,
} as const;

/** Bed Management Constants */
export const BED_CONSTANTS = {
  STATUS_OPTIONS: ['Available', 'Occupied', 'Maintenance'] as const,
} as const;

/** Student Management Constants */
export const STUDENT_CONSTANTS = {
  GENDER_OPTIONS: ['Male', 'Female', 'Other'] as const,
  BLOOD_GROUP_OPTIONS: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const,
  ROOM_STATUS_OPTIONS: [
    { value: 'assigned', label: 'Hostel Assigned' },
    { value: 'unassigned', label: 'No Hostel' },
  ] as const,
} as const;

/** Theme Constants */
export const THEME_CONSTANTS = {
  MODES: ['light', 'dark'] as const,
  STORAGE_KEY: 'themeMode',
} as const;

/** Language Constants */
export const LANGUAGE_CONSTANTS = {
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ] as const,
  DEFAULT_LANGUAGE: 'bn',
  STORAGE_KEY: 'language',
} as const;

/** Animation Constants */
export const ANIMATION_CONSTANTS = {
  TRANSITION_DURATION: 300,
  HOVER_SCALE: 1.02,
  BUTTON_HOVER_LIFT: -1,
  CARD_HOVER_LIFT: -2,
} as const;

/** Validation Constants */
export const VALIDATION_CONSTANTS = {
  MAX_STRING_LENGTH: {
    SHORT: 50,
    MEDIUM: 100,
    LONG: 500,
  },
  MIN_STRING_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_ADDRESS_LENGTH: 200,
} as const;

/** Error Messages */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const;

/** Success Messages */
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  ASSIGNED: 'Assigned successfully',
  REMOVED: 'Removed successfully',
} as const;

export const GEOGRAPHY_ENTITY = {
  NATIONALITY: 'nationality',
  DIVISION: 'division',
  DISTRICT: 'district',
  SUB_DISTRICT: 'sub_district',
  POST_OFFICE: 'post_office',
  VILLAGE: 'village',
} as const

export type GeographyEntityType = typeof GEOGRAPHY_ENTITY[keyof typeof GEOGRAPHY_ENTITY];
// export type GeographyEntityType = typeof GEOGRAPHY_ENTITY[keyof typeof GEOGRAPHY_ENTITY];
// export type GeographyEntityType = typeof GEOGRAPHY_ENTITY[keyof typeof GEOGRAPHY_ENTITY];