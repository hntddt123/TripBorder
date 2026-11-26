import { Navigate, Outlet } from 'react-router-dom';
import { useCheckAuthStatusQuery, isUnauthorizedError } from '../api/authAPI';
import CustomError from './CustomError';
import CustomLoading from './CustomLoading';
import CustomFetching from './CustomFetching';

export default function ProtectedRouteAdmin() {
  const { data: user, isLoading, isFetching, error } = useCheckAuthStatusQuery();

  if (isLoading) {
    return <CustomLoading isLoading />;
  }

  if (isFetching) {
    return <CustomFetching isFetching />;
  }

  // 401 = logged out, not an error page
  if (isUnauthorizedError(error)) {
    return <Navigate to='/' replace />;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  if (!user?.isAuthenticated || user?.role !== 'admin') {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
}
