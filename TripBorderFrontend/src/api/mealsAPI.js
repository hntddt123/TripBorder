import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';

export const mealsAPI = createApi({
  reducerPath: 'mealsAPI',
  tagTypes: ['Meals'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/meals`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getMealsAll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Meals'],
    }),
  })
});

// Export hooks for usage in components
export const {
  useGetMealsAllQuery,
} = mealsAPI;
