import { createContext, useContext, type ReactNode } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import { useToast, type ToastMessage } from '~/shared/hooks/useToast';

interface ToastContextValue {
  showToast: (message: string, severity?: ToastMessage['severity'], duration?: 6000) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Custom hook to access toast context
 * @throws {Error} When used outside of ToastProvider
 */
export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast provider component that manages application-wide toast notifications
 * Provides context for showing, removing, and clearing toast messages
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const { toasts, showToast, removeToast, clearAllToasts } = useToast();

  const contextValue: ToastContextValue = {
    showToast,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container */}
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 400,
        }}
      >
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open={true}
            autoHideDuration={toast.duration}
            onClose={() => removeToast(toast.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ position: 'relative', transform: 'none' }}
          >
            <Alert
              onClose={() => removeToast(toast.id)}
              severity={toast.severity}
              variant="filled"
              sx={{
                width: '100%',
                boxShadow: 3,
                '& .MuiAlert-message': {
                  fontSize: '0.875rem',
                },
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </Box>
    </ToastContext.Provider>
  );
};