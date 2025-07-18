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
    ),
    postRatingByTripID: builder.mutation({
      query: (newRating) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newRating },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Ratings'],
    }),
    deleteRating: builder.mutation({
      query: (ratingID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: ratingID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Ratings'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetRatingsAllQuery,
  useGetRatingsByTripIDQuery,
  usePostRatingByTripIDMutation,
  useDeleteRatingMutation
} = ratingsAPI;
