import fetch from 'isomorphic-fetch';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mapBoxBaseUrl, getMapBoxDirectionUrl } from '../constants/apiConstants';

/*
  Get Directions
  https://api.mapbox.com/directions/v5/mapbox/walking/121.429999%2C25.159405%3B121.431372%2C25.160944
  &steps=true
  &geometries=geojson
  &access_token={token}
*/
export const mapboxAPI = createApi({
  reducerPath: 'mapboxAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: mapBoxBaseUrl,
    fetchFn: fetch
  }),
  endpoints: (builder) => ({
    getDirections: builder.query({
      query: ({ lonStart, latStart, lonEnd, latEnd }) => {
        const isValidCoord = (lon, lat) => typeof lon === 'number'
          && typeof lat === 'number'
          && lon >= -180 && lon <= 180
          && lat >= -90 && lat <= 90;

        if (!isValidCoord(lonStart, latStart) || !isValidCoord(lonEnd, latEnd)) {
          throw new Error('Invalid coordinates provided');
        }

        if (lonStart === lonEnd && latStart === latEnd) {
          throw new Error('Start and end coordinates cannot be identical');
        }

        return getMapBoxDirectionUrl(lonStart, latStart, lonEnd, latEnd);
      },
      transformErrorResponse: (response) => {
        if (response.status === 422) {
          return {
            status: 422,
            error: 'Unprocessable Entity: Invalid coordinates.',
            details: response.data,
          };
        }
        return response;
      },
    }),
  }),
});

export const { useLazyGetDirectionsQuery } = mapboxAPI;
