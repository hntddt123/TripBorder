import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${BACKEND_DOMAIN}:${PORT}`, // Replace with your Express backend URL
    credentials: 'include', // Include cookies in requests
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    checkAuthStatus: builder.query({
      query: () => '/',
      providesTags: ['Auth'],
      keepUnusedDataFor: 0
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
      invalidatesTags: ['Auth']
    }),
  }),
});

export const { useCheckAuthStatusQuery, useLogoutMutation } = authAPI;
