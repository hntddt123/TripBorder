import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './reducers/counterReducer';
import { mapReducer } from './reducers/mapReducer';
import { foursquareApi } from '../api/foursquareSliceAPI';
import { mapboxApi } from '../api/mapboxSliceAPI';
import { authApi } from '../api/authAPI';

const store = configureStore({
  reducer: {
    counterReducer,
    mapReducer,
    [foursquareApi.reducerPath]: foursquareApi.reducer,
    [mapboxApi.reducerPath]: mapboxApi.reducer,
    [authApi.reducerPath]: authApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    foursquareApi.middleware,
    mapboxApi.middleware,
    authApi.middleware
  )
});

export default store;
