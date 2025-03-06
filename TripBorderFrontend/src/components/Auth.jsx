import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCheckAuthStatusQuery, useLogoutMutation } from '../api/authAPI';
import CustomButton from './CustomButton';
import GoogleSignInButton from './GoogleSignInButton';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';

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
    window.location.href = `https://${BACKEND_DOMAIN}:${PORT}/auth/google`;
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
    return <div>{`Status: ${error.status} - ${error.error}`}</div>;
  }

  const isLoggedIn = data?.isLoggedIn === true;
  const userName = data?.name || null;
  const profilePicture = data?.profilePicture || null;

  return (
    <div>
      {isLoggedIn ? (
        <div className='flex flex-col container justify-center text-center mx-auto mt-2 mb-2 max'>
          <p className='text-2xl'>Welcome, {userName}!</p>
          <img className='profilepic' src={profilePicture} alt='userprofile' />
          <CustomButton label='New Trip' to='/newtrip' />
          <CustomButton label='View Trips' to='/trips' />
          <CustomButton label='Mileages' to='/mileages' />
          <CustomButton label='Settings' to='/settings' />
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
