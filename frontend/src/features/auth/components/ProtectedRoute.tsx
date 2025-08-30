import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '~/app/store/hooks';
import { selectIsAuthenticated, selectUser } from '../store/authSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { Box, Typography, Button } from '@mui/material';
import { Lock } from '@mui/icons-material';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredModule?: string;
  requiredPermission?: string;
}

/**
 * Protected route component that handles authentication and authorization
 */
export const ProtectedRoute = ({ 
  children, 
  requiredModule, 
  requiredPermission = 'read' 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user data is not loaded yet, show loading
  if (!user) {
    return <LoadingSpinner message="Loading user data..." fullScreen />;
  }

  // If module access is required, check permissions
  if (requiredModule) {
    const hasModuleAccess = user.permissions.some(p => p.moduleValue === requiredModule);
    
    if (!hasModuleAccess) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 64px)',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Lock sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} color="error.main" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            You don't have permission to access the {requiredModule} module.
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
            Please contact your administrator if you believe you should have access to this module.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Box>
      );
    }

    // Check specific permission if required
    if (requiredPermission !== 'read') {
      const modulePermissions = user.permissions.find(p => p.moduleValue === requiredModule);
      const hasPermission = modulePermissions?.permissions.includes(requiredPermission) ||
                           modulePermissions?.permissions.includes('manage');
      
      if (!hasPermission) {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'calc(100vh - 64px)',
              textAlign: 'center',
              p: 3,
            }}
          >
            <Lock sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} color="warning.main" gutterBottom>
              Insufficient Permissions
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              You don't have the required '{requiredPermission}' permission for this action.
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
              Please contact your administrator to request additional permissions.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Box>
        );
      }
    }
  }

  return <>{children}</>;
};