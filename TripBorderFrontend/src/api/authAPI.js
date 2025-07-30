import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/api';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  tagTypes: ['Auth'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.auth,
    credentials: 'include', // Include cookies in requests
  }),
  endpoints: (builder) => ({
    checkAuthStatus: builder.query({
      query: () => '/',
      providesTags: ['Auth'],
      keepUnusedDataFor: 0,
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

export const {
  useLazyCheckAuthStatusQuery,
  useCheckAuthStatusQuery,
  useLogoutMutation
} = authAPI;
