import { useState, useCallback } from 'react';
import { UI_CONSTANTS } from '~/app/constants';

export interface ToastMessage {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

/**
 * Custom hook for managing toast notifications
 * Provides functionality to show, remove, and clear toast messages
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  /**
   * Show a new toast message
   * @param message - The message to display
   * @param severity - The severity level of the toast
   * @param duration - How long the toast should be visible (in milliseconds)
   * @returns The ID of the created toast
   */
  const showToast = useCallback((
    message: string, 
    severity: ToastMessage['severity'] = 'info', 
    duration = UI_CONSTANTS.TOAST_DURATION
  ): string => {
    const id = Date.now().toString();
    const newToast: ToastMessage = {
      id,
      message,
      severity,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);

    return id;
  }, []);

  /**
   * Remove a specific toast by ID
   * @param id - The ID of the toast to remove
   */
  const removeToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Clear all active toasts
   */
  const clearAllToasts = useCallback((): void => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
  };
};