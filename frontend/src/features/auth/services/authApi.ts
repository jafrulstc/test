


import BaseApiService from '~/shared/services/api/baseApi';
import { LoginCredentials, User } from '~/features/auth/types/auth';
import { tPath } from '~/shared/utils/translateType';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

/**
 * Login response interface
 */
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Token verification response interface
 */
export interface TokenVerificationResponse {
  user: User;
  token: string;
}

/**
 * Mock users for development
 */
const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'admin',
    email: 'admin@school.edu',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'super_admin',
    permissions: [
      { moduleValue: 'hostel', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'education', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'accounts', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'library', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'boarding', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'education',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'admin123', // Specific password for admin
  },
  {
    id: 'user2',
    username: 'hostel_manager',
    email: 'hostel@school.edu',
    firstName: 'Hostel',
    lastName: 'Manager',
    role: 'admin',
    permissions: [
      { moduleValue: 'hostel', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'boarding', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'hostel',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'hostel123', // Specific password for hostel manager
  },
  {
    id: 'user3',
    username: 'education_admin',
    email: 'education@school.edu',
    firstName: 'Education',
    lastName: 'Administrator',
    role: 'admin',
    permissions: [
      { moduleValue: 'education', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'education',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'education123', // Specific password for education admin
  },
  {
    id: 'user4',
    username: 'accounts_manager',
    email: 'accounts@school.edu',
    firstName: 'Accounts',
    lastName: 'Manager',
    role: 'admin',
    permissions: [
      { moduleValue: 'accounts', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'accounts',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'accounts123', // Specific password for accounts manager
  },
  {
    id: 'user5',
    username: 'boarding_manager',
    email: 'boarding@school.edu',
    firstName: 'Boarding',
    lastName: 'Manager',
    role: 'admin',
    permissions: [
      { moduleValue: 'boarding', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'boarding',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'boarding123', // Specific password for boarding manager
  },
  {
    id: 'user6',
    username: 'teacher1',
    email: 'teacher1@school.edu',
    firstName: 'John',
    lastName: 'Smith',
    role: 'teacher',
    permissions: [
      { moduleValue: 'education', permissions: ['read', 'write'] },
    ],
    defaultModule: 'education',
    isActive: true,
    createdAt: new Date().toISOString(),
    password: 'teacher123', // Specific password for teacher
  },
];

/**
 * Auth API service class
 */
class AuthApiService extends BaseApiService {
  /**
   * Login user
   */
  
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.simulateDelay(1000);

    // Find user by username
    const user = mockUsers.find(u => u.username === credentials.username && u.isActive);
    
    if (!user) {
      throw new Error(t(tPath.auth.login.errors.invalid));
    }

    // Validate password
    if (!credentials.password) {
      throw new Error(t(tPath.auth.login.errors.invalid));
    }

    // Check if the provided password matches the user's password
    if (credentials.password !== user.password) {
      throw new Error(t(tPath.auth.login.errors.invalid));
    }

    // Validate module selection
    if (!credentials.module) {
      throw new Error(t(tPath.auth.login.module.error.required));
    }

    // Check if user has access to the selected module
    const hasModuleAccess = user.permissions.some(perm => perm.moduleValue === credentials.module);
    if (!hasModuleAccess) {
      throw new Error(t(tPath.auth.login.errors.noAccess));
    }

    // Generate mock JWT token
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;

    return {
      user,
      token,
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.simulateDelay(500);
    // In a real implementation, you would invalidate the token on the server
    return;
  }

  /**
   * Verify token
   */
  async verifyToken(token: string): Promise<TokenVerificationResponse> {
    await this.simulateDelay(300);

    // Extract user ID from mock token
    const tokenParts = token.split('_');
    if (tokenParts.length < 4 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'jwt' || tokenParts[2] !== 'token') {
      throw new Error(t(tPath.auth.login.errors.invalidToken));
    }

    const userId = tokenParts[3];
    const user = mockUsers.find(u => u.id === userId && u.isActive);

    if (!user) {
      throw new Error(tPath.auth.login.errors.expiredToken);
    }

    return {
      user,
      token,
    };
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    await this.simulateDelay(200);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error(tPath.auth.login.errors.noToken);
    }

    const response = await this.verifyToken(token);
    return response.user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.simulateDelay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error(tPath.auth.login.errors.userNotFound);
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockUsers[userIndex];
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    await this.simulateDelay(500);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error(tPath.auth.login.errors.userNotFound);
    }

    // Verify current password
    if (currentPassword !== user.password) {
      throw new Error(tPath.auth.login.errors.currentPasswordIncorrect);
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      throw new Error(tPath.auth.login.errors.passwordTooShort);
    }

    // Update the user's password
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    
    return;
  }
}

export const authApi = new AuthApiService();