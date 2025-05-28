import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from '../src/redux/reducers/counterReducer';
import { mapReducer } from '../src/redux/reducers/mapReducer';
import { authAPI } from '../src/api/authAPI';
import { mileagesAPI } from '../src/api/mileagesAPI';
import { usersAPI } from '../src/api/usersAPI';
import { tripsAPI } from '../src/api/tripsAPI';

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
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authAPI.middleware,
        mileagesAPI.middleware,
        usersAPI.middleware,
        tripsAPI.middleware
      )
    }),
  } = {}
) => ({
  ...render(<Provider store={store}>{component}</Provider>),
  store,
});
