// src/components/AuthMonitor.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckAuthStatusQuery, isUnauthorizedError } from '../api/authAPI';

export function AuthMonitor() {
  const navigate = useNavigate();
  const location = useLocation();

  // refetchOnFocus: fresh check when tab/window regains focus (common after idle)
  // refetchOnReconnect: fresh check on network restore
  const { data, isLoading, error } = useCheckAuthStatusQuery(undefined, {
    refetchOnFocus: true, // triggers on return from idle/minimize/switch tab
    refetchOnReconnect: true, // triggers on connectivity restore
  });

  useEffect(() => {
    // Avoid redirect loop if already on login
    // Preserve full current path for post-login return (e.g., /?step=3)
    if (location.pathname === '/sponsors'
      || location.pathname === '/disclaimers') {
      return;
    }

    // Logged out = explicit isAuthenticated:false or an HTTP 401 from /api/auth
    const isLoggedOut = data?.isAuthenticated === false || isUnauthorizedError(error);

    if (
      !isLoading
      && isLoggedOut
      && location.pathname !== '/'
    ) {
      sessionStorage.setItem(
        'postAuthRedirect',
        location.pathname
      );
      navigate('/', { replace: true });
    }
  }, [isLoading, data, error, location, navigate]);

  return null;
}
