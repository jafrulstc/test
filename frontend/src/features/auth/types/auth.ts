import type { BaseEntity } from '~/shared/types/common';

/**
 * User role type
 */
export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'staff';

/**
 * Module permission interface
 */
export interface ModulePermission {
  moduleValue: string;
  permissions: string[];
}

/**
 * User interface
 */
export interface User extends BaseEntity {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  permissions: ModulePermission[];
  defaultModule?: string;
  isActive: boolean;
  password?: string; // Added password field for authentication
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
  module: string; // Added module field
  rememberMe?: boolean;
}


/**
 * Auth state interface
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  currentModule: string | null;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Token verification response interface
 */
export interface TokenVerificationResponse {
  user: User;
  token: string;
  isValid: boolean;
}

/**
 * Password change request interface
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Profile update request interface
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string;
}

/**
 * Permission check interface
 */
export interface PermissionCheck {
  module: string;
  permission: string;
}

/**
 * Auth context interface
 */
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (module: string, permission: string) => boolean;
  hasModuleAccess: (module: string) => boolean;
  switchModule: (module: string) => void;
}