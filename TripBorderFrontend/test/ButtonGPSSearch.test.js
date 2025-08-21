import { screen } from '@testing-library/react';
import ButtonGPSSearch from '../src/components/trips/ButtonGPSSearch';
import { renderWithRedux } from './renderWithRedux';

test('renders ButtonGPSSearch', () => {
  renderWithRedux(<ButtonGPSSearch />);
  const ButtonElement = screen.getByText(/🛰️🔍/i);
  expect(ButtonElement).toBeInTheDocument();
});
