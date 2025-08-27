import { Navigate, Outlet } from 'react-router-dom';
import { useCheckAuthStatusQuery } from '../api/authAPI';
import { isDevMode } from '../constants/constants';
import CustomError from './CustomError';
import CustomLoading from './CustomLoading';
import CustomFetching from './CustomFetching';
import { isTrialActive } from '../utility/time';

export default function ProtectedRoutePremium() {
  const { data: user, isLoading, isFetching, error } = useCheckAuthStatusQuery();

  if (isDevMode) {
    // Skip auth in dev mode
    return <Outlet />;
  }

  if (isLoading) {
    return <CustomLoading isLoading />;
  }

  if (isFetching) {
    return <CustomFetching isFetching />;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const isPremium = (user?.role === 'premium_user'
    || user?.role === 'admin')
    || (isTrialActive(user?.trial_started_at));

  if (!isPremium && user?.role === 'user') {
    return <Navigate to='/upgrade' replace />;
  }

  if (!user?.isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
