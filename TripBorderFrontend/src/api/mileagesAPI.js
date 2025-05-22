import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const mileagesAPI = createApi({
  reducerPath: 'mileagesAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api`,
    credentials: 'include',
  }),
  tagTypes: ['Mileage'],
  endpoints: (builder) => ({
    getMileagesAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/mileages',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Mileage'],
    }),
    getMileagesSelling: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/mileagesselling',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Mileage'],
    }),
    getMileagesByEmail: builder.query({
      query: (email) => ({
        url: '/mileagesbyemail',
        method: 'POST',
        body: { data: email },
        headers: { 'Content-Type': 'application/json' }
      }),
      providesTags: ['Mileage'],
    }),
    postMileages: builder.mutation({
      query: (newMileage) => ({
        url: '/uploadmileages',
        method: 'POST',
        body: { data: newMileage },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Mileage'],
    }),
    updateMileages: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/updatemileages/${uuid}`,
        method: 'PATCH',
        body: { data: updates },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Mileage'],
    }),
    deleteMileages: builder.mutation({
      query: (mileageID) => ({
        url: '/removemileagebyid',
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
  useGetMileagesByEmailQuery,
  usePostMileagesMutation,
  useDeleteMileagesMutation,
  useUpdateMileagesMutation
} = mileagesAPI;
