import { Navigate, Outlet } from 'react-router-dom';
import { useCheckAuthStatusQuery } from '../api/authAPI';

function ProtectedRoute() {
  const { data, isLoading, error } = useCheckAuthStatusQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error checking auth status: {error.error}</div>;
  }

  const isLoggedIn = data?.isLoggedIn === true;

  if (!isLoggedIn) {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
