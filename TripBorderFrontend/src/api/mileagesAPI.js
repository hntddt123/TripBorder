import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';
import { createByEmailPaginationQuery } from '../utility/RTKQueryFactory';

export const mileagesAPI = createApi({
  reducerPath: 'mileagesAPI',
  tagTypes: ['Mileage'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.mileages,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getMileagesAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Mileage'],
    }),
    getMileagesSelling: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/selling',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Mileage'],
    }),
    getMileagesByEmail: createByEmailPaginationQuery(
      builder,
      {
        url: '/mileagesbyemail',
        tagName: 'Mileage'
      }
    ),
    postMileages: builder.mutation({
      query: (newMileage) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newMileage },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Mileage'],
    }),
    updateMileages: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/update/${uuid}`,
        method: 'PATCH',
        body: { data: updates },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Mileage'],
    }),
    deleteMileages: builder.mutation({
      query: (mileageID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: mileageID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Mileage'],
    }),
  })
});

// Export hooks for usage in components
export const {
  useGetMileagesAllQuery,
  useGetMileagesSellingQuery,
  useLazyGetMileagesByEmailQuery,
  usePostMileagesMutation,
  useDeleteMileagesMutation,
  useUpdateMileagesMutation
} = mileagesAPI;
