import axios from 'axios';

// Create an axios instance with default configuration
const API_URL = import.meta.env.VITE_API_URL;

const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies handling
});

const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies handling
});

// We'll configure the interceptors after store is initialized
// to avoid circular dependencies
let storeInstance: any = null;

export const setAuthStore = (store: any) => {
  storeInstance = store;
  
  // Set up interceptors for private axios instance
  axiosPrivate.interceptors.request.use(
    (config) => {
      // Get the token from the store
      if (storeInstance) {
        const token = storeInstance.getState().auth.token;
        
        // If token exists, add it to the headers
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 (Unauthorized) and not a retry and not a refresh token request
      if (
        error.response?.status === 401 && 
        !originalRequest._retry && 
        storeInstance &&
        !originalRequest.url?.includes('refresh-token')
      ) {
        originalRequest._retry = true;
        
        try {
          // Dispatch refresh token action by getting it from the store at runtime
          const refreshTokenAction = await import('@/store/slices/authSlice').then(module => module.refreshToken);
          const result = await storeInstance.dispatch(refreshTokenAction()).unwrap();
          
          // If refreshing was successful, retry the request with the new token
          if (result && result.accessToken) {
            // Update the Authorization header with the new token
            originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
            return axiosPrivate(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, logout the user
          const { logoutUser } = await import('@/store/slices/authSlice');
          storeInstance.dispatch(logoutUser());
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Set up a public instance interceptor to update the axiosPublic Authorization header
// when the token changes in the store
axiosPublic.interceptors.request.use(
  (config) => {
    // Don't add the token to refresh-token or login requests
    const isAuthRequest = config.url?.includes('/auth/login') || 
                          config.url?.includes('/auth/refresh-token');
    
    if (storeInstance && !isAuthRequest) {
      const token = storeInstance.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosPublic, axiosPrivate };
