import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';
import { createByEmailPaginationQuery } from '../utility/RTKQueryFactory';

export const tripsAPI = createApi({
  reducerPath: 'tripsAPI',
  tagTypes: ['Trips'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/trips`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getTripsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Trips'],
    }),
    getTripByUUID: builder.query({
      query: () => ({
        url: '/tripsbyuuid',
        method: 'GET'
      }),
      providesTags: ['Trips'],
    }),
    getTripsByEmail: createByEmailPaginationQuery(
      builder,
      {
        url: '/tripsbyemail',
        tagName: 'Trips'
      }
    )
  })
});

// Export hooks for usage in components
export const {
  useGetTripsAllQuery,
  useGetTripsByEmailQuery
} = tripsAPI;
