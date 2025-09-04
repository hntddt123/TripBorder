import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { openstreetmapBaseUrl, OPENSTREETMAP_API_QUERIES } from '../constants/apiConstants';

/*
  Nominatim API for global keyword-to-coords search.
  Endpoint: /search?q=keyword&format=json&limit=1
*/
export const openstreetmapAPI = createApi({
  reducerPath: 'openstreetmapApi',
  baseQuery: fetchBaseQuery({
    baseUrl: openstreetmapBaseUrl,
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getLandmarkFromKeyword: builder.query({
      // Encodes keyword (prevents URI errors/injection), limit=1 for top result (extratags=1, addressdetails=1 for details).
      query: OPENSTREETMAP_API_QUERIES.getLandmarkFromKeywordQuery,
      keepUnusedDataFor: 900,
      providesTags: ['OpenStreetMapPOIs']
    }),
    getLandmarksFromPin: builder.query({
      query: OPENSTREETMAP_API_QUERIES.getLandmarkFromPinQuery,
      keepUnusedDataFor: 900,
      providesTags: ['OpenStreetMapPOIs']
    }),
  }),
});

export const {
  useLazyGetLandmarkFromKeywordQuery,
  useLazyGetLandmarksFromPinQuery
} = openstreetmapAPI;
