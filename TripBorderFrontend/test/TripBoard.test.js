import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TripBoard from '../src/components/TripBoard';

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: BrowserRouter });
};

test('renders TripBoard', () => {
  renderWithRouter(<TripBoard />);

  expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'a')).toBeInTheDocument();
});
