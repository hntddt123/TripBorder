import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';
import { createByTripQuery } from '../utility/RTKQueryFactory';

export const transportsAPI = createApi({
  reducerPath: 'transportsAPI',
  tagTypes: ['Transports'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/transports`,
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
    )
  })
});

// Export hooks for usage in components
export const {
  useGetTransportsAllQuery,
  useGetTransportByTripIDQuery
} = transportsAPI;
