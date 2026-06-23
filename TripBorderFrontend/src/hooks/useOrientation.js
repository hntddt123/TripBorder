import { useState, useEffect } from 'react';

export const useOrientation = () => {
  const getState = () => {
    const angle = window.screen.orientation?.angle ?? (window.screen.orientation || 0);
    const type = window.screen.orientation?.type;
    return {
      type,
      angle, // 0, 90, 180, 270
      isPortrait: angle === 0 || angle === 180,
      isLandscape: angle === 90 || angle === 270,
    };
  };

  const [orientation, setOrientation] = useState(getState());

  useEffect(() => {
    const handleChange = () => setOrientation(getState());
    window.screen.orientation?.addEventListener('change', handleChange);
    return () => window.screen.orientation?.removeEventListener('change', handleChange);
  }, []);

  return orientation;
};
