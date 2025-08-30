import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Chip,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  Hotel,
  People,
  FamilyRestroom,
  CheckCircle,
  Payment,
  Restaurant,
  Notifications,
  Assessment,
  School,
  AccountBalance,
  LocalLibrary,
  Storage,
  Assignment,
  ExpandLess,
  ExpandMore,
  PersonAdd,
  List as ListIcon,
  Person,
  ManageAccounts,
} from '@mui/icons-material';
import { useAppSelector } from '~/app/store/hooks';
import { selectCurrentModule, selectUser } from '~/features/auth/store/authSlice';

interface MenuItem {
  key: string;
  icon: React.ComponentType;
  path: string;
  module: string;
  requiredPermissions?: string[];
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  key: string;
  icon: React.ComponentType;
  path: string;
  label: string;
}

/**
 * Navigation menu items configuration by module
 */
const menuItemsByModule: Record<string, MenuItem[]> = {
  hostel: [
    { key: 'rooms', icon: Hotel, path: '/admin/hostel/rooms', module: 'hostel' },
    { key: 'students', icon: People, path: '/admin/hostel/students', module: 'hostel' },
    { key: 'guardians', icon: FamilyRestroom, path: '/admin/hostel/guardians', module: 'hostel' },
    { key: 'attendance', icon: CheckCircle, path: '/admin/hostel/attendance', module: 'hostel' },
    { key: 'fees', icon: Payment, path: '/admin/hostel/fees', module: 'hostel' },
    { key: 'meals', icon: Restaurant, path: '/admin/hostel/meals', module: 'hostel' },
    { key: 'notices', icon: Notifications, path: '/admin/hostel/notices', module: 'hostel' },
    { key: 'reports', icon: Assessment, path: '/admin/hostel/reports', module: 'hostel' },
  ],
  education: [
    { key: 'dashboard', icon: Dashboard, path: '/admin/education/dashboard', module: 'education' },
    { key: 'education.classes', icon: School, path: '/admin/education/classes', module: 'education' },
    { key: 'education.subjects', icon: Assessment, path: '/admin/education/subjects', module: 'education' },

    {
      key: 'education.persons.name',
      icon: People,
      path: '/admin/education/persons',
      module: 'education',
      subItems: [
        { key: 'education.persons.manage', icon: ManageAccounts, path: '/admin/education/persons/manage', label: 'Manage' },
        { key: 'education.persons.form', icon: PersonAdd, path: '/admin/education/persons/form', label: 'Form' },
        { key: 'education.persons.report', icon: PersonAdd, path: '/admin/education/persons/report', label: 'Report' },
      ]
    },    
    
    {
      key: 'education.students.name',
      icon: People,
      path: '/admin/education/students',
      module: 'education',
      subItems: [
        { key: 'education.students.manage', icon: ManageAccounts, path: '/admin/education/students/manage', label: 'Manage' },
        { key: 'education.students.form', icon: PersonAdd, path: '/admin/education/students/form', label: 'Form' },
        { key: 'education.students.report', icon: PersonAdd, path: '/admin/education/students/report', label: 'Report' },
      ]
    },
    {
      key: 'education.teachers.name',
      icon: People,
      path: '/admin/education/teachers',
      module: 'education',
      subItems: [
        { key: 'education.teachers.manage', icon: PersonAdd, path: '/admin/education/teachers/manage', label: 'Manage' },
        { key: 'education.teachers.form', icon: PersonAdd, path: '/admin/education/teachers/form', label: 'Form' },
        { key: 'education.teachers.report', icon: Assignment, path: '/admin/education/teachers/report', label: 'Report' },
      ]
    },
    {
      key: 'education.staffs.name',
      icon: People,
      path: '/admin/education/staffs',
      module: 'education',
      subItems: [
        { key: 'education.staffs.manage', icon: PersonAdd, path: '/admin/education/staffs/manage', label: 'Manage' },
        { key: 'education.staffs.form', icon: PersonAdd, path: '/admin/education/staffs/form', label: 'Form' },
        { key: 'education.staffs.report', icon: Assignment, path: '/admin/education/staffs/report', label: 'Report' },
      ]
    },

    { key: 'education.attendance', icon: CheckCircle, path: '/admin/education/attendance', module: 'education' },
    { key: 'education.exams', icon: Assessment, path: '/admin/education/exams', module: 'education' },
    { key: 'masterData', icon: Storage, path: '/admin/education/master-data', module: 'education' },
    { key: 'education.reports', icon: Assessment, path: '/admin/education/reports', module: 'education' },
  ],
  accounts: [
    { key: 'dashboard', icon: Dashboard, path: '/admin/accounts/dashboard', module: 'accounts' },
    { key: 'transactions', icon: AccountBalance, path: '/admin/accounts/transactions', module: 'accounts' },
    { key: 'fees', icon: Payment, path: '/admin/accounts/fees', module: 'accounts' },
    { key: 'expenses', icon: Payment, path: '/admin/accounts/expenses', module: 'accounts' },
    { key: 'reports', icon: Assessment, path: '/admin/accounts/reports', module: 'accounts' },
  ],
  library: [
    { key: 'dashboard', icon: Dashboard, path: '/admin/library/dashboard', module: 'library' },
    { key: 'books', icon: LocalLibrary, path: '/admin/library/books', module: 'library' },
    { key: 'members', icon: People, path: '/admin/library/members', module: 'library' },
    { key: 'borrowing', icon: CheckCircle, path: '/admin/library/borrowing', module: 'library' },
    { key: 'reports', icon: Assessment, path: '/admin/library/reports', module: 'library' },
  ],
  boarding: [
    { key: 'dashboard', icon: Dashboard, path: '/admin/boarding/dashboard', module: 'boarding' },
    { key: 'boarding.packages', icon: Restaurant, path: '/admin/boarding/packages', module: 'boarding' },
    // {
    //   key: 'boarding.students.name', icon: People, path: '/admin/boarding/students/', module: 'boarding', subItems: [
    //     { key: 'boarding.students.assign', icon: People, path: '/admin/boarding/students/assign', label: 'Assign' },
    //   ]

    // },
    { key: 'boarding.assign', icon: People, path: '/admin/boarding/assign', module: 'boarding' },
    { key: 'boarding.meals', icon: Restaurant, path: '/admin/boarding/meals', module: 'boarding' },
    { key: 'boarding.attendance', icon: CheckCircle, path: '/admin/boarding/attendance', module: 'boarding' },
    { key: 'boarding.billing', icon: Payment, path: '/admin/boarding/billing', module: 'boarding' },
    { key: 'boarding.reports', icon: Assessment, path: '/admin/boarding/reports', module: 'boarding' },
    { key: 'boarding.master_data', icon: Storage, path: '/admin/boarding/master-data', module: 'boarding' },
  ],
};

/**
 * Sidebar navigation component
 * Displays navigation menu based on current module with permission checking
 */
export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentModule = useAppSelector(selectCurrentModule);
  const user = useAppSelector(selectUser);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  /**
   * Handle navigation item click
   */
  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  /**
   * Handle menu item expansion toggle
   */
  const handleToggleExpansion = (itemKey: string): void => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  /**
   * Handle menu item click (with sub-items support)
   */
  const handleMenuItemClick = (item: MenuItem): void => {
    if (item.subItems && item.subItems.length > 0) {
      handleToggleExpansion(item.key);
    } else {
      handleNavigation(item.path);
    }
  };

  /**
   * Check if current path matches item or its sub-items
   */
  const isItemActive = (item: MenuItem): boolean => {
    if (location.pathname === item.path) return true;

    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.path);
    }

    return false;
  };

  /**
   * Check if user has permission for a menu item
   */
  const hasPermission = (item: MenuItem): boolean => {
    if (!user || !currentModule) return false;

    const modulePermissions = user.permissions.find(p => p.moduleValue === currentModule);
    if (!modulePermissions) return false;

    // If no specific permissions required, just check if user has access to module
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true;
    }

    // Check if user has all required permissions
    return item.requiredPermissions.every(permission =>
      modulePermissions.permissions.includes(permission)
    );
  };

  /**
   * Get module display name
   */
  const getModuleDisplayName = (module: string | null): string => {
    switch (module) {
      case 'hostel':
        return t('navigation.sidebar.module.hostel');
      case 'education':
        return t('navigation.sidebar.module.education');
      case 'accounts':
        return t('navigation.sidebar.module.accounts');
      case 'library':
        return t('navigation.sidebar.module.library');
      case 'boarding':
        return t('navigation.sidebar.module.boarding');
      default:
        return 'Management System';
    }
  };

  // Get menu items for current module
  const menuItems = currentModule ? menuItemsByModule[currentModule] || [] : [];

  return (
    <Box>
      {/* Sidebar Header */}
      <Toolbar>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="h6" noWrap component="div">
            {getModuleDisplayName(currentModule)}
          </Typography>
          {currentModule && (
            <Chip
              label={currentModule.toUpperCase()}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ alignSelf: 'flex-start', mt: 0.5 }}
            />
          )}
        </Box>
      </Toolbar>

      <Divider />

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item);
          const hasAccess = hasPermission(item);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.has(item.key);

          if (!hasAccess) {
            return null; // Don't render items user doesn't have access to
          }

          return (
            <React.Fragment key={item.key}>
              <ListItem disablePadding>
<ListItemButton
    selected={isActive && !hasSubItems}
    onClick={() => handleMenuItemClick(item)}
    sx={{
        '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
                backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
            },
        },
    }}
>
    <ListItemIcon>
        <Icon />
    </ListItemIcon>
    <ListItemText primary={t(`navigation.sidebar.items.${item.key}`)} />
    {hasSubItems && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
</ListItemButton>
              </ListItem>

              {/* Sub-items */}
              {hasSubItems && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubItemActive = location.pathname === subItem.path;

                      return (
                        <ListItem key={subItem.key} disablePadding>
                          <ListItemButton
                            selected={isSubItemActive}
                            onClick={() => handleNavigation(subItem.path)}
                            sx={{
                              pl: 4,
                              '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': {
                                  backgroundColor: 'primary.dark',
                                },
                                '& .MuiListItemIcon-root': {
                                  color: 'primary.contrastText',
                                },
                              },
                            }}
                          >
                            <ListItemIcon>
                              <SubIcon />
                            </ListItemIcon>
                            <ListItemText primary={t(`navigation.sidebar.items.${subItem.key}`)} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>

      {/* User Info */}
      {user && (
        <>
          <Divider sx={{ mt: 'auto' }} />
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Logged in as
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.role.replace('_', ' ').toUpperCase()}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};