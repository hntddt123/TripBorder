import { screen } from '@testing-library/react';
import App from '../src/App';
import { renderWithRedux } from './renderWithRedux';

jest.mock('../src/constants/constants.js', () => ({
  API_KEY: ''
}));


test('Canary Test', () => {
  expect(1).toBe(1);
});

test('renders QR Code Generator title', () => {
  renderWithRedux(<App />);
  const linkElement = screen.getByText(/Trip Day/i);
  expect(linkElement).toBeInTheDocument();
});
