import { screen } from '@testing-library/react';
import App from '../src/App';
import { renderWithRedux } from './renderWithRedux';

describe('App tests', () => {
  test('Canary Test', () => {
    expect(1).toBe(1);
  });

  test('renders suspend fallback if loading', async () => {
    renderWithRedux(<App />);
    const linkElement = await screen.findByText(/Loading.../i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders Trip Border title', async () => {
    renderWithRedux(<App />);
    const linkElement = await screen.findByText(/Trip Border/i);
    expect(linkElement).toBeInTheDocument();
  });
});
