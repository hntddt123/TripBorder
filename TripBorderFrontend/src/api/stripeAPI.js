import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../constants/apiConstants';

export const stripeAPI = createApi({
  reducerPath: 'stripeAPI',
  tagTypes: ['Stripe'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.stripe,
    credentials: 'include', // Include cookies in requests
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (ownerEmail) => ({
        url: '/create-checkout-session',
        body: {
          data: { ownerEmail }
        },
        method: 'POST',
        providesTags: ['Stripe'],
        keepUnusedDataFor: 3600
      })
    })
  })
});

export const {
  useCreateCheckoutSessionMutation,
} = stripeAPI;
