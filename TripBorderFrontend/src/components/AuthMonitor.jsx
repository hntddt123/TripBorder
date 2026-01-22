// src/components/AuthMonitor.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckAuthStatusQuery } from '../api/authAPI'; // adjust import

export function AuthMonitor() {
  const navigate = useNavigate();
  const location = useLocation();

  // refetchOnFocus: fresh check when tab/window regains focus (common after idle)
  // refetchOnReconnect: fresh check on network restore
  const { data, isLoading } = useCheckAuthStatusQuery(undefined, {
    refetchOnFocus: true, // triggers on return from idle/minimize/switch tab
    refetchOnReconnect: true, // triggers on connectivity restore
  });

  useEffect(() => {
    // Avoid redirect loop if already on login
    // Preserve full current path for post-login return (e.g., /plantrip?step=3)
    if (
      !isLoading
      && data?.isAuthenticated === false
      && location.pathname !== '/'
    ) {
      sessionStorage.setItem(
        'postAuthRedirect',
        location.pathname
      );
      navigate('/', { replace: true });
    }
  }, [isLoading, data, location, navigate]);

  return null;
}
