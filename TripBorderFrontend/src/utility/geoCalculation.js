export function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2,
  unit = 'm'
) {
  // Earth radius; km for metric, miles for imperial).
  let R = 6371000;
  if (unit === 'ft') R *= 3.28084;
  else if (unit === 'km') R /= 1000;
  else if (unit === 'miles') R /= 1609.34;
  // Convert to radians (why: Math.sin/cos use radians).
  const toRad = (deg) => deg * (Math.PI / 180);
  const rLat1 = toRad(lat1); // Example: 0.6581 rad.
  const rLat2 = toRad(lat2); // Example: 0.6582 rad.
  const dLat = toRad(lat2 - lat1); // Delta lat (example: 0.0001 rad).
  const dLon = toRad(lon2 - lon1); // Delta lon (example: -0.000068 rad).

  // Haversine formula (why: computes great-circle distance).
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Central angle.
  const distance = R * c; // Distance (example: ~0.6 km).

  // Round to 2 decimals (why: UX-friendly, avoids float precision issues).
  return unit === 'm' || unit === 'ft'
    ? Math.round(distance)
    : Number(distance.toFixed(2));
}

// WGS84 constants (industry standard for accuracy).
const A = 6378137; // Equatorial radius m (example: used in formulas).
const E2 = 0.00669437999014; // Eccentricity squared (example: 2*f - f^2 where f=1/298.257223563).

// Meters per degree lat (why: meridional arc; first principle: ellipsoid curvature).
function metersPerDegLat(latDeg) {
  const latRad = latDeg * (Math.PI / 180); // To radians (example: 37.7749° → 0.658 rad; why: trig funcs require).
  const denom = (1 - E2 * Math.sin(latRad) ** 2) ** 1.5; // (1 - e² sin²φ)^{3/2} (example: ~0.999 at equator).
  return (Math.PI * A * (1 - E2)) / (180 * denom); // Formula (example: ~111133 m/° at 37.7749°).
}

// Meters per degree lon (why: parallel arc; adjusts for lat).
function metersPerDegLon(latDeg) {
  const latRad = latDeg * (Math.PI / 180); // To radians (same as above).
  const denom = Math.sqrt(1 - E2 * Math.sin(latRad) ** 2); // sqrt(1 - e² sin²φ) (example: ~0.999).
  return (Math.PI * A * Math.cos(latRad)) / (180 * denom); // Formula (example: ~88700 m/° at 37.7749°; cos adjusts E-W).
}

// Convert meters to deltas (DRY: combines above; DIP: abstracts for viewbox).
export function metersToDeltas(meters, latDeg) {
  const mPerLat = metersPerDegLat(latDeg); // Get lat scale (example: 111133 m/°).
  const mPerLon = metersPerDegLon(latDeg); // Get lon scale (example: 88700 m/°).
  return { // Return obj (why: separate for accurate box).
    deltaLat: meters / mPerLat, // Delta lat deg (example: 500 / 111133 ≈ 0.0045°).
    deltaLon: meters / mPerLon, // Delta lon deg (example: 500 / 88700 ≈ 0.0056°).
  };
}
