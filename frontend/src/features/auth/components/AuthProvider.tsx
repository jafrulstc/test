import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  verifyToken,
} from '../store/authSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import type { User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (module: string, permission: string) => boolean;
  hasModuleAccess: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Custom hook to access auth context
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth provider component
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);

  // Verify token on app initialization
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isAuthenticated && !loading) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated, loading]);

  /**
   * Check if user has specific permission for a module
   */
  const hasPermission = (module: string, permission: string): boolean => {
    if (!user || !user.permissions) return false;

    const modulePermissions = user.permissions.find(p => p.moduleValue === module);
    if (!modulePermissions) return false;

    return modulePermissions.permissions.includes(permission) || 
           modulePermissions.permissions.includes('manage'); // 'manage' includes all permissions
  };

  /**
   * Check if user has access to a module
   */
  const hasModuleAccess = (module: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.some(p => p.moduleValue === module);
  };

  const contextValue: AuthContextValue = {
    user,
    isAuthenticated,
    loading,
    hasPermission,
    hasModuleAccess,
  };

  // Show loading spinner during initial token verification
  if (loading && !isAuthenticated && localStorage.getItem('authToken')) {
    return <LoadingSpinner message="Verifying authentication..." fullScreen />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};