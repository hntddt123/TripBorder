// Constants or part is for testing values
const getEnv = () => ({
  MODE: import.meta.env.VITE_MODE || 'development',
  VERSION_NUMBER: import.meta.env.VITE_VERSION_NUMBER || 'Add version number in .env',
  BASE_URL: import.meta.env.VITE_BASE_URL || 'https://localhost',
  UNSPLASH_APP_NAME: import.meta.env.VITE_UNSPLASH_APP_NAME || 'TripBorderDev'
});

export const {
  MODE,
  VERSION_NUMBER,
  UNSPLASH_APP_NAME
} = getEnv();

export const isDevMode = (MODE === 'development');

// poi icon list
export const restaurantIcon = '🍱';
export const parkIcon = '🏞️';
export const museumIcon = '🏛️';
export const SpritIcon = '🙏';
export const hotelIcon = '🛌';
export const transportIcon = '🚀';
export const shoppingIcon = '🛍️';
export const searchIcon = '🔍';
export const allIcon = '🗺️';
// poi icon list End

export const GPSIcon = '🛰️🔍';
export const diceIcon = '🎲';
export const numIcon = '🔢';

// For ClickMarker and GeoCoderControl search icon
export const markerIcon = '📍';

// Define the Foursquare categories and their corresponding icons
export const iconMapFoursquare = {
  '4d4b7105d754a06374d81259': { icon: restaurantIcon, label: 'Restaurant' },
  '4d4b7105d754a06377d81259': { icon: parkIcon, label: 'Landmarks and Outdoors' },
  '4bf58dd8d48988d181941735': { icon: museumIcon, label: 'Museum' },
  '4bf58dd8d48988d131941735': { icon: SpritIcon, label: 'Spiritual Centers' },
  '4bf58dd8d48988d1fa931735': { icon: hotelIcon, label: 'Hotel' },
  '4d4b7105d754a06379d81259': { icon: transportIcon, label: 'Travel and Transportation' },
  '4bf58dd8d48988d1fd941735': { icon: shoppingIcon, label: 'Shopping' },
};

export const iconMapOSM = {
  'amenity=restaurant': { icon: restaurantIcon, label: 'Restaurant', query: 'restaurant' },
  'leisure=park': { icon: parkIcon, label: 'Landmarks and Outdoors', query: 'park OR landmark' },
  'tourism=museum': { icon: museumIcon, label: 'Museum', query: 'museum' },
  'amenity=place_of_worship': { icon: SpritIcon, label: 'Spiritual Centers', query: 'church OR temple OR mosque' },
  'tourism=hotel': { icon: hotelIcon, label: 'Hotel', query: 'hotel' },
  'public_transport=station': { icon: transportIcon, label: 'Travel and Transportation', query: 'bus station OR train station OR airport' },
  'shop=mall': { icon: shoppingIcon, label: 'Shopping', query: 'shopping mall' },
};

export const poiCategories = Object
  .entries(iconMapOSM)
  .map(([id, { icon, label }]) => ({
    id,
    icon,
    label,
  }));
