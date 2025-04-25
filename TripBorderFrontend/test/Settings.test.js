import { screen } from '@testing-library/react';
import Settings from '../src/components/Settings';
import { renderWithRedux } from './renderWithRedux';

describe('Settings tests', () => {
  test('renders Settings component', () => {
    renderWithRedux(<Settings />);
    const SettingsText = screen.getByText(/Settings/i);

    expect(SettingsText).toHaveTextContent('Settings');
  });
});
