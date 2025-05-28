import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/users`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Users']
    }),
    updateUser: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/update/${uuid}`,
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
