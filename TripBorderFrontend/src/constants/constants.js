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

export const MAPBOX_LANGS = {
  en: 'English',
  ja: 'Japanese',
  ko: 'Korean',
  'zh-tw': 'Chinese (Traditional)',
  zh: 'Chinese (Simplified)',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
};

export const TRAVEL_MODES = {
  walking: { icon: '🚶', label: 'Walk' },
  driving: { icon: '🚗', label: 'Drive' },
  cycling: { icon: '🚲', label: 'Cycle' }
};
export const getTravelModeConfig = (mode) => TRAVEL_MODES[mode] || TRAVEL_MODES.walking;

export const TRIPMENU_MODES = {
  trip: { icon: '🗺️', label: 'Trip' },
  mileage: { icon: '✈️', label: 'Mileage' }
};
export const getTripMenuModeConfig = (mode) => TRIPMENU_MODES[mode] || TRIPMENU_MODES.trip;

export const COUNTRIES_BOUNDING_BOX = {
  EARTH: {
    name: '',
    emoji: '🗺️',
    bbox: [-180, -90, 180, 90]
  },
  AF: {
    name: 'Afghanistan',
    emoji: '🇦🇫',
    bbox: [60.53, 29.32, 75.16, 38.49]
  },
  AO: {
    name: 'Angola',
    emoji: '🇦🇴',
    bbox: [11.64, -17.93, 24.08, -4.44]
  },
  AL: {
    name: 'Albania',
    emoji: '🇦🇱',
    bbox: [19.3, 39.62, 21.02, 42.69]
  },
  AE: {
    name: 'United Arab Emirates',
    emoji: '🇦🇪',
    bbox: [51.58, 22.5, 56.4, 26.06]
  },
  AR: {
    name: 'Argentina',
    emoji: '🇦🇷',
    bbox: [-73.42, -55.25, -53.63, -21.83]
  },
  AM: {
    name: 'Armenia',
    emoji: '🇦🇲',
    bbox: [43.58, 38.74, 46.51, 41.25]
  },
  AQ: {
    name: 'Antarctica',
    emoji: '🇦🇶',
    bbox: [-180.0, -90.0, 180.0, -63.27]
  },
  TF: {
    name: 'French Southern Territories',
    emoji: '🇹🇫',
    bbox: [68.72, -49.78, 70.56, -48.63]
  },
  AU: {
    name: 'Australia',
    emoji: '🇦🇺',
    bbox: [113.34, -43.63, 153.57, -10.67]
  },
  AT: {
    name: 'Austria',
    emoji: '🇦🇹',
    bbox: [9.48, 46.43, 16.98, 49.04]
  },
  AZ: {
    name: 'Azerbaijan',
    emoji: '🇦🇿',
    bbox: [44.79, 38.27, 50.39, 41.86]
  },
  BI: {
    name: 'Burundi',
    emoji: '🇧🇮',
    bbox: [29.02, -4.5, 30.75, -2.35]
  },
  BE: {
    name: 'Belgium',
    emoji: '🇧🇪',
    bbox: [2.51, 49.53, 6.16, 51.48]
  },
  BJ: {
    name: 'Benin',
    emoji: '🇧🇯',
    bbox: [0.77, 6.14, 3.8, 12.24]
  },
  BF: {
    name: 'Burkina Faso',
    emoji: '🇧🇫',
    bbox: [-5.47, 9.61, 2.18, 15.12]
  },
  BD: {
    name: 'Bangladesh',
    emoji: '🇧🇩',
    bbox: [88.08, 20.67, 92.67, 26.45]
  },
  BG: {
    name: 'Bulgaria',
    emoji: '🇧🇬',
    bbox: [22.38, 41.23, 28.56, 44.23]
  },
  BS: {
    name: 'Bahamas',
    emoji: '🇧🇸',
    bbox: [-78.98, 23.71, -77.0, 27.04]
  },
  BA: {
    name: 'Bosnia and Herzegovina',
    emoji: '🇧🇦',
    bbox: [15.75, 42.65, 19.6, 45.23]
  },
  BY: {
    name: 'Belarus',
    emoji: '🇧🇾',
    bbox: [23.2, 51.32, 32.69, 56.17]
  },
  BZ: {
    name: 'Belize',
    emoji: '🇧🇿',
    bbox: [-89.23, 15.89, -88.11, 18.5]
  },
  BO: {
    name: 'Bolivia',
    emoji: '🇧🇴',
    bbox: [-69.59, -22.87, -57.5, -9.76]
  },
  BR: {
    name: 'Brazil',
    emoji: '🇧🇷',
    bbox: [-73.99, -33.77, -34.73, 5.24]
  },
  BN: {
    name: 'Brunei',
    emoji: '🇧🇳',
    bbox: [114.2, 4.01, 115.45, 5.45]
  },
  BT: {
    name: 'Bhutan',
    emoji: '🇧🇹',
    bbox: [88.81, 26.72, 92.1, 28.3]
  },
  BW: {
    name: 'Botswana',
    emoji: '🇧🇼',
    bbox: [19.9, -26.83, 29.43, -17.66]
  },
  CF: {
    name: 'Central African Republic',
    emoji: '🇨🇫',
    bbox: [14.46, 2.27, 27.37, 11.14]
  },
  CA: {
    name: 'Canada',
    emoji: '🇨🇦',
    bbox: [-141.0, 41.68, -52.65, 73.23]
  },
  CH: {
    name: 'Switzerland',
    emoji: '🇨🇭',
    bbox: [6.02, 45.78, 10.44, 47.83]
  },
  CL: {
    name: 'Chile',
    emoji: '🇨🇱',
    bbox: [-75.64, -55.61, -66.96, -17.58]
  },
  CN: {
    name: 'China',
    emoji: '🇨🇳',
    bbox: [73.68, 18.2, 135.03, 53.46]
  },
  CI: {
    name: 'Ivory Coast',
    emoji: '🇨🇮',
    bbox: [-8.6, 4.34, -2.56, 10.52]
  },
  CM: {
    name: 'Cameroon',
    emoji: '🇨🇲',
    bbox: [8.49, 1.73, 16.01, 12.86]
  },
  CD: {
    name: 'Congo (Kinshasa)',
    emoji: '🇨🇩',
    bbox: [12.18, -13.26, 31.17, 5.26]
  },
  CG: {
    name: 'Congo (Brazzaville)',
    emoji: '🇨🇬',
    bbox: [11.09, -5.04, 18.45, 3.73]
  },
  CO: {
    name: 'Colombia',
    emoji: '🇨🇴',
    bbox: [-78.99, -4.3, -66.88, 12.44]
  },
  CR: {
    name: 'Costa Rica',
    emoji: '🇨🇷',
    bbox: [-85.94, 8.23, -82.55, 11.22]
  },
  CU: {
    name: 'Cuba',
    emoji: '🇨🇺',
    bbox: [-84.97, 19.86, -74.18, 23.19]
  },
  CY: {
    name: 'Cyprus',
    emoji: '🇨🇾',
    bbox: [32.26, 34.57, 34.0, 35.17]
  },
  CZ: {
    name: 'Czech Republic',
    emoji: '🇨🇿',
    bbox: [12.24, 48.56, 18.85, 51.12]
  },
  DE: {
    name: 'Germany',
    emoji: '🇩🇪',
    bbox: [5.99, 47.3, 15.02, 54.98]
  },
  DJ: {
    name: 'Djibouti',
    emoji: '🇩🇯',
    bbox: [41.66, 10.93, 43.32, 12.7]
  },
  DK: {
    name: 'Denmark',
    emoji: '🇩🇰',
    bbox: [8.09, 54.8, 12.69, 57.73]
  },
  DO: {
    name: 'Dominican Republic',
    emoji: '🇩🇴',
    bbox: [-71.95, 17.6, -68.32, 19.88]
  },
  DZ: {
    name: 'Algeria',
    emoji: '🇩🇿',
    bbox: [-8.68, 19.06, 12.0, 37.12]
  },
  EC: {
    name: 'Ecuador',
    emoji: '🇪🇨',
    bbox: [-80.97, -4.96, -75.23, 1.38]
  },
  EG: {
    name: 'Egypt',
    emoji: '🇪🇬',
    bbox: [24.7, 22.0, 36.87, 31.59]
  },
  ER: {
    name: 'Eritrea',
    emoji: '🇪🇷',
    bbox: [36.32, 12.46, 43.08, 18.0]
  },
  ES: {
    name: 'Spain',
    emoji: '🇪🇸',
    bbox: [-9.39, 35.95, 3.04, 43.75]
  },
  EE: {
    name: 'Estonia',
    emoji: '🇪🇪',
    bbox: [23.34, 57.47, 28.13, 59.61]
  },
  ET: {
    name: 'Ethiopia',
    emoji: '🇪🇹',
    bbox: [32.95, 3.42, 47.79, 14.96]
  },
  FI: {
    name: 'Finland',
    emoji: '🇫🇮',
    bbox: [20.65, 59.85, 31.52, 70.16]
  },
  FJ: {
    name: 'Fiji',
    emoji: '🇫🇯',
    bbox: [-180.0, -18.29, 180.0, -16.02]
  },
  FK: {
    name: 'Falkland Islands',
    emoji: '🇫🇰',
    bbox: [-61.2, -52.3, -57.75, -51.1]
  },
  FR: {
    name: 'France',
    emoji: '🇫🇷',
    bbox: [-5.0, 42.5, 9.56, 51.15]
  },
  GA: {
    name: 'Gabon',
    emoji: '🇬🇦',
    bbox: [8.8, -3.98, 14.43, 2.33]
  },
  GB: {
    name: 'United Kingdom',
    emoji: '🇬🇧',
    bbox: [-7.57, 49.96, 1.68, 58.64]
  },
  GE: {
    name: 'Georgia',
    emoji: '🇬🇪',
    bbox: [39.96, 41.06, 46.64, 43.55]
  },
  GH: {
    name: 'Ghana',
    emoji: '🇬🇭',
    bbox: [-3.24, 4.71, 1.06, 11.1]
  },
  GN: {
    name: 'Guinea',
    emoji: '🇬🇳',
    bbox: [-15.13, 7.31, -7.83, 12.59]
  },
  GM: {
    name: 'Gambia',
    emoji: '🇬🇲',
    bbox: [-16.84, 13.13, -13.84, 13.88]
  },
  GW: {
    name: 'Guinea Bissau',
    emoji: '🇬🇼',
    bbox: [-16.68, 11.04, -13.7, 12.63]
  },
  GQ: {
    name: 'Equatorial Guinea',
    emoji: '🇬🇶',
    bbox: [9.31, 1.01, 11.29, 2.28]
  },
  GR: {
    name: 'Greece',
    emoji: '🇬🇷',
    bbox: [20.15, 34.92, 26.6, 41.83]
  },
  GL: {
    name: 'Greenland',
    emoji: '🇬🇱',
    bbox: [-73.3, 60.04, -12.21, 83.65]
  },
  GT: {
    name: 'Guatemala',
    emoji: '🇬🇹',
    bbox: [-92.23, 13.74, -88.23, 17.82]
  },
  GY: {
    name: 'Guyana',
    emoji: '🇬🇾',
    bbox: [-61.41, 1.27, -56.54, 8.37]
  },
  HN: {
    name: 'Honduras',
    emoji: '🇭🇳',
    bbox: [-89.35, 12.98, -83.15, 16.01]
  },
  HR: {
    name: 'Croatia',
    emoji: '🇭🇷',
    bbox: [13.66, 42.48, 19.39, 46.5]
  },
  HT: {
    name: 'Haiti',
    emoji: '🇭🇹',
    bbox: [-74.46, 18.03, -71.62, 19.92]
  },
  HU: {
    name: 'Hungary',
    emoji: '🇭🇺',
    bbox: [16.2, 45.76, 22.71, 48.62]
  },
  ID: {
    name: 'Indonesia',
    emoji: '🇮🇩',
    bbox: [95.29, -10.36, 141.03, 5.48]
  },
  IN: {
    name: 'India',
    emoji: '🇮🇳',
    bbox: [68.18, 7.97, 97.4, 35.49]
  },
  IE: {
    name: 'Ireland',
    emoji: '🇮🇪',
    bbox: [-9.98, 51.67, -6.03, 55.13]
  },
  IR: {
    name: 'Iran',
    emoji: '🇮🇷',
    bbox: [44.11, 25.08, 63.32, 39.71]
  },
  IQ: {
    name: 'Iraq',
    emoji: '🇮🇶',
    bbox: [38.79, 29.1, 48.57, 37.39]
  },
  IS: {
    name: 'Iceland',
    emoji: '🇮🇸',
    bbox: [-24.33, 63.5, -13.61, 66.53]
  },
  IL: {
    name: 'Israel',
    emoji: '🇮🇱',
    bbox: [34.27, 29.5, 35.84, 33.28]
  },
  IT: {
    name: 'Italy',
    emoji: '🇮🇹',
    bbox: [6.75, 36.62, 18.48, 47.12]
  },
  JM: {
    name: 'Jamaica',
    emoji: '🇯🇲',
    bbox: [-78.34, 17.7, -76.2, 18.52]
  },
  JO: {
    name: 'Jordan',
    emoji: '🇯🇴',
    bbox: [34.92, 29.2, 39.2, 33.38]
  },
  JP: {
    name: 'Japan',
    emoji: '🇯🇵',
    bbox: [129.41, 31.03, 145.54, 45.55]
  },
  KZ: {
    name: 'Kazakhstan',
    emoji: '🇰🇿',
    bbox: [46.47, 40.66, 87.36, 55.39]
  },
  KE: {
    name: 'Kenya',
    emoji: '🇰🇪',
    bbox: [33.89, -4.68, 41.86, 5.51]
  },
  KG: {
    name: 'Kyrgyzstan',
    emoji: '🇰🇬',
    bbox: [69.46, 39.28, 80.26, 43.3]
  },
  KH: {
    name: 'Cambodia',
    emoji: '🇰🇭',
    bbox: [102.35, 10.49, 107.61, 14.57]
  },
  KR: {
    name: 'South Korea',
    emoji: '🇰🇷',
    bbox: [126.12, 34.39, 129.47, 38.61]
  },
  KW: {
    name: 'Kuwait',
    emoji: '🇰🇼',
    bbox: [46.57, 28.53, 48.42, 30.06]
  },
  LA: {
    name: 'Laos',
    emoji: '🇱🇦',
    bbox: [100.12, 13.88, 107.56, 22.46]
  },
  LB: {
    name: 'Lebanon',
    emoji: '🇱🇧',
    bbox: [35.13, 33.09, 36.61, 34.64]
  },
  LR: {
    name: 'Liberia',
    emoji: '🇱🇷',
    bbox: [-11.44, 4.36, -7.54, 8.54]
  },
  LY: {
    name: 'Libya',
    emoji: '🇱🇾',
    bbox: [9.32, 19.58, 25.16, 33.14]
  },
  LK: {
    name: 'Sri Lanka',
    emoji: '🇱🇰',
    bbox: [79.7, 5.97, 81.79, 9.82]
  },
  LS: {
    name: 'Lesotho',
    emoji: '🇱🇸',
    bbox: [27.0, -30.65, 29.33, -28.65]
  },
  LT: {
    name: 'Lithuania',
    emoji: '🇱🇹',
    bbox: [21.06, 53.91, 26.59, 56.37]
  },
  LU: {
    name: 'Luxembourg',
    emoji: '🇱🇺',
    bbox: [5.67, 49.44, 6.24, 50.13]
  },
  LV: {
    name: 'Latvia',
    emoji: '🇱🇻',
    bbox: [21.06, 55.62, 28.18, 57.97]
  },
  MA: {
    name: 'Morocco',
    emoji: '🇲🇦',
    bbox: [-17.02, 21.42, -1.12, 35.76]
  },
  MD: {
    name: 'Moldova',
    emoji: '🇲🇩',
    bbox: [26.62, 45.49, 30.02, 48.47]
  },
  MG: {
    name: 'Madagascar',
    emoji: '🇲🇬',
    bbox: [43.25, -25.6, 50.48, -12.04]
  },
  MX: {
    name: 'Mexico',
    emoji: '🇲🇽',
    bbox: [-117.13, 14.54, -86.81, 32.72]
  },
  MK: {
    name: 'Macedonia',
    emoji: '🇲🇰',
    bbox: [20.46, 40.84, 22.95, 42.32]
  },
  ML: {
    name: 'Mali',
    emoji: '🇲🇱',
    bbox: [-12.17, 10.1, 4.27, 24.97]
  },
  MM: {
    name: 'Myanmar',
    emoji: '🇲🇲',
    bbox: [92.3, 9.93, 101.18, 28.34]
  },
  ME: {
    name: 'Montenegro',
    emoji: '🇲🇪',
    bbox: [18.45, 41.88, 20.34, 43.52]
  },
  MN: {
    name: 'Mongolia',
    emoji: '🇲🇳',
    bbox: [87.75, 41.6, 119.77, 52.05]
  },
  MZ: {
    name: 'Mozambique',
    emoji: '🇲🇿',
    bbox: [30.18, -26.74, 40.78, -10.32]
  },
  MR: {
    name: 'Mauritania',
    emoji: '🇲🇷',
    bbox: [-17.06, 14.62, -4.92, 27.4]
  },
  MW: {
    name: 'Malawi',
    emoji: '🇲🇼',
    bbox: [32.69, -16.8, 35.77, -9.23]
  },
  MY: {
    name: 'Malaysia',
    emoji: '🇲🇾',
    bbox: [100.09, 0.77, 119.18, 6.93]
  },
  NA: {
    name: 'Namibia',
    emoji: '🇳🇦',
    bbox: [11.73, -29.05, 25.08, -16.94]
  },
  NC: {
    name: 'New Caledonia',
    emoji: '🇳🇨',
    bbox: [164.03, -22.4, 167.12, -20.11]
  },
  NE: {
    name: 'Niger',
    emoji: '🇳🇪',
    bbox: [0.3, 11.66, 15.9, 23.47]
  },
  NG: {
    name: 'Nigeria',
    emoji: '🇳🇬',
    bbox: [2.69, 4.24, 14.58, 13.87]
  },
  NI: {
    name: 'Nicaragua',
    emoji: '🇳🇮',
    bbox: [-87.67, 10.73, -83.15, 15.02]
  },
  NL: {
    name: 'Netherlands',
    emoji: '🇳🇱',
    bbox: [3.31, 50.8, 7.09, 53.51]
  },
  NO: {
    name: 'Norway',
    emoji: '🇳🇴',
    bbox: [4.99, 58.08, 31.29, 70.92]
  },
  NP: {
    name: 'Nepal',
    emoji: '🇳🇵',
    bbox: [80.09, 26.4, 88.17, 30.42]
  },
  NZ: {
    name: 'New Zealand',
    emoji: '🇳🇿',
    bbox: [166.51, -46.64, 178.52, -34.45]
  },
  OM: {
    name: 'Oman',
    emoji: '🇴🇲',
    bbox: [52.0, 16.65, 59.81, 26.4]
  },
  PK: {
    name: 'Pakistan',
    emoji: '🇵🇰',
    bbox: [60.87, 23.69, 77.84, 37.13]
  },
  PA: {
    name: 'Panama',
    emoji: '🇵🇦',
    bbox: [-82.97, 7.22, -77.24, 9.61]
  },
  PE: {
    name: 'Peru',
    emoji: '🇵🇪',
    bbox: [-81.41, -18.35, -68.67, -0.06]
  },
  PH: {
    name: 'Philippines',
    emoji: '🇵🇭',
    bbox: [117.17, 5.58, 126.54, 18.51]
  },
  PG: {
    name: 'Papua New Guinea',
    emoji: '🇵🇬',
    bbox: [141.0, -10.65, 156.02, -2.5]
  },
  PL: {
    name: 'Poland',
    emoji: '🇵🇱',
    bbox: [14.07, 49.03, 24.03, 54.85]
  },
  PR: {
    name: 'Puerto Rico',
    emoji: '🇵🇷',
    bbox: [-67.24, 17.95, -65.59, 18.52]
  },
  KP: {
    name: 'North Korea',
    emoji: '🇰🇵',
    bbox: [124.27, 37.67, 130.78, 42.99]
  },
  PT: {
    name: 'Portugal',
    emoji: '🇵🇹',
    bbox: [-9.53, 36.84, -6.39, 42.28]
  },
  PY: {
    name: 'Paraguay',
    emoji: '🇵🇾',
    bbox: [-62.69, -27.55, -54.29, -19.34]
  },
  QA: {
    name: 'Qatar',
    emoji: '🇶🇦',
    bbox: [50.74, 24.56, 51.61, 26.11]
  },
  RO: {
    name: 'Romania',
    emoji: '🇷🇴',
    bbox: [20.22, 43.69, 29.63, 48.22]
  },
  RU: {
    name: 'Russia',
    emoji: '🇷🇺',
    bbox: [-180.0, 41.15, 180.0, 81.25]
  },
  RW: {
    name: 'Rwanda',
    emoji: '🇷🇼',
    bbox: [29.02, -2.92, 30.82, -1.13]
  },
  SA: {
    name: 'Saudi Arabia',
    emoji: '🇸🇦',
    bbox: [34.63, 16.35, 55.67, 32.16]
  },
  SD: {
    name: 'Sudan',
    emoji: '🇸🇩',
    bbox: [21.94, 8.62, 38.41, 22.0]
  },
  SS: {
    name: 'South Sudan',
    emoji: '🇸🇸',
    bbox: [23.89, 3.51, 35.3, 12.25]
  },
  SN: {
    name: 'Senegal',
    emoji: '🇸🇳',
    bbox: [-17.63, 12.33, -11.47, 16.6]
  },
  SB: {
    name: 'Solomon Islands',
    emoji: '🇸🇧',
    bbox: [156.49, -10.83, 162.4, -6.6]
  },
  SL: {
    name: 'Sierra Leone',
    emoji: '🇸🇱',
    bbox: [-13.25, 6.79, -10.23, 10.05]
  },
  SV: {
    name: 'El Salvador',
    emoji: '🇸🇻',
    bbox: [-90.1, 13.15, -87.72, 14.42]
  },
  SO: {
    name: 'Somalia',
    emoji: '🇸🇴',
    bbox: [40.98, -1.68, 51.13, 12.02]
  },
  RS: {
    name: 'Serbia',
    emoji: '🇷🇸',
    bbox: [18.83, 42.25, 22.99, 46.17]
  },
  SR: {
    name: 'Suriname',
    emoji: '🇸🇷',
    bbox: [-58.04, 1.82, -53.96, 6.03]
  },
  SK: {
    name: 'Slovakia',
    emoji: '🇸🇰',
    bbox: [16.88, 47.76, 22.56, 49.57]
  },
  SI: {
    name: 'Slovenia',
    emoji: '🇸🇮',
    bbox: [13.7, 45.45, 16.56, 46.85]
  },
  SE: {
    name: 'Sweden',
    emoji: '🇸🇪',
    bbox: [11.03, 55.36, 23.9, 69.11]
  },
  SZ: {
    name: 'Swaziland',
    emoji: '🇸🇿',
    bbox: [30.68, -27.29, 32.07, -25.66]
  },
  SY: {
    name: 'Syria',
    emoji: '🇸🇾',
    bbox: [35.7, 32.31, 42.35, 37.23]
  },
  TD: {
    name: 'Chad',
    emoji: '🇹🇩',
    bbox: [13.54, 7.42, 23.89, 23.41]
  },
  TG: {
    name: 'Togo',
    emoji: '🇹🇬',
    bbox: [-0.05, 5.93, 1.87, 11.02]
  },
  TH: {
    name: 'Thailand',
    emoji: '🇹🇭',
    bbox: [97.38, 5.69, 105.59, 20.42]
  },
  TJ: {
    name: 'Tajikistan',
    emoji: '🇹🇯',
    bbox: [67.44, 36.74, 74.98, 40.96]
  },
  TM: {
    name: 'Turkmenistan',
    emoji: '🇹🇲',
    bbox: [52.5, 35.27, 66.55, 42.75]
  },
  TL: {
    name: 'East Timor',
    emoji: '🇹🇱',
    bbox: [124.97, -9.39, 127.34, -8.27]
  },
  TT: {
    name: 'Trinidad and Tobago',
    emoji: '🇹🇹',
    bbox: [-61.95, 10.0, -60.9, 10.89]
  },
  TN: {
    name: 'Tunisia',
    emoji: '🇹🇳',
    bbox: [7.52, 30.31, 11.49, 37.35]
  },
  TR: {
    name: 'Turkey',
    emoji: '🇹🇷',
    bbox: [26.04, 35.82, 44.79, 42.14]
  },
  TW: {
    name: 'Taiwan',
    emoji: '🇹🇼',
    bbox: [120.11, 21.97, 121.95, 25.3]
  },
  TZ: {
    name: 'Tanzania',
    emoji: '🇹🇿',
    bbox: [29.34, -11.72, 40.32, -0.95]
  },
  UG: {
    name: 'Uganda',
    emoji: '🇺🇬',
    bbox: [29.58, -1.44, 35.04, 4.25]
  },
  UA: {
    name: 'Ukraine',
    emoji: '🇺🇦',
    bbox: [22.09, 44.36, 40.08, 52.34]
  },
  UY: {
    name: 'Uruguay',
    emoji: '🇺🇾',
    bbox: [-58.43, -34.95, -53.21, -30.11]
  },
  US: {
    name: 'United States',
    emoji: '🇺🇸',
    bbox: [-125.0, 25.0, -66.96, 49.5]
  },
  UZ: {
    name: 'Uzbekistan',
    emoji: '🇺🇿',
    bbox: [55.93, 37.14, 73.06, 45.59]
  },
  VE: {
    name: 'Venezuela',
    emoji: '🇻🇪',
    bbox: [-73.3, 0.72, -59.76, 12.16]
  },
  VN: {
    name: 'Vietnam',
    emoji: '🇻🇳',
    bbox: [102.17, 8.6, 109.34, 23.35]
  },
  VU: {
    name: 'Vanuatu',
    emoji: '🇻🇺',
    bbox: [166.63, -16.6, 167.84, -14.63]
  },
  PS: {
    name: 'West Bank',
    emoji: '🇵🇸',
    bbox: [34.93, 31.35, 35.55, 32.53]
  },
  YE: {
    name: 'Yemen',
    emoji: '🇾🇪',
    bbox: [42.6, 12.59, 53.11, 19.0]
  },
  ZA: {
    name: 'South Africa',
    emoji: '🇿🇦',
    bbox: [16.34, -34.82, 32.83, -22.09]
  },
  ZM: {
    name: 'Zambia',
    emoji: '🇿🇲',
    bbox: [21.89, -17.96, 33.49, -8.24]
  },
  ZW: {
    name: 'Zimbabwe',
    emoji: '🇿🇼',
    bbox: [25.26, -22.27, 32.85, -15.51]
  }
};
