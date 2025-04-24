import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TripBoard from '../src/components/TripBoard';

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: BrowserRouter });
};

describe('DevMode tests', () => {
  test('renders TripBoard', () => {
    renderWithRouter(<TripBoard />);
    const tag = screen.getByText((content, element) => element.tagName.toLowerCase() === 'a');
    expect(tag).toBeInTheDocument();
  });
});
