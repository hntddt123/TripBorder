// Constants or part is for testing values
const getEnv = () => ({
  MODE: import.meta.env.VITE_MODE || 'development',
  MAPBOX_API_KEY: import.meta.env.VITE_MAPBOX_API_KEY || 'mockMAPBOXKey',
  FOURSQUARE_API_KEY: import.meta.env.VITE_FOURSQUARE_API_KEY || 'mockFOURSQUAREKey',
  VERSION_NUMBER: import.meta.env.VITE_VERSION_NUMBER || '2.0.0',
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

// function formatDateNowUTC() {
//   const now = new Date(Date.now());
//   return now.toISOString().slice(0, 19).replace('T', ' '); // "2025-04-25 12:34:56"
// }

// export const TestMileages = [
//   {
//     uuid: '1',
//     frequent_flyer_number: 'TB123456789',
//     airline: 'Tripborder Air',
//     mileage_price: '100.00',
//     mileage_amount: '2000.0',
//     mileage_picture: '1',
//     mileage_unit: 'km',
//     mileage_expired_at: '9999-12-31 23:59:59',
//     is_verified: true,
//     is_listed: true,
//     created_at: formatDateNowUTC(),
//     updated_at: formatDateNowUTC(),
//     owner_email: 'test@tripborder.com'
//   },
//   {
//     uuid: '2',
//     frequent_flyer_number: 'TB987654321',
//     airline: 'Tripborder Air',
//     mileage_price: '200.99',
//     mileage_amount: '4000.0',
//     mileage_picture: '1',
//     mileage_unit: 'miles',
//     mileage_expired_at: '2030-12-31',
//     is_verified: true,
//     is_listed: true,
//     created_at: formatDateNowUTC(),
//     updated_at: formatDateNowUTC(),
//     owner_email: 'test@tripborder.com'
//   },
// ];

// Test coordinaties
export const LineStringTestCoordinates = [
  [
    121.429473,
    25.159462
  ],
  [
    121.429545,
    25.16001
  ],
  [
    121.429635,
    25.160715
  ],
  [
    121.429689,
    25.160707
  ],
  [
    121.429694,
    25.160752
  ],
  [
    121.429712,
    25.16084
  ],
  [
    121.429951,
    25.160793
  ],
  [
    121.430073,
    25.160807
  ],
  [
    121.430123,
    25.160942
  ],
  [
    121.430194,
    25.161034
  ],
  [
    121.430278,
    25.161081
  ],
  [
    121.430399,
    25.16112
  ],
  [
    121.430528,
    25.161114
  ],
  [
    121.430535,
    25.161145
  ],
  [
    121.430552,
    25.161178
  ],
  [
    121.430766,
    25.161114
  ],
  [
    121.431364,
    25.160931
  ]];
