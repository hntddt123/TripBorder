import { screen, waitFor, fireEvent } from '@testing-library/react';
import CustomToggle from '../src/components/CustomToggle';
import { renderWithRedux } from './renderWithRedux';

describe('Upgrade tests', () => {
  test('renders CustomToggle component default state', () => {
    renderWithRedux(<CustomToggle
      titleOff='TestOff'
    />);
    const CustomToggleText = screen.getByText(/TestOff/i);

    expect(CustomToggleText).toBeInTheDocument();
  });

  test('renders CustomToggle component on state', async () => {
    renderWithRedux(<CustomToggle
      titleOff='TestOff'
      titleOn='TestOn'
    />);

    const TestToggle = await screen.findByRole('button', { name: 'TestOff' });
    expect(TestToggle).toBeInTheDocument();
    expect(TestToggle).not.toBeDisabled();
    fireEvent.click(TestToggle);

    const CustomToggleText = screen.getByText(/TestOn/i);
    await waitFor(() => {
      expect(CustomToggleText).toBeInTheDocument();
    });
  });
});
