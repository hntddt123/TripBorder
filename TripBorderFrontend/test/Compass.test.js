import { screen } from '@testing-library/react';
import { renderWithRedux } from './renderWithRedux';
import Compass from '../src/components/trips/mapControls/Compass';

describe('Settings tests', () => {
  test('renders Settings component', () => {
    renderWithRedux(<Compass />);

    expect(screen.getByTestId('compass')).toBeInTheDocument();
  });
});
