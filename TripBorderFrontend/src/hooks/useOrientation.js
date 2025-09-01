import { useState, useEffect } from 'react';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState(window.screen.orientation.type);

  useEffect(() => {
    const handleChange = () => setOrientation(window.screen.orientation.type);
    window.screen.orientation.addEventListener('change', handleChange);
    return () => window.screen.orientation.removeEventListener('change', handleChange);
  }, []);

  const isPortrait = orientation.includes('portrait');

  return { isPortrait };
};
