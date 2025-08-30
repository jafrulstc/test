import { VALIDATION_CONSTANTS } from '~/app/constants';

/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate string length
 */
export const isValidLength = (
  value: string, 
  min: number = VALIDATION_CONSTANTS.MIN_STRING_LENGTH, 
  max: number = VALIDATION_CONSTANTS.MAX_STRING_LENGTH.MEDIUM
): boolean => {
  return value.length >= min && value.length <= max;
};

/**
 * Validate phone number format (basic validation)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate required field
 */
export const isRequired = (value: string | number | boolean | null | undefined): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

/**
 * Validate date format and range
 */
export const isValidDate = (dateString: string, minAge?: number, maxAge?: number): boolean => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return false;
  }

  if (minAge || maxAge) {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    
    if (minAge && age < minAge) return false;
    if (maxAge && age > maxAge) return false;
  }

  return true;
};