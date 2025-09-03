import { calculateDistance } from './geoCalculation';

export const getNearestPOI = (poi, longPressedLonLat) => poi.toSorted((marker, marker2) => {
  const dist1 = calculateDistance(
    marker.lat,
    marker.lon,
    longPressedLonLat.latitude,
    longPressedLonLat.longitude
  );
  const dist2 = calculateDistance(
    marker2.lat,
    marker2.lon,
    longPressedLonLat.latitude,
    longPressedLonLat.longitude
  );
  return (dist1 - dist2);
});
