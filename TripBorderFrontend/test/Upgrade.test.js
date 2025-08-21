import { screen } from '@testing-library/react';
import Upgrade from '../src/components/Upgrade';
import { renderWithRedux } from './renderWithRedux';

describe('Upgrade tests', () => {
  test('renders upgrade component', () => {
    renderWithRedux(<Upgrade />);
    const UpgradeText = screen.getByText(/Upgrade/i);

    expect(UpgradeText).toHaveTextContent('Upgrade');
  });
});
