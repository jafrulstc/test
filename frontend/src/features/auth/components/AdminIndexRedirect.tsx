import { Navigate } from 'react-router-dom';
import { useAppSelector } from '~/app/store/hooks';
import { selectUser, selectCurrentModule } from '../store/authSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';

/**
 * Component that redirects admin users to their default module dashboard
 */
export const AdminIndexRedirect = () => {
  const user = useAppSelector(selectUser);
  const currentModule = useAppSelector(selectCurrentModule);

  // Show loading while user data is being fetched
  if (!user) {
    return <LoadingSpinner message="Loading..." fullScreen />;
  }

  // Determine redirect path based on current module or user's default module
  const getRedirectPath = (): string => {
    const moduleToUse = currentModule || user.defaultModule || 
      (user.permissions.length > 0 ? user.permissions[0].moduleValue : null);

    switch (moduleToUse) {
      case 'hostel':
        return '/admin/hostel/rooms';
      case 'education':
        return '/admin/education/master-data';
      case 'accounts':
        return '/admin/accounts/dashboard';
      case 'library':
        return '/admin/library/dashboard';
      case 'boarding':
        return '/admin/boarding/dashboard';
      default:
        // If no module access, redirect to first available module
        if (user.permissions.length > 0) {
          const firstModule = user.permissions[0].moduleValue;
          switch (firstModule) {
            case 'hostel':
              return '/admin/hostel/rooms';
            case 'education':
              return '/admin/education/master-data';
            case 'accounts':
              return '/admin/accounts/dashboard';
            case 'library':
              return '/admin/library/dashboard';
            case 'boarding':
              return '/admin/boarding/dashboard';
            default:
              return '/admin/education/master-data';
          }
        }
        return '/admin/education/master-data';
    }
  };

  return <Navigate to={getRedirectPath()} replace />;
};