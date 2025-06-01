
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { selectIsAuthenticated, getCurrentUser } from '@/store/slices/authSlice';

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      // Try to fetch the current user data if authenticated
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
