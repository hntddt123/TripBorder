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
    )
  })
});

// Export hooks for usage in components
export const {
  useGetPOIsAllQuery,
  useGetPOIsByTripIDQuery
} = poisAPI;
