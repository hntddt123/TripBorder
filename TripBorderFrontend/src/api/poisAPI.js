import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';
import { createByTripQuery } from '../utility/RTKQueryFactory';

export const poisAPI = createApi({
  reducerPath: 'poisAPI',
  tagTypes: ['POIs'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/pois`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getPOIsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['POIs'],
    }),
    getPOIsByTripID: createByTripQuery(
      builder,
      {
        url: '/poisbytrip',
        tagName: 'POIs'
      }
    ),
    postPOIByTripID: builder.mutation({
      query: (newPOI) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newPOI },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['POIs'],
    }),
    deletePOI: builder.mutation({
      query: (poiID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: poiID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['POIs'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetPOIsAllQuery,
  useGetPOIsByTripIDQuery,
  usePostPOIByTripIDMutation,
  useDeletePOIMutation
} = poisAPI;
