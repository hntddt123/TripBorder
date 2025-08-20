import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.users,
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
    getUserByUUID: builder.mutation({
      query: ({ uuid }) => ({
        url: '/userbyuuid',
        method: 'POST',
        body: { data: uuid }
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
  useGetUserByUUIDMutation,
  useUpdateUserMutation
} = usersAPI;
