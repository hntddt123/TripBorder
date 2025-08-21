import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

export const renderWithRouter = (initialEntries = ['/'], component) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>
      <Route path='*' element={component} />
    </Routes>
  </MemoryRouter>
);
