import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCheckAuthStatusQuery, useLogoutMutation } from '../api/authAPI';
import { BASE_URL } from '../constants/apiConstants';
import { isTrialActive } from '../utility/time';
import CustomButton from './CustomButton';
import GoogleSignInButton from './GoogleSignInButton';
import CustomError from './CustomError';
import CustomLoading from './CustomLoading';
import TripMap from './trips/TripMap';

export default function Auth() {
  const { data: user, isLoading, error, refetch } = useCheckAuthStatusQuery();
  const isAuthenticated = user?.isAuthenticated;
  const role = user?.role || null;

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const navigate = useNavigate();
  const location = useLocation();

  // Handle redirect success param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('auth') === 'success') {
      navigate(location.pathname, { replace: true }); // Clean URL
    }
    if (isAuthenticated && sessionStorage.getItem('postAuthRedirect') !== null) {
      const redirectPath = sessionStorage.getItem('postAuthRedirect');
      sessionStorage.removeItem('postAuthRedirect'); // cleanup
      navigate(redirectPath);
    }
    refetch();
  }, [location.search, navigate, refetch, user]);

  const handleLogin = () => {
    // Redirect to Google OAuth login
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoading) {
    return <div><CustomLoading isLoading /></div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const renderAdminFeatures = () => {
    if (role === 'admin') {
      return (
        <div>
          <TripMap premium />
        </div>
      );
    }
    return null;
  };

  const renderPremiumUserFeatures = () => {
    if (role === 'premium_user') {
      return (
        <div>
          <TripMap premium />
        </div>
      );
    }
    return null;
  };

  const renderUserFeatures = () => {
    if (role === 'user') {
      return (
        <div>
          {(isTrialActive(user?.trial_started_at))
            ? (
              <div>
                <TripMap premium />
              </div>
            )
            : (
              <div>
                {(isTrialActive(user?.trial_started_at))
                  ? null
                  : (
                    <div className='flex overflow-x-scroll justify-center-safe'>
                      <CustomButton label='Upgrade' to='/upgrade' />
                      <CustomButton
                        label='Sponsors'
                        to='/sponsors'
                      />
                      <CustomButton
                        label='Mileages'
                        to='/mileages'
                      />
                      <CustomButton
                        label='Settings'
                        to='/settings'
                      />
                      <CustomButton
                        label={isLoggingOut ? 'Logging out...' : 'Logout'}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      />
                    </div>
                  )}
                <TripMap />
              </div>
            )}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {(isAuthenticated) ? (
        <div>
          {renderAdminFeatures()}
          {renderPremiumUserFeatures()}
          {renderUserFeatures()}
        </div>
      ) : (
        <div>
          <div className='text-2xl m-2'>Sign in to get premium features</div>
          <GoogleSignInButton onClick={handleLogin} />
        </div>
      )}
    </div>
  );
}
