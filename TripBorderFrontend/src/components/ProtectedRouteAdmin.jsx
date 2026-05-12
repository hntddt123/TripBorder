import { Navigate, Outlet } from 'react-router-dom';
import { useCheckAuthStatusQuery } from '../api/authAPI';
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

  if (error) {
    return <CustomError error={error} />;
  }

  if (!user?.isAuthenticated || user?.role !== 'admin') {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
}
