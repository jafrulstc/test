import { Navigate } from 'react-router-dom';
import { useAppSelector } from '~/app/store/hooks';
import { selectIsAuthenticated } from '~/features/auth/store/authSlice';
import { LoginForm } from '~/features/auth/components/LoginForm';

/**
 * Login page component
 */
export const LoginPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Redirect to admin if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // The LoginForm component now includes its own layout and container
  return <LoginForm />;
};