import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['Users']
    }),
    updateUser: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/updateuser/${uuid}`,
        method: 'PATCH',
        body: { data: updates },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Users'],
    }),
  })
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation
} = usersAPI;
