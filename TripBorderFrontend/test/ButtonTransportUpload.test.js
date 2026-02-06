import { screen } from '@testing-library/react';
import ButtonTransportUpload from '../src/components/trips/ButtonTransportUpload';
import { renderWithRedux } from './renderWithRedux';

test('renders ButtonTransportUpload', () => {
  renderWithRedux(<ButtonTransportUpload />);
  const ButtonElement = screen.getByText(/Ride/i);
  expect(ButtonElement).toBeInTheDocument();
});
