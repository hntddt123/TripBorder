import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const tagsAPI = createApi({
  reducerPath: 'tagsAPI',
  tagTypes: ['Tags'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/tags`,
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
  })
});

// Export hooks for usage in components
export const {
  useGetTagsAllQuery,
} = tagsAPI;
