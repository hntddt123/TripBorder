import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';
import { createByTripQuery } from '../utility/RTKQueryFactory';

export const tripSharesAPI = createApi({
  reducerPath: 'tripSharesAPI',
  tagTypes: ['TripShares'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.tripShares,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getTripSharesAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['TripShares'],
    }),
    getTripSharesByTripID: createByTripQuery(
      builder,
      {
        url: '/tripsharesbytrip',
        tagName: 'TripShares'
      }
    ),
    postTripShareByTripID: builder.mutation({
      query: (newTripShare) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newTripShare },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['TripShares'],
    }),
    updateTripShareByUUID: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/update/${uuid}`,
        method: 'PATCH',
        body: { data: updates },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['TripShares'],
    }),
    deleteTripShare: builder.mutation({
      query: (tripShareID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: tripShareID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['TripShares'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetTripSharesAllQuery,
  useGetTripSharesByTripIDQuery,
  useLazyGetTripSharesByTripIDQuery,
  usePostTripShareByTripIDMutation,
  useUpdateTripShareByUUIDMutation,
  useDeleteTripShareMutation
} = tripSharesAPI;
