import fetch from 'isomorphic-fetch';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  FOURSQUARE_API_KEY,
  FOURSQUARE_API_QUERIES,
  fourSquareBaseUrl
} from '../constants/apiConstants';
/*
  Place Search
  https://places-api.foursquare.com/places/search?ll=25.1593548,121.4296176&categories=4d4b7105d754a06374d81259&radius=500
  example: 4d4b7105d754a06374d81259 restaurants
  example: 4bf58dd8d48988d1fa931735 hotels
  example: authorization: APIKEY

  Place Photos
  https://places-api.foursquare.com/places/{fsq_id}/photos
  example: 老漁村 7625320806284d325e90f3af

  Migration:
  fourSquareBaseUrl change to https://places-foursquare.com
*/
export const foursquareAPI = createApi({
  reducerPath: 'foursquareAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: fourSquareBaseUrl,
    fetchFn: fetch,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Authorization', `Bearer ${FOURSQUARE_API_KEY}`);
      headers.set('X-Places-Api-Version', '2025-06-17');
      return headers;
    }
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getNearbyPOI: builder.query({
      query: FOURSQUARE_API_QUERIES.getNearbyPOIQuery,
      providesTags: ['FoursquarePOIs'],
      keepUnusedDataFor: 900
    }),
    getPOIPhotos: builder.query({
      query: FOURSQUARE_API_QUERIES.getPOIPhotosQuery,
      providesTags: ['FoursquarePOIPhotos'],
      keepUnusedDataFor: 900
    })
  }),
});

export const {
  useLazyGetNearbyPOIQuery,
  useLazyGetPOIPhotosQuery
} = foursquareAPI;
