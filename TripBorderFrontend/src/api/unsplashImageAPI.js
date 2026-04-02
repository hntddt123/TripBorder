import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  UNSPLASH_API_KEY,
  UNSPLASH_API_QUERIES,
} from '../constants/apiConstants';

export const unsplashImageAPI = createApi({
  reducerPath: 'unsplashImageAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.unsplash.com/',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Client-ID ${UNSPLASH_API_KEY}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUnsplashPhotos: builder.query({
      query: UNSPLASH_API_QUERIES.getUnsplashPhotosQuery,
      providesTags: (result, error, { text }) => [
        { type: 'UnsplashImages', id: text?.trim().toLowerCase() || 'EMPTY' },
      ],
    }),
    getDownloadImage: builder.mutation({
      query: (downloadLocation) => ({
        url: downloadLocation.replace('https://api.unsplash.com/', ''), // keep the full path + ixid param
      })
    })
  }),
});

export const { useLazyGetUnsplashPhotosQuery, useGetDownloadImageMutation } = unsplashImageAPI;
