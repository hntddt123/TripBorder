import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';
import { createByTripQuery } from '../utility/RTKQueryFactory';

export const hotelsAPI = createApi({
  reducerPath: 'hotelsAPI',
  tagTypes: ['Hotels'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.hotels,
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
    ),
    postHotelsByTripID: builder.mutation({
      query: (newHotel) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newHotel },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Hotels'],
    }),
    updateHotelByUUID: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/update/${uuid}`,
        method: 'PATCH',
        body: { data: updates },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Hotels'],
    }),
    deleteHotels: builder.mutation({
      query: (hotelID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: hotelID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Hotels'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetHotelsAllQuery,
  useGetHotelsByTripIDQuery,
  usePostHotelsByTripIDMutation,
  useUpdateHotelByUUIDMutation,
  useDeleteHotelsMutation
} = hotelsAPI;
