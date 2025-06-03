import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const hotelsAPI = createApi({
  reducerPath: 'hotelsAPI',
  tagTypes: ['Hotels'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/hotels`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    gethotelsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Hotels'],
    }),
  })
});

// Export hooks for usage in components
export const {
  useGethotelsAllQuery,
} = hotelsAPI;
