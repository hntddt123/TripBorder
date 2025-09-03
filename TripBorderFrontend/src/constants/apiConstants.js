import { metersToDeltas } from '../utility/geoCalculation';

const getEnv = () => ({
  MAPBOX_API_KEY: import.meta.env.VITE_MAPBOX_API_KEY || 'mockMAPBOXKey',
  FOURSQUARE_API_KEY: import.meta.env.VITE_FOURSQUARE_API_KEY || 'mockFOURSQUAREKey',
  BASE_URL: import.meta.env.VITE_BASE_URL || 'https://localhost',
});

export const {
  MAPBOX_API_KEY,
  FOURSQUARE_API_KEY,
  BASE_URL
} = getEnv();

export const API_ROUTES = {
  auth: `${BASE_URL}/api/auth`,
  hotels: `${BASE_URL}/api/hotels`,
  meals: `${BASE_URL}/api/meals`,
  mileages: `${BASE_URL}/api/mileages`,
  pois: `${BASE_URL}/api/pois`,
  ratings: `${BASE_URL}/api/ratings`,
  tags: `${BASE_URL}/api/tags`,
  transports: `${BASE_URL}/api/transports`,
  trips: `${BASE_URL}/api/trips`,
  tripTags: `${BASE_URL}/api/trip_tags`,
  users: `${BASE_URL}/api/users`,
};

export const fourSquareBaseUrl = 'https://places-api.foursquare.com';
export const openstreetmapBaseUrl = `${BASE_URL}/nominatim`; // localhost:8080 for seperated docker
export const mapBoxBaseUrl = 'https://api.mapbox.com';
export const getMapBoxDirectionUrl = (lonStart, latStart, lonEnd, latEnd) => (
  `directions/v5/mapbox/walking/${lonStart},${latStart};${lonEnd},${latEnd}?steps=true&geometries=geojson&access_token=${MAPBOX_API_KEY}`
);

export const FOURSQUARE_API_QUERIES = {
  getNearbyPOIQuery: ({ ll, radius, limit, category, sessionToken }) => (
    `/places/search?ll=${ll}&radius=${radius}&limit=${limit}&categories=${category}&sort=DISTANCE&session_token=${sessionToken}`
  ),
  getPOIPhotosQuery: ({ fsqId }) => (
    `/places/${fsqId}/photos?limit=10&sort=POPULAR`
  )
};

export const OPENSTREETMAP_API_QUERIES = {
  getLandmarkFromKeywordQuery: (keyword) => (
    `/search?q=${encodeURIComponent(keyword)}&format=json&limit=1`
  ),
  getLandmarkFromPinQuery: ({ q, pinLat, pinLon, radiusDeg = metersToDeltas(500, pinLat), limit = 5 }) => {
    const lon1 = pinLon - radiusDeg.deltaLon;
    const lat1 = pinLat - radiusDeg.deltaLat;
    const lon2 = pinLon + radiusDeg.deltaLon;
    const lat2 = pinLat + radiusDeg.deltaLat;
    const params = {
      q,
      format: 'json',
      limit: limit.toString(),
      viewbox: `${lon1},${lat1},${lon2},${lat2}`,
      bounded: '1',
      addressdetails: '1',
      extratags: '1',
      namedetails: '1'
    };
    return { url: 'search', params };
  }
};
