import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

/**
 * Reusable loading spinner component
 * Can be used as a full-screen overlay or inline component
 */
export const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 48, 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }),
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return content;
  }

  return (
    <Box sx={{ py: 8 }}>
      {content}
    </Box>
  );
};