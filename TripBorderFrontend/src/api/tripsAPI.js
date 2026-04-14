import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';
import { createByEmailPaginationQuery } from '../utility/RTKQueryFactory';

export const tripsAPI = createApi({
  reducerPath: 'tripsAPI',
  tagTypes: ['Trips'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.trips,
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
    getTripsPublicPagination: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/tripspublicpagination',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Trips'],
    }),
    // Search for trips from shared email
    getTripsSharedEmailPagination: builder.query({
      query: ({ othersEmail, page = 1, limit = 10 }) => ({
        url: '/tripsbysharedemailpagination',
        method: 'POST',
        body: { data: othersEmail, page, limit }
      }),
      providesTags: ['Trips'],
    }),
    getMySharedTripsPagination: createByEmailPaginationQuery(
      builder,
      {
        url: '/tripsmysharedpagination',
        tagName: 'Trips'
      }
    ),
    getOthersSharedTripsPagination: createByEmailPaginationQuery(
      builder,
      {
        url: '/tripsotherssharedpagination',
        tagName: 'Trips'
      }
    ),
    getTripsByEmailPagination: createByEmailPaginationQuery(
      builder,
      {
        url: '/tripsbyemailpagination',
        tagName: 'Trips'
      }
    ),
    getTripByUUID: builder.query({
      query: ({ uuid, email }) => ({
        url: '/tripsbyuuid',
        method: 'POST',
        body: { data: uuid, email },
      }),
      providesTags: ['Trips'],
    }),
    updateTripByUUID: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/update/${uuid}`,
        method: 'PATCH',
        body: { data: updates },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Trips'],
    }),
    initTripByEmail: builder.mutation({
      query: (ownerEmail) => ({
        url: '/init',
        method: 'POST',
        body: { data: ownerEmail },
      }),
      invalidatesTags: ['Trips'],
    }),
    deleteTrips: builder.mutation({
      query: (tripID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: tripID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Trips'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetTripsAllQuery,
  useGetTripsByEmailPaginationQuery,
  useGetMySharedTripsPaginationQuery,
  useGetOthersSharedTripsPaginationQuery,
  useGetTripsSharedEmailPaginationQuery,
  useGetTripsPublicPaginationQuery,
  useGetTripByUUIDQuery,
  useInitTripByEmailMutation,
  useUpdateTripByUUIDMutation,
  useDeleteTripsMutation
} = tripsAPI;
