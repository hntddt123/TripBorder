import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from '../src/redux/reducers/counterReducer';
import { mapReducer } from '../src/redux/reducers/mapReducer';
import { authApi } from '../src/api/authAPI';

export const renderWithRedux = (
  component,
  {
    store = configureStore({
      reducer: {
        counterReducer,
        mapReducer,
        [authApi.reducerPath]: authApi.reducer
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authApi.middleware
      )
    }),
  } = {}
) => ({
  ...render(<Provider store={store}>{component}</Provider>),
  store,
});
