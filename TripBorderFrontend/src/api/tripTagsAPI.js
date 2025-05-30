import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const tripTagsAPI = createApi({
  reducerPath: 'tripTagsAPI',
  tagTypes: ['Triptags'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/trip_tags`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getTripTagsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Triptags'],
    }),
  })
});

// Export hooks for usage in components
export const {
  useGetTripTagsAllQuery,
} = tripTagsAPI;
