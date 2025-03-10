import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_DOMAIN, PORT } from '../constants/constants';

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${BACKEND_DOMAIN}:${PORT}/api`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
    }),
  })
});

export const {
  useGetUsersQuery,
} = usersAPI;
