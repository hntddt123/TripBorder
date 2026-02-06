import { screen } from '@testing-library/react';
import ButtonPOIUpload from '../src/components/trips/ButtonPOIUpload';
import { renderWithRedux } from './renderWithRedux';

test('renders ButtonPOIUpload', () => {
  renderWithRedux(<ButtonPOIUpload />);
  const ButtonElement = screen.getByText(/Tour/i);
  expect(ButtonElement).toBeInTheDocument();
});
