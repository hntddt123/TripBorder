import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { openstreetmapBaseUrl } from '../constants/constants';

/*
  Nominatim API for global keyword-to-coords search.
  Endpoint: /search?q=keyword&format=json&limit=1
*/
export const openstreetmapAPI = createApi({
  reducerPath: 'openstreetmapApi',
  baseQuery: fetchBaseQuery({
    baseUrl: openstreetmapBaseUrl,
  }),
  endpoints: (builder) => ({
    getLandmarkFromKeyword: builder.query({
      // Encodes keyword (prevents URI errors/injection), limit=1 for top result only.
      query: (keyword) => `/search?q=${encodeURIComponent(keyword)}&format=json&limit=1`,
      transformResponse: (response) => {
        if (!response.length) return null;
        const result = response[0]; // First item; why: Highest global relevance rank.
        return {
          name: result.display_name, // Landmark/address; example value: "Tokyo Skytree, 1-1-2, Oshiage, Sumida, Tokyo, 131-0045, Japan".
          lat: parseFloat(result.lat), // Latitude; example value: 35.7100627 (float from string "35.7100627").
          lon: parseFloat(result.lon), // Longitude; example value: 139.8107004 (float from string "139.8107004").
        };
      },
    }),
  }),
});

export const {
  useLazyGetLandmarkFromKeywordQuery
} = openstreetmapAPI;
