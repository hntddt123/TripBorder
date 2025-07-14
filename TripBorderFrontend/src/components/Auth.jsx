import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCheckAuthStatusQuery, useLogoutMutation } from '../api/authAPI';
import CustomButton from './CustomButton';
import GoogleSignInButton from './GoogleSignInButton';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';
import CustomError from './CustomError';

function Auth() {
  const [shouldPoll, setShouldPoll] = useState(false);
  const { data, isLoading, error } = useCheckAuthStatusQuery(
    undefined,
    { pollingInterval: shouldPoll ? 1000 : 0 }
  );
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();

  // Enabling polling for auth status
  useEffect(() => {
    if (location.search.includes('auth=success')) {
      setShouldPoll(true);
      const timeout = setTimeout(() => {
        setShouldPoll(false);
        navigate(location.pathname, { replace: true });
      }, 5000);

      return () => clearTimeout(timeout);
    }
    return (a) => a;
  }, [location.search]);

  // User logged in, stopping polling
  useEffect(() => {
    if (data?.isLoggedIn === true) {
      setShouldPoll(false);
    }
  }, [data]);

  const handleLogin = () => {
    // Redirect to Google OAuth login
    window.location.href = `https://${BACKEND_DOMAIN}:${PORT}/api/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const isLoggedIn = data?.isLoggedIn === true;
  const userName = data?.name || null;
  const role = data?.role || null;

  const renderAdminFeatures = () => {
    if (role === 'admin') {
      return (
        <div className='flex flex-col container justify-center text-center mx-auto max-w-lg'>
          <CustomButton label='Plan Trip' to='/plantrip' />
          <CustomButton label='View Trips' to='/trips' />
          <CustomButton label='Mileage Verification' to='/mileagesverification' />
          <CustomButton label='Database Table' to='/database' />
        </div>
      );
    }
    return null;
  };

  const renderPremiumUserFeatures = () => {
    if (role === 'premium_user') {
      return (
        <div className='flex flex-col container justify-center text-center mx-auto max-w-lg'>
          <CustomButton label='Plan Trip' to='/plantrip' />
          <CustomButton label='View Trips' to='/trips' />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className='flex flex-col container justify-center text-center mx-auto mt-2 mb-2 max-w-lg'>
          <p className='text-2xl'>Welcome, {userName}!</p>
          <CustomButton label='Mileages' to='/mileages' />
          <CustomButton label='Settings' to='/settings' />
          <CustomButton label='Disclaimers' to='/disclaimers' />
          {renderAdminFeatures()}
          {renderPremiumUserFeatures()}
          <CustomButton
            label={isLoggingOut ? 'Logging out...' : 'Logout'}
            onClick={handleLogout}
            disabled={isLoggingOut}
          />
        </div>
      ) : (
        <div>
          <p className='text-2xl m-2'>Login with following options</p>
          <GoogleSignInButton onClick={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default Auth;
