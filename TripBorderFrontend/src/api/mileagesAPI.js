import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';

export const mileagesAPI = createApi({
  reducerPath: 'mileagesAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${BACKEND_DOMAIN}:${PORT}/api`,
    credentials: 'include',
  }),
  tagTypes: ['Mileage'],
  endpoints: (builder) => ({
    getMileages: builder.query({
      query: () => ({
        url: '/mileages',
        method: 'GET',
      }),
      providesTags: ['Mileage'],
    }),
    getMileagesByEmail: builder.mutation({
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
    updateMileagesVerification: builder.mutation({
      query: ({ uuid, verified }) => ({
        url: `/verifymileages/${uuid}`,
        method: 'PATCH',
        body: { data: verified },
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
  useGetMileagesQuery,
  useGetMileagesByEmailMutation,
  usePostMileagesMutation,
  useDeleteMileagesMutation,
  useUpdateMileagesVerificationMutation
} = mileagesAPI;
