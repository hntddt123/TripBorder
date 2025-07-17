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
    postMealsByTripID: builder.mutation({
      query: (newMeal) => ({
        url: '/upload',
        method: 'POST',
        body: { data: newMeal },
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Meals'],
    }),
    deleteMeals: builder.mutation({
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
  usePostMealsByTripIDMutation,
  useDeleteMealsMutation
} = mealsAPI;
