import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '~/features/auth/services/authApi';
import { AuthState, LoginCredentials } from '~/features/auth/types/auth';

/**
 * Initial state
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  currentModule: null,
};

/**
 * Login async thunk
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.token);
      
      // Set current module to the selected module from login
      const selectedModule = credentials.module;
      
      if (selectedModule) {
        localStorage.setItem('currentModule', selectedModule);
      }
      
      return { ...response, currentModule: selectedModule };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Logout async thunk
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentModule');
    }
  }
);

/**
 * Verify token async thunk
 */
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const currentModule = localStorage.getItem('currentModule');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await authApi.verifyToken(token);
      return { ...response, currentModule };
    } catch (error: any) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentModule');
      return rejectWithValue(error.message || 'Token verification failed');
    }
  }
);

/**
 * Auth slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentModule: (state, action: PayloadAction<string>) => {
      state.currentModule = action.payload;
      localStorage.setItem('currentModule', action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.currentModule = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentModule');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.currentModule = action.payload.currentModule;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.currentModule = null;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.currentModule = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        // Still clear auth state even if logout API fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.currentModule = null;
      })
      
      // Verify token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.currentModule = action.payload.currentModule;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.currentModule = null;
      });
  },
});

// Export actions
export const { clearError, setCurrentModule, clearAuth } = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectCurrentModule = (state: { auth: AuthState }) => state.auth.currentModule;

// Export reducer
export default authSlice.reducer;