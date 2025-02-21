import fetch from 'isomorphic-fetch';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MAPBOX_API_KEY } from '../constants/constants';

/*
  Get Directions
  https://api.mapbox.com/directions/v5/mapbox/walking/121.429999%2C25.159405%3B121.431372%2C25.160944
  &steps=true
  &geometries=geojson
  &access_token={token}
*/
export const mapboxApi = createApi({
  reducerPath: 'mapboxApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.mapbox.com/',
    fetchFn: fetch
  }),
  endpoints: (builder) => ({
    getDirections: builder.query({
      query: ({ lonStart, latStart, lonEnd, latEnd }) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        `directions/v5/mapbox/walking/${lonStart},${latStart};${lonEnd},${latEnd}?steps=true&geometries=geojson&access_token=${MAPBOX_API_KEY}`,
    }),
  }),
});

export const { useLazyGetDirectionsQuery } = mapboxApi;
