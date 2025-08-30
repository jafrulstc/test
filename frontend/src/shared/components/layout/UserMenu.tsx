import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { logout, selectUser, selectCurrentModule } from '~/features/auth/store/authSlice';
import { getAvatarColor, generateInitials } from '~/shared/utils/formatters';

/**
 * User menu component for the header
 */
export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const currentModule = useAppSelector(selectCurrentModule);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    handleClose();
  };

  const handleProfile = () => {
    navigate('/admin/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/admin/settings');
    handleClose();
  };

  if (!user) {
    return null;
  }

  const initials = generateInitials(user.firstName, user.lastName);
  const avatarColor = getAvatarColor(user.id);

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <Avatar
          sx={{
            bgcolor: avatarColor,
            width: 32,
            height: 32,
            fontSize: '0.875rem',
          }}
        >
          {initials}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { minWidth: 220 },
        }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.username}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {user.email || 'No email provided'}
          </Typography>
          {currentModule && (
            <Chip
              label={`${currentModule.charAt(0).toUpperCase() + currentModule.slice(1)} Module`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
