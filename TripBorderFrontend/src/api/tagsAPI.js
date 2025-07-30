import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/api';
import { createByEmailPaginationQuery } from '../utility/RTKQueryFactory';

export const tagsAPI = createApi({
  reducerPath: 'tagsAPI',
  tagTypes: ['Tags'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.tags,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getTagsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Tags'],
    }),
    getTagsByEmailPagination: createByEmailPaginationQuery(
      builder,
      {
        url: '/tagsbyemailpagination',
        tagName: 'Tags'
      }
    ),
    postTagByEmail: builder.mutation({
      query: (newTag) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newTag },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Tags'],
    }),
    deleteTag: builder.mutation({
      query: (tagID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: tagID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Tags'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetTagsAllQuery,
  useGetTagsByEmailPaginationQuery,
  usePostTagByEmailMutation,
  useDeleteTagMutation
} = tagsAPI;
