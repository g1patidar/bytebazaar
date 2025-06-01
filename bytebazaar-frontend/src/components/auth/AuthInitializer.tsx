import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken, getCurrentUser, selectAuth } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

/**
 * Component that handles auth state initialization and token refresh
 * It should be mounted once at the root of the application
 */
const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector(selectAuth);

  // On mount, try to refresh the token and get current user
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to refresh the token first - will succeed if there's a valid HTTP-only cookie
        const refreshResult = await dispatch(refreshToken()).unwrap();
        
        // If we got a new token, fetch the user data
        if (refreshResult?.accessToken) {
          await dispatch(getCurrentUser()).unwrap();
        }
      } catch (error) {
        // If refresh fails, the user isn't authenticated (which is fine)
        console.error('Auth initialization error:', error);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Set up periodic token refresh (every 14 minutes if the token typically lasts 15 minutes)
  useEffect(() => {
    if (!token) return;

    const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
    const intervalId = setInterval(() => {
      dispatch(refreshToken());
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [dispatch, token]);

  return null; // This component doesn't render anything
};

export default AuthInitializer; 