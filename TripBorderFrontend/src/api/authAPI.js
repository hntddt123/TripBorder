import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  tagTypes: ['Auth'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.auth,
    credentials: 'include', // Include cookies in requests
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    checkAuthStatus: builder.query({
      query: () => '/',
      providesTags: ['Auth'],
      keepUnusedDataFor: 3600
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'GET',
        invalidatesTags: ['Auth']
      }),
      invalidatesTags: ['Auth']
    }),
  }),
});

export const {
  useCheckAuthStatusQuery,
  useLogoutMutation
} = authAPI;
