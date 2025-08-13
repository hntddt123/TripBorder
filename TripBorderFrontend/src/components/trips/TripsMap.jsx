import { useEffect } from 'react';
import CustomMap from './CustomMap';

export default function TripsMap() {
  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 30, behavior: 'smooth' }), 100);
  }, []);

  return (
    <CustomMap />
  );
}
