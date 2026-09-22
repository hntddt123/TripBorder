import { screen } from '@testing-library/react';
import { renderWithRedux } from './renderWithRedux';
import GPS from '../src/components/trips/mapControls/GPS';

describe('Settings tests', () => {
  test('renders Settings component', () => {
    renderWithRedux(<GPS />);

    expect(screen.getByTestId('gps')).toBeInTheDocument();
  });
});
