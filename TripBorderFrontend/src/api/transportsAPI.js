import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/api';
import { createByTripQuery } from '../utility/RTKQueryFactory';

export const transportsAPI = createApi({
  reducerPath: 'transportsAPI',
  tagTypes: ['Transports'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.transports,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getTransportsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Transports'],
    }),
    getTransportByTripID: createByTripQuery(
      builder,
      {
        url: '/transportsbytrip',
        tagName: 'Transports'
      }
    ),
    postTransportByTripID: builder.mutation({
      query: (newTransport) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newTransport },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Transports'],
    }),
    deleteTransport: builder.mutation({
      query: (transportID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: transportID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Transports'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetTransportsAllQuery,
  useGetTransportByTripIDQuery,
  usePostTransportByTripIDMutation,
  useDeleteTransportMutation
} = transportsAPI;
