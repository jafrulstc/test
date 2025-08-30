// frontend/src/shared/types/common.ts

import { STATUSES } from "../constants/sharedConstants";

/**
 * Base entity interface for all database entities
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// export type Status = z.infer<typeof StatusEnum>;



// Type derived from the array
export type Status = typeof STATUSES[number];

export type StatusesObject = {
  [K in Status]: K;
};

// export type Status = 'Active' | 'Inactive'; 
/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response structure from API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * API error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Generic filter interface
 */
export interface BaseFilters {
  search?: string;
  [key: string]: string | number | boolean | undefined; 
}

/**
 * Loading state interface
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Form submission state
 */
export interface FormState extends LoadingState {
  isSubmitting: boolean;
}