// Constants or part is for testing values
const getEnv = () => ({
  MODE: import.meta.env.VITE_MODE || 'development',
  MAPBOX_API_KEY: import.meta.env.VITE_MAPBOX_API_KEY || 'mockMAPBOXKey',
  FOURSQUARE_API_KEY: import.meta.env.VITE_FOURSQUARE_API_KEY || 'mockFOURSQUAREKey',
  VERSION_NUMBER: import.meta.env.VITE_VERSION_NUMBER || '2.2.0',
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

// FoursquarePOI icon list
export const restaurantIcon = '🍱';
export const museumIcon = '🏛️';
export const hotelIcon = '🛌';
export const carIcon = '🚘';
export const shoppingIcon = '🛍️';
// FoursquarePOI icon list End

export const GPSIcon = '🛰️🔎';
export const pinIcon = '📍🔎';
export const diceIcon = '🎲';
export const numIcon = '🔢';

// Define the Foursquare categories and their corresponding icons
export const iconMap = {
  '4d4b7105d754a06374d81259': { icon: restaurantIcon, label: 'Restaurant' },
  '4bf58dd8d48988d181941735': { icon: museumIcon, label: 'Museum' },
  '4bf58dd8d48988d1fa931735': { icon: hotelIcon, label: 'Hotel' },
  '4d4b7105d754a06379d81259': { icon: carIcon, label: 'Car Rental' },
  '4bf58dd8d48988d1fd941735': { icon: shoppingIcon, label: 'Shopping' },
};

export const poiCategories = Object
  .entries(iconMap)
  .map(([id, { icon, label }]) => ({
    id,
    icon,
    label,
  }));
