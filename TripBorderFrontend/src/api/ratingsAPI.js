import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';
import { createByTripQuery } from '../utility/RTKQueryFactory';

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
    getRatingsByTripID: createByTripQuery(
      builder,
      {
        url: '/ratingsbytrip',
        tagName: 'Ratings'
      }
    )
  })
});

// Export hooks for usage in components
export const {
  useGetRatingsAllQuery,
  useGetRatingsByTripIDQuery
} = ratingsAPI;
