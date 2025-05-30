import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const ratingsAPI = createApi({
  reducerPath: 'ratingsAPI',
  tagTypes: ['Ratings'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/ratings`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getRatingsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Ratings'],
    }),
  })
});

// Export hooks for usage in components
export const {
  useGetRatingsAllQuery,
} = ratingsAPI;
