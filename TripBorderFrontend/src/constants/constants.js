// Constants or part is for testing values
const getEnv = () => ({
  MODE: import.meta.env.VITE_MODE || 'development',
  MAPBOX_API_KEY: import.meta.env.VITE_MAPBOX_API_KEY || 'mockMAPBOXKey',
  FOURSQUARE_API_KEY: import.meta.env.VITE_FOURSQUARE_API_KEY || 'mockFOURSQUAREKey',
  VERSION_NUMBER: import.meta.env.VITE_VERSION_NUMBER || '2.1.1',
  BACKEND_DOMAIN: import.meta.env.VITE_BACKEND_DOMAIN || 'localhost',
  PORT: import.meta.env.VITE_PORT || '5173',
});

export const {
  MODE,
  MAPBOX_API_KEY,
  FOURSQUARE_API_KEY,
  VERSION_NUMBER,
  BACKEND_DOMAIN,
  PORT
} = getEnv();

export const baseUrl = `https://${BACKEND_DOMAIN}:${PORT}`;
export const fourSquareBaseUrl = 'https://api.foursquare.com/v3/';
export const mapBoxBaseUrl = 'https://api.mapbox.com/';

export const restaurantIcon = '🍱';
export const hotelIcon = '🛌';
export const carIcon = '🚘';
export const GPSIcon = '🛰️🔎';
export const pinIcon = '📍🔎';
export const diceIcon = '🎲';
export const numIcon = '🔢';
