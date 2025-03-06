import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';

export const mileageAPI = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${BACKEND_DOMAIN}:${PORT}/api`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    // GET /api/mileages (Query)
    getMileages: builder.query({
      query: () => ({
        url: '/mileages',
        method: 'GET',
      }),
    }),
    // POST /api/mileagesbyemail (Mutation)
    getMileagesByEmail: builder.mutation({
      query: (email) => ({
        url: '/mileagesbyemail',
        method: 'POST',
        body: { data: email },
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMileagesQuery,
  useGetMileagesByEmailMutation
} = mileageAPI;
