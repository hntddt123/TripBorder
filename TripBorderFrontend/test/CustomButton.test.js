import { render, screen } from '@testing-library/react';
import CustomButton from '../src/components/CustomButton';

test('renders button with NewBarcodesButton Label', () => {
  render(<CustomButton label='New Barcodes' />);
  const ButtonElement = screen.getByText(/New Barcodes/i);
  expect(ButtonElement).toBeInTheDocument();
});
