import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_DOMAIN } from '../constants/constants';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${BACKEND_DOMAIN}:443`, // Replace with your Express backend URL
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

export const { useCheckAuthStatusQuery, useLogoutMutation } = authApi;
