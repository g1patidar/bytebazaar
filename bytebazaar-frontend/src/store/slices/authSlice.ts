import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosPublic } from '@/api/axios';

// Define standalone type rather than importing from the store
type AppState = {
  auth: AuthState;
  cart: any;
  [key: string]: any;
};

export interface User {
  id?: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosPublic.post('/auth/login', { email, password },{
        headers:{'Content-Type': 'application/json'},
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for getting current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.token) return rejectWithValue('No token available');
      
      const response = await axiosPublic.get('/auth/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

// Async thunk for refreshing token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosPublic.post('/auth/refresh-token');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
    }
  }
);

// Async thunk for registering user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, confirmPassword }: { 
    name: string; 
    email: string; 
    password: string;
    confirmPassword: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axiosPublic.post('/auth/signup', { 
        name, 
        email, 
        password,
        confirmPassword 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosPublic.post('/auth/logout');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;

          }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { 
          name: action.payload.name, 
          email: action.payload.email, 
          isAdmin: action.payload.isAdmin 
        };
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin
        };
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout user cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions separately
export const { 
  clearError, 
  logout,
  loginSuccess
} = authSlice.actions;

// Use the standalone AppState type
export const selectAuth = (state: AppState) => state.auth;
export const selectIsAuthenticated = (state: AppState) => state.auth.isAuthenticated;
export const selectUser = (state: AppState) => state.auth.user;
export const selectAuthError = (state: AppState) => state.auth.error;
export const selectIsLoading = (state: AppState) => state.auth.isLoading;

// Export the default reducer
export default authSlice.reducer;
