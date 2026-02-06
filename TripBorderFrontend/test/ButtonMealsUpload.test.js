import { screen } from '@testing-library/react';
import ButtonMealsUpload from '../src/components/trips/ButtonMealsUpload';
import { renderWithRedux } from './renderWithRedux';

test('renders ButtonMealsUpload', () => {
  renderWithRedux(<ButtonMealsUpload />);
  const ButtonElement = screen.getByText(/Meal/i);
  expect(ButtonElement).toBeInTheDocument();
});
