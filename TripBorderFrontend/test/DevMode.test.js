import { render, screen } from '@testing-library/react';
import DevMode from '../src/components/DevMode';

describe('DevMode tests', () => {
  test('renders DevMode component with version number', () => {
    render(<DevMode />);
    const versionText = screen.getByText(/Version:/i);

    expect(versionText).toHaveTextContent('2.0.1');
  });
});
