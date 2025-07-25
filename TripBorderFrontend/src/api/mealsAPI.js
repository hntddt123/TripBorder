import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/constants';
import { createByTripQuery } from '../utility/RTKQueryFactory';

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
    getMealsByTripID: createByTripQuery(
      builder,
      {
        url: '/mealsbytrip',
        tagName: 'Meals'
      }
    ),
    postMealByTripID: builder.mutation({
      query: (newMeal) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newMeal },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Meals'],
    }),
    updateMealByUUID: builder.mutation({
      query: ({ uuid, updates }) => ({
        url: `/update/${uuid}`,
        method: 'PATCH',
        body: { data: updates },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Meals'],
    }),
    deleteMeal: builder.mutation({
      query: (mealID) => ({
        url: '/removebyid',
        method: 'DELETE',
        body: { data: mealID },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Meals'],
    })
  })
});

// Export hooks for usage in components
export const {
  useGetMealsAllQuery,
  useGetMealsByTripIDQuery,
  usePostMealByTripIDMutation,
  useUpdateMealByUUIDMutation,
  useDeleteMealMutation
} = mealsAPI;
