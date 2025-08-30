import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '~/app/constants';
import type { ApiResponse, ApiError } from '~/shared/types/common';

/**
 * Base API service class with common functionality
 * Provides error handling, request/response interceptors, and retry logic
 */
class BaseApiService {
  protected api: AxiosInstance;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.api = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to refresh token
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              // Implement token refresh logic here
              // For now, just redirect to login
              window.location.href = '/login';
            } else {
              // No refresh token, redirect to login
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentModule');
              window.location.href = '/login';
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentModule');
            window.location.href = '/login';
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle API errors and transform them to a consistent format
   */
  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        return {
          message: error.response.data?.message || ERROR_MESSAGES.GENERIC_ERROR,
          code: error.response.status.toString(),
          details: error.response.data,
        };
      } else if (error.request) {
        // Network error
        return {
          message: ERROR_MESSAGES.NETWORK_ERROR,
          code: 'NETWORK_ERROR',
        };
      }
    }

    return {
      message: ERROR_MESSAGES.GENERIC_ERROR,
      code: 'UNKNOWN_ERROR',
    };
  }

  /**
   * Generic GET request
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  /**
   * Generic POST request
   */
  protected async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * Generic PUT request
   */
  protected async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * Generic PATCH request
   */
  protected async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * Generic DELETE request
   */
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  /**
   * Simulate API delay for development
   */
  public async simulateDelay(ms: number = 500): Promise<void> {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}

export default BaseApiService;