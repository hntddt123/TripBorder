import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';

const rawAuthBaseQuery = fetchBaseQuery({
  baseUrl: API_ROUTES.auth,
  credentials: 'include', // Include cookies in requests
});

// The backend answers GET /api/auth with HTTP 401 when logged out.
// Map that to a normal "logged out" result so every consumer of
// useCheckAuthStatusQuery keeps reading data.isAuthenticated === false.
export const isUnauthorizedError = (error) => error?.status === 401;

const authBaseQuery = async (args, api, extraOptions) => {
  const result = await rawAuthBaseQuery(args, api, extraOptions);
  if (isUnauthorizedError(result.error)) {
    return { data: { isAuthenticated: false } };
  }
  return result;
};

export const authAPI = createApi({
  reducerPath: 'authAPI',
  tagTypes: ['Auth'],
  baseQuery: authBaseQuery,
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
