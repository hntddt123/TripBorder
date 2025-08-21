import { screen } from '@testing-library/react';
import ButtonHotelsUpload from '../src/components/trips/ButtonHotelsUpload';
import { renderWithRedux } from './renderWithRedux';

test('renders ButtonHotelsUpload', () => {
  renderWithRedux(<ButtonHotelsUpload />);
  const ButtonElement = screen.getByText(/\+Hotels/i);
  expect(ButtonElement).toBeInTheDocument();
});
