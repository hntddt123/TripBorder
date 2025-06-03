import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from '../src/redux/reducers/counterReducer';
import { mapReducer } from '../src/redux/reducers/mapReducer';
import { authAPI } from '../src/api/authAPI';
import { mileagesAPI } from '../src/api/mileagesAPI';
import { usersAPI } from '../src/api/usersAPI';
import { tripsAPI } from '../src/api/tripsAPI';
import { mealsAPI } from '../src/api/mealsAPI';
import { poisAPI } from '../src/api/poisAPI';
import { hotelsAPI } from '../src/api/hotelsAPI';
import { transportsAPI } from '../src/api/transportsAPI';
import { tagsAPI } from '../src/api/tagsAPI';
import { tripTagsAPI } from '../src/api/tripTagsAPI';
import { ratingsAPI } from '../src/api/ratingsAPI';

export const renderWithRedux = (
  component,
  {
    store = configureStore({
      reducer: {
        counterReducer,
        mapReducer,
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
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
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
    }),
  } = {}
) => ({
  ...render(<Provider store={store}>{component}</Provider>),
  store,
});
