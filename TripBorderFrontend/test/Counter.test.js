import { screen } from '@testing-library/react';
import { act } from 'react';

import Counter from '../src/components/Counter';
import { incrementCount, decrementCount } from '../src/redux/reducers/counterReducer';
import { renderWithRedux } from './renderWithRedux';

test('renders with initial state count = 3', () => {
  renderWithRedux(<Counter />);
  expect(screen.getByText(/3/i)).toBeInTheDocument();
});

test('increments the counter from 3 to 4', () => {
  const { store } = renderWithRedux(<Counter />);
  act(() => {
    store.dispatch(incrementCount(0));
  });
  expect(screen.getByText(/4/i)).toBeInTheDocument();
});

test('decrements the counter from 3 to 2', () => {
  const { store } = renderWithRedux(<Counter />, { initialState: { counter: { count: 1 } } });
  act(() => {
    store.dispatch(decrementCount(1));
  });
  expect(screen.getByText(/2/i)).toBeInTheDocument();
});
