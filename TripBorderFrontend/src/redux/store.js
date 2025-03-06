import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './reducers/counterReducer';
import { mapReducer } from './reducers/mapReducer';
import { foursquareAPI } from '../api/foursquareSliceAPI';
import { mapboxAPI } from '../api/mapboxSliceAPI';
import { authAPI } from '../api/authAPI';
import { mileageAPI } from '../api/mileageAPI';

const store = configureStore({
  reducer: {
    counterReducer,
    mapReducer,
    [foursquareAPI.reducerPath]: foursquareAPI.reducer,
    [mapboxAPI.reducerPath]: mapboxAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [mileageAPI.reducerPath]: mileageAPI.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    foursquareAPI.middleware,
    mapboxAPI.middleware,
    authAPI.middleware,
    mileageAPI.middleware
  )
});

export default store;
