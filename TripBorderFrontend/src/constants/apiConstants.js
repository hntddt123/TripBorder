import { BASE_URL } from './constants';

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

export const FOURSQUARE_API_QUERIES = {
  getNearbyPOIQuery: ({ ll, radius, limit, category, sessionToken }) => (
    `/places/search?ll=${ll}&radius=${radius}&limit=${limit}&categories=${category}&sort=DISTANCE&session_token=${sessionToken}`
  ),
  getPOIPhotosQuery: ({ fsqId }) => (
    `/places/${fsqId}/photos?limit=10&sort=POPULAR`
  )
};
