import fetch from 'isomorphic-fetch';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FOURSQUARE_API_KEY, fourSquareBaseUrl } from '../constants/constants';
import { setSelectedPOIIcon } from '../redux/reducers/mapReducer';

/*
  Place Search
  https://api.foursquare.com/v3/places/search?ll=25.1593548,121.4296176&categories=4d4b7105d754a06374d81259&radius=500
  example: 4d4b7105d754a06374d81259 restaurants
  example: 4bf58dd8d48988d1fa931735 hotels
  example: authorization: APIKEY

  Place Photos
  https://api.foursquare.com/v3/places/{fsq_id}/photos
  example: 老漁村 7625320806284d325e90f3af

  Place
*/
export const foursquareAPI = createApi({
  reducerPath: 'foursquareAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: fourSquareBaseUrl,
    fetchFn: fetch,
    prepareHeaders: (headers) => {
      headers.set('Authorization', FOURSQUARE_API_KEY);
    }
  }),
  endpoints: (builder) => ({
    getNearbyPOI: builder.query({
      query: ({ ll, radius, limit, category }) => `places/search?ll=${ll}&radius=${radius}&limit=${limit}&categories=${category}&sort=DISTANCE`,
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setSelectedPOIIcon(data.icon));
        } catch (err) {
          dispatch(setSelectedPOIIcon(err.message));
        }
      }
    }),
    getPOIPhotos: builder.query({
      query: ({ fsqId }) => `places/${fsqId}/photos?limit=10&sort=POPULAR`,
    })
  }),
});

export const {
  useLazyGetNearbyPOIQuery,
  useLazyGetPOIPhotosQuery
} = foursquareAPI;
