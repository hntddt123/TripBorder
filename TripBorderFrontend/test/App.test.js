import { screen } from '@testing-library/react';
import App from '../src/App';
import { renderWithRedux } from './renderWithRedux';

jest.mock('heic2any', () => ({
  __esModule: true,
  default: async ({ toType }) => new Blob(['mocked-jpeg-data'], { type: toType || 'image/jpeg' }),
}));

jest.mock('../src/constants/constants.js', () => ({
  API_KEY: ''
}));

jest.mock('@mapbox/mapbox-gl-geocoder', () => ({
  MapboxGeocoder: ''
}));

describe('App tests', () => {
  test('Canary Test', () => {
    expect(1).toBe(1);
  });

  test('renders Trip Border title', () => {
    renderWithRedux(<App />);
    const linkElement = screen.getByText(/Trip Border/i);
    expect(linkElement).toBeInTheDocument();
  });
});
