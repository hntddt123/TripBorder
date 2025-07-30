import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';
import { createByTripQuery } from '../utility/RTKQueryFactory';

export const tripTagsAPI = createApi({
  reducerPath: 'tripTagsAPI',
  tagTypes: ['Triptags'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.tripTags,
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
    getTripTagsByTripID: createByTripQuery(
      builder,
      {
        url: '/triptagsbytripid',
        tagName: 'TripTags'
      }
    ),
    postTripTagsByTripIDAndTagID: builder.mutation({
      query: (newTripTag) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newTripTag },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['TripTags'],
    }),
    deleteTripTags: builder.mutation({
      query: (TripTagID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: TripTagID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['TripTags'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetTripTagsAllQuery,
  useGetTripTagsByTripIDQuery,
  usePostTripTagsByTripIDAndTagIDMutation,
  useDeleteTripTagsMutation
} = tripTagsAPI;
