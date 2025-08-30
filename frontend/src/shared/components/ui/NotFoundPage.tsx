import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '~/app/store/hooks';
import { selectCurrentModule } from '~/features/auth/store/authSlice';
import { Home, Warning } from '@mui/icons-material';

/**
 * A generic page to display for 404 Not Found errors or unauthorized access.
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();
  const currentModule = useAppSelector(selectCurrentModule);

  const handleGoHome = () => {
    if (currentModule) {
      const defaultRoutes: Record<string, string> = {
        hostel: '/admin/hostel/rooms',
        education: '/admin/education/master-data',
        accounts: '/admin/accounts/dashboard',
        library: '/admin/library/dashboard'
      };
      const defaultPath = defaultRoutes[currentModule] || '/admin';
      navigate(defaultPath);
    } else {
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)', // Adjust for header height
        width: '100%',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Warning sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
      <Typography variant="h1" fontWeight={700} color="primary.main">
        404
      </Typography>
      <Typography variant="h5" sx={{ my: 2 }}>
        Oops! Page Not Found.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. You may also not have permission to view it.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Home />}
        onClick={handleGoHome}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};
