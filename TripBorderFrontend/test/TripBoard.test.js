import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TripBoard from '../src/components/TripBoard';

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: BrowserRouter });
};

describe('TripBoard tests', () => {
  test('renders TripBoard', () => {
    renderWithRouter(<TripBoard />);
    const tag = screen.getByText('←');
    expect(tag).toBeInTheDocument();
  });
});
