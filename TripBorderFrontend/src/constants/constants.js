// Constants or part is for testing values
const getEnv = () => ({
  MODE: import.meta.env.VITE_MODE || 'development',
  MAPBOX_API_KEY: import.meta.env.VITE_MAPBOX_API_KEY || 'mockMAPBOXKey',
  FOURSQUARE_API_KEY: import.meta.env.VITE_FOURSQUARE_API_KEY || 'mockFOURSQUAREKey',
  VERSION_NUMBER: import.meta.env.VITE_VERSION_NUMBER || 'Add version number in .env',
  BASE_URL: import.meta.env.VITE_BASE_URL || 'https://localhost',
});

export const {
  MODE,
  MAPBOX_API_KEY,
  FOURSQUARE_API_KEY,
  VERSION_NUMBER,
  BASE_URL
} = getEnv();

export const isDevMode = (MODE === 'development');

export const fourSquareBaseUrl = 'https://api.foursquare.com/v3';
export const mapBoxBaseUrl = 'https://api.mapbox.com';
export const getMapBoxDirectionUrl = (lonStart, latStart, lonEnd, latEnd) => (
  `directions/v5/mapbox/walking/${lonStart},${latStart};${lonEnd},${latEnd}?steps=true&geometries=geojson&access_token=${MAPBOX_API_KEY}`
);
export const openstreetmapBaseUrl = 'http://localhost:8080'; // localhost:8080 for self host

// FoursquarePOI icon list
export const restaurantIcon = '🍱';
export const parkIcon = '🏞️';
export const museumIcon = '🏛️';
export const hotelIcon = '🛌';
export const carIcon = '🚘';
export const shoppingIcon = '🛍️';
// FoursquarePOI icon list End

export const GPSIcon = '🛰️🔍';
export const diceIcon = '🎲';
export const numIcon = '🔢';

// Define the Foursquare categories and their corresponding icons
export const iconMap = {
  '4d4b7105d754a06374d81259': { icon: restaurantIcon, label: 'Restaurant' },
  '4d4b7105d754a06377d81259': { icon: parkIcon, label: 'Landmarks and Outdoors' },
  '4bf58dd8d48988d181941735': { icon: museumIcon, label: 'Museum' },
  '4bf58dd8d48988d1fa931735': { icon: hotelIcon, label: 'Hotel' },
  '4d4b7105d754a06379d81259': { icon: carIcon, label: 'Travel and Transportation' },
  '4bf58dd8d48988d1fd941735': { icon: shoppingIcon, label: 'Shopping' },
};

export const poiCategories = Object
  .entries(iconMap)
  .map(([id, { icon, label }]) => ({
    id,
    icon,
    label,
  }));
