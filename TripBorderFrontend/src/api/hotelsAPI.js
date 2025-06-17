import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';
import { createByTripQuery } from '../utility/RTKQueryFactory';

export const hotelsAPI = createApi({
  reducerPath: 'hotelsAPI',
  tagTypes: ['Hotels'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/hotels`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getHotelsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Hotels'],
    }),
    getHotelsByTripID: createByTripQuery(
      builder,
      {
        url: '/hotelsbytrip',
        tagName: 'Hotels'
      }
    )
  })
});

// Export hooks for usage in components
export const {
  useGetHotelsAllQuery,
  useGetHotelsByTripIDQuery
} = hotelsAPI;
