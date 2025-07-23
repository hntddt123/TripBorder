import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './reducers/counterReducer';
import { mapReducer } from './reducers/mapReducer';
import { tripReducer } from './reducers/tripReducer';
import { userSettingsReducer } from './reducers/userSettingsReducer';
import { foursquareAPI } from '../api/foursquareSliceAPI';
import { mapboxAPI } from '../api/mapboxSliceAPI';
import { authAPI } from '../api/authAPI';
import { mileagesAPI } from '../api/mileagesAPI';
import { usersAPI } from '../api/usersAPI';
import { tripsAPI } from '../api/tripsAPI';
import { mealsAPI } from '../api/mealsAPI';
import { poisAPI } from '../api/poisAPI';
import { hotelsAPI } from '../api/hotelsAPI';
import { transportsAPI } from '../api/transportsAPI';
import { tagsAPI } from '../api/tagsAPI';
import { tripTagsAPI } from '../api/tripTagsAPI';
import { ratingsAPI } from '../api/ratingsAPI';

const store = configureStore({
  reducer: {
    counterReducer,
    mapReducer,
    tripReducer,
    userSettingsReducer,
    [foursquareAPI.reducerPath]: foursquareAPI.reducer,
    [mapboxAPI.reducerPath]: mapboxAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [mileagesAPI.reducerPath]: mileagesAPI.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
    [tripsAPI.reducerPath]: tripsAPI.reducer,
    [mealsAPI.reducerPath]: mealsAPI.reducer,
    [poisAPI.reducerPath]: poisAPI.reducer,
    [hotelsAPI.reducerPath]: hotelsAPI.reducer,
    [transportsAPI.reducerPath]: transportsAPI.reducer,
    [tagsAPI.reducerPath]: tagsAPI.reducer,
    [tripTagsAPI.reducerPath]: tripTagsAPI.reducer,
    [ratingsAPI.reducerPath]: ratingsAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
      foursquareAPI.middleware,
      mapboxAPI.middleware,
      authAPI.middleware,
      mileagesAPI.middleware,
      usersAPI.middleware,
      tripsAPI.middleware,
      mealsAPI.middleware,
      poisAPI.middleware,
      hotelsAPI.middleware,
      transportsAPI.middleware,
      tagsAPI.middleware,
      tripTagsAPI.middleware,
      ratingsAPI.middleware
    )
});

export default store;
