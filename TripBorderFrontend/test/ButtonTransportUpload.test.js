import { screen } from '@testing-library/react';
import ButtonTransportUpload from '../src/components/trips/ButtonTransportUpload';
import { renderWithRedux } from './renderWithRedux';

test('renders ButtonTransportUpload', () => {
  renderWithRedux(<ButtonTransportUpload />);
  const ButtonElement = screen.getByText(/\+Transport/i);
  expect(ButtonElement).toBeInTheDocument();
});
