import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './reducers/counterReducer';
import { mapReducer } from './reducers/mapReducer';
import { foursquareAPI } from '../api/foursquareSliceAPI';
import { mapboxAPI } from '../api/mapboxSliceAPI';
import { authAPI } from '../api/authAPI';
import { mileagesAPI } from '../api/mileagesAPI';
import { usersAPI } from '../api/usersAPI';

const store = configureStore({
  reducer: {
    counterReducer,
    mapReducer,
    [foursquareAPI.reducerPath]: foursquareAPI.reducer,
    [mapboxAPI.reducerPath]: mapboxAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [mileagesAPI.reducerPath]: mileagesAPI.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    foursquareAPI.middleware,
    mapboxAPI.middleware,
    authAPI.middleware,
    mileagesAPI.middleware,
    usersAPI.middleware
  )
});

export default store;
