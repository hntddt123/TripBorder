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
      providesTags: ['User']
    }),
    updateUser: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/updateuser/${uuid}`,
        method: 'PATCH',
        body: { data: updates },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['User'],
    }),
  })
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation
} = usersAPI;
