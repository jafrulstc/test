import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';
import { useTheme as useCustomTheme } from '~/app/providers/ThemeProvider';
import { useAppSelector } from '~/app/store/hooks';
import { selectCurrentModule } from '~/features/auth/store/authSlice';
import { UI_CONSTANTS } from '~/app/constants';

/**
 * Admin layout component for authenticated users
 */
export const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const { mode, toggleTheme } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentModule = useAppSelector(selectCurrentModule);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getModuleTitle = (module: string | null) => {
    switch (module) {
      case 'hostel':
        return 'Hostel Management System';
      case 'education':
        return 'Education Management System';
      case 'accounts':
        return 'Accounts Management System';
      case 'library':
        return 'Library Management System';
      default:
        return 'School Management System';
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${UI_CONSTANTS.DRAWER_WIDTH}px)` },
          ml: { md: `${UI_CONSTANTS.DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getModuleTitle(currentModule)}
          </Typography>
          
          <LanguageSelector />
          
          <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Box sx={{ ml: 1 }}>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: UI_CONSTANTS.DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: UI_CONSTANTS.DRAWER_WIDTH,
            },
          }}
        >
          <Sidebar />
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: UI_CONSTANTS.DRAWER_WIDTH,
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${UI_CONSTANTS.DRAWER_WIDTH}px)` },
          mt: `${UI_CONSTANTS.HEADER_HEIGHT}px`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};