function formatDateNowUTC() {
  const now = new Date(Date.now());
  return now.toISOString().slice(0, 19).replace('T', ' '); // "2025-04-25 12:34:56"
}

export const TestBaseUrl = 'https://localhost:5173';

export const TestMileages = [
  {
    uuid: '1',
    frequent_flyer_number: 'TB123456789',
    airline: 'Tripborder Air',
    mileage_price: '100.00',
    mileage_amount: '2000.0',
    mileage_picture: { data: [1, 2, 3] }, // Malformated test
    mileage_unit: 'km',
    mileage_expired_at: '9999-12-31 23:59:59',
    is_verified: true,
    is_listed: true,
    created_at: formatDateNowUTC(),
    updated_at: formatDateNowUTC(),
    owner_email: 'test@tripborder.com'
  },
  {
    uuid: '2',
    frequent_flyer_number: 'TB987654321',
    airline: 'Tripborder Air',
    mileage_price: '200.99',
    mileage_amount: '4000.0',
    mileage_picture: { // Should be data:image/png;base64
      data: [
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
        0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196,
        137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 218, 191, 248,
        255, 159, 33, 14, 0, 7, 226, 2, 127, 223, 0, 0, 0, 0,
        73, 69, 78, 68, 174, 66, 96, 130
      ]
    },
    mileage_unit: 'miles',
    mileage_expired_at: '2030-12-31',
    is_verified: true,
    is_listed: true,
    created_at: formatDateNowUTC(),
    updated_at: formatDateNowUTC(),
    owner_email: 'test@tripborder.com'
  },
  {
    uuid: '3',
    frequent_flyer_number: 'TB987654321',
    airline: 'Tripborder Air',
    mileage_price: '200.99',
    mileage_amount: '30000.0',
    mileage_picture: { // Should be data:image/png;base64
      data: [
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
        0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196,
        137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 218, 191, 248,
        255, 159, 33, 14, 0, 7, 226, 2, 127, 223, 0, 0, 0, 0,
        73, 69, 78, 68, 174, 66, 96, 130
      ]
    },
    mileage_unit: 'miles',
    mileage_expired_at: '2030-12-31',
    is_verified: false,
    is_listed: true,
    created_at: formatDateNowUTC(),
    updated_at: formatDateNowUTC(),
    owner_email: 'test@tripborder.com'
  },
  {
    uuid: '4',
    frequent_flyer_number: 'TB987654321',
    airline: 'Tripborder Air',
    mileage_price: '100.99',
    mileage_amount: '70000.0',
    mileage_picture: { // Should be data:image/png;base64
      data: [
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
        0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196,
        137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 218, 191, 248,
        255, 159, 33, 14, 0, 7, 226, 2, 127, 223, 0, 0, 0, 0,
        73, 69, 78, 68, 174, 66, 96, 130
      ]
    },
    mileage_unit: 'miles',
    mileage_expired_at: '2030-12-31',
    is_verified: true,
    is_listed: false,
    created_at: formatDateNowUTC(),
    updated_at: formatDateNowUTC(),
    owner_email: 'test@tripborder.com'
  }
];

export const TestMileagesPage1 = [
  {
    uuid: '1',
    airline: 'Delta',
    is_verified: true,
    is_listed: true,
    mileage_price: 2025,
    mileage_amount: 10000,
    mileage_unit: 'miles',
    mileage_picture: { data: [1, 2, 3] },
  },
  {
    uuid: '2',
    airline: 'American',
    is_verified: true,
    is_listed: true,
    mileage_price: 1800,
    mileage_amount: 12000,
    mileage_unit: 'miles',
    mileage_picture: { data: [7, 8, 9] },
  },
  {
    uuid: '3',
    airline: 'United',
    is_verified: true,
    is_listed: true,
    mileage_price: 150,
    mileage_amount: 15000,
    mileage_unit: 'miles',
    mileage_picture: { data: [4, 5, 6] },
  },
  {
    uuid: '4',
    airline: 'Southwest',
    is_verified: true,
    is_listed: true,
    mileage_price: 1200,
    mileage_amount: 8000,
    mileage_unit: 'miles',
    mileage_picture: { data: [10, 11, 12] },
  },
  {
    uuid: '5',
    airline: 'JetBlue',
    is_verified: true,
    is_listed: true,
    mileage_price: 1000,
    mileage_amount: 9000,
    mileage_unit: 'miles',
    mileage_picture: { data: [13, 14, 15] },
  },
  {
    uuid: '6',
    airline: 'Alaska',
    is_verified: true,
    is_listed: true,
    mileage_price: 1100,
    mileage_amount: 11000,
    mileage_unit: 'miles',
    mileage_picture: { data: [16, 17, 18] },
  },
  {
    uuid: '7',
    airline: 'Frontier',
    is_verified: true,
    is_listed: true,
    mileage_price: 900,
    mileage_amount: 7000,
    mileage_unit: 'miles',
    mileage_picture: { data: [19, 20, 21] },
  },
  {
    uuid: '8',
    airline: 'Spirit',
    is_verified: true,
    is_listed: true,
    mileage_price: 800,
    mileage_amount: 6000,
    mileage_unit: 'miles',
    mileage_picture: { data: [22, 23, 24] },
  },
  {
    uuid: '9',
    airline: 'Allegiant',
    is_verified: true,
    is_listed: true,
    mileage_price: 700,
    mileage_amount: 5000,
    mileage_unit: 'miles',
    mileage_picture: { data: [25, 26, 27] },
  },
  {
    uuid: '10',
    airline: 'Hawaiian',
    is_verified: true,
    is_listed: true,
    mileage_price: 600,
    mileage_amount: 4000,
    mileage_unit: 'miles',
    mileage_picture: { data: [28, 29, 30] },
  },
];

export const TestMileagesPage2 = [
  {
    uuid: '11',
    airline: 'Lufthansa',
    is_verified: true,
    is_listed: true,
    mileage_price: 500,
    mileage_amount: 3000,
    mileage_unit: 'miles',
    mileage_picture: { data: [31, 32, 33] },
  },
  {
    uuid: '12',
    airline: 'Air Canada',
    is_verified: true,
    is_listed: true,
    mileage_price: 400,
    mileage_amount: 2000,
    mileage_unit: 'miles',
    mileage_picture: { data: [34, 35, 36] },
  },
  {
    uuid: '13',
    airline: 'British Airways',
    is_verified: true,
    is_listed: true,
    mileage_price: 300,
    mileage_amount: 1500,
    mileage_unit: 'miles',
    mileage_picture: { data: [37, 38, 39] },
  },
  {
    uuid: '14',
    airline: 'Emirates',
    is_verified: true,
    is_listed: true,
    mileage_price: 2099,
    mileage_amount: 1000,
    mileage_unit: 'miles',
    mileage_picture: { data: [40, 41, 42] },
  },
  {
    uuid: '15',
    airline: 'Qantas',
    is_verified: true,
    is_listed: true,
    mileage_price: 100,
    mileage_amount: 500,
    mileage_unit: 'miles',
    mileage_picture: { data: [43, 44, 45] },
  },
  {
    uuid: '16',
    airline: 'Singapore Airlines',
    is_verified: true,
    is_listed: true,
    mileage_price: 50,
    mileage_amount: 250,
    mileage_unit: 'miles',
    mileage_picture: { data: [46, 47, 48] },
  },
  {
    uuid: '17',
    airline: 'Cathay Pacific',
    is_verified: true,
    is_listed: true,
    mileage_price: 75,
    mileage_amount: 375,
    mileage_unit: 'miles',
    mileage_picture: { data: [49, 50, 51] },
  },
  {
    uuid: '18',
    airline: 'Turkish Airlines',
    is_verified: true,
    is_listed: true,
    mileage_price: 125,
    mileage_amount: 625,
    mileage_unit: 'miles',
    mileage_picture: { data: [52, 53, 54] },
  },
  {
    uuid: '19',
    airline: 'Air France',
    is_verified: true,
    is_listed: true,
    mileage_price: 175,
    mileage_amount: 875,
    mileage_unit: 'miles',
    mileage_picture: { data: [55, 56, 57] },
  },
  {
    uuid: '20',
    airline: 'KLM',
    is_verified: true,
    is_listed: true,
    mileage_price: 225,
    mileage_amount: 1125,
    mileage_unit: 'miles',
    mileage_picture: { data: [58, 59, 60] },
  },
];

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
