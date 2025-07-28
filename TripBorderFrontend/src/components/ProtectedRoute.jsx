import { Navigate, Outlet } from 'react-router-dom';
import { useCheckAuthStatusQuery } from '../api/authAPI';
import { isDevMode } from '../constants/constants';
import CustomError from './CustomError';

function ProtectedRoute() {
  const { data, isLoading, error } = useCheckAuthStatusQuery();

  if (isDevMode) {
    // Skip auth in dev mode
    return <Outlet />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const isAuthenticated = data?.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
