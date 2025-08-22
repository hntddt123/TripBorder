import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCheckAuthStatusQuery, useLogoutMutation } from '../api/authAPI';
import { BASE_URL } from '../constants/constants';
import { isTrialActive } from '../utility/time';
import CustomButton from './CustomButton';
import GoogleSignInButton from './GoogleSignInButton';
import CustomError from './CustomError';
import CustomLoading from './CustomLoading';

export default function Auth() {
  const { data: user, isLoading, error, refetch } = useCheckAuthStatusQuery();
  const isAuthenticated = user?.isAuthenticated;
  const userName = user?.name || null;
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
    refetch();
  }, [location.search, navigate, refetch, user]);

  const handleLogin = () => {
    // Redirect to Google OAuth login
    window.location.href = `${BASE_URL}/api/auth/google`;
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
    return <div><CustomLoading isLoading /></div>;
  }

  if (error) {
    return <CustomError error={error} />;
  }

  const renderAdminFeatures = () => {
    if (role === 'admin') {
      return (
        <div className='mainmenu'>
          <CustomButton
            className='buttonMainmenu bg-[url(./public/menuImages/Plantrips.png)]'
            label='Plan Trip'
            to='/plantrip'
          />
          <CustomButton
            className='buttonMainmenu'
            label='View Trips'
            to='/trips'
          />
          <CustomButton
            className='buttonMainmenu'
            label='Mileages'
            to='/mileages'
          />
          <CustomButton
            className='buttonMainmenu'
            label='Mileage Verification'
            to='/mileagesverification'
          />
          <CustomButton
            className='buttonMainmenu'
            label='Database Table'
            to='/database'
          />
        </div>
      );
    }
    return null;
  };

  const renderPremiumUserFeatures = () => {
    if (role === 'premium_user') {
      return (
        <div className='mainmenu'>
          <CustomButton
            className='buttonMainmenu'
            label='Plan Trip'
            to='/plantrip'
          />
          <CustomButton
            className='buttonMainmenu'
            label='View Trips'
            to='/trips'
          />
          <CustomButton
            className='buttonMainmenu'
            label='Mileages'
            to='/mileages'
          />
        </div>
      );
    }
    return null;
  };

  const renderUserFeatures = () => {
    if (role === 'user') {
      return (
        <div className='mainmenu'>
          {(isTrialActive(user?.trial_started_at))
            ? <CustomButton className='buttonMainmenu' label='Plan Trip' to='/plantrip' />
            : null}
          {(isTrialActive(user?.trial_started_at))
            ? <CustomButton className='buttonMainmenu' label='View Trips' to='/trips' />
            : null}
          <CustomButton
            className='buttonMainmenu'
            label='Mileages'
            to='/mileages'
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {(isAuthenticated) ? (
        <div className='container justify-center text-center mx-auto mt-2 mb-2 max-w-lg'>
          <div className='text-2xl'>Welcome, {userName}!</div>
          {renderAdminFeatures()}
          {renderPremiumUserFeatures()}
          {renderUserFeatures()}
          <div className='grid grid-cols-2'>
            <CustomButton label='Settings' to='/settings' />
            <CustomButton label='Disclaimers' to='/disclaimers' />
            {(role === 'user') ? <CustomButton label='Upgrade' to='/upgrade' /> : null}
          </div>
          <CustomButton
            label={isLoggingOut ? 'Logging out...' : 'Logout'}
            onClick={handleLogout}
            disabled={isLoggingOut}
          />
        </div>
      ) : (
        <div>
          <div className='text-2xl m-2'>Login with following options</div>
          <GoogleSignInButton onClick={handleLogin} />
        </div>
      )}
    </div>
  );
}
