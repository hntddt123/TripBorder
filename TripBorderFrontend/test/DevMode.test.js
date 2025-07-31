import { screen } from '@testing-library/react';
import DevMode from '../src/components/DevMode';
import { renderWithRedux } from './renderWithRedux';

describe('DevMode tests', () => {
  test('renders DevMode component with version number', () => {
    renderWithRedux(<DevMode />);
    const versionText = screen.getByText(/Version:/i);

    expect(versionText).toHaveTextContent('Add version number in .env');
  });
});
