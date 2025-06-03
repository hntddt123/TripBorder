import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const tripsAPI = createApi({
  reducerPath: 'tripsAPI',
  tagTypes: ['Trips'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/trips`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getTripsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Trips'],
    }),
  })
});

// Export hooks for usage in components
export const {
  useGetTripsAllQuery,
} = tripsAPI;
