import { screen } from '@testing-library/react';
import ButtonPOISelection from '../src/components/trips/ButtonPOISelection';
import { renderWithRedux } from './renderWithRedux';

test('renders ButtonPOISelection', () => {
  renderWithRedux(<ButtonPOISelection />);
  const ButtonElement = screen.getByText(/🍱/i);
  expect(ButtonElement).toBeInTheDocument();
});
