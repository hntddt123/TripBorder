/* eslint-disable import/no-extraneous-dependencies */
import nock from 'nock';
import { screen, waitFor } from '@testing-library/react';
import Mileages from '../src/components/Mileages';
import { renderWithRedux } from './renderWithRedux';
// import { TestMileages } from '../src/constants/constants';

describe('Mileages tests', () => {
  const baseUrl = 'https://localhost:5173';

  beforeEach(() => {
    // Clear Nock mocks before each test
    nock.cleanAll();
    // Allow non-mocked requests to pass through (optional, for safety)
    nock.enableNetConnect();
  });

  afterEach(() => {
    // Ensure no pending Nock mocks
    nock.cleanAll();
  });

  test('renders Mileage loading component if no RTKquery not called', () => {
    renderWithRedux(<Mileages />);
    const mileage = screen.getByText(/Loading/i);

    expect(mileage).toHaveTextContent('Loading');
  });

  test('renders error state if no query detail provided', async () => {
    nock(baseUrl)
      .get('/api/mileages');

    renderWithRedux(<Mileages />);
    await waitFor(() => {
      expect(screen.getByText(/Status: FETCH_ERROR/i)).toBeInTheDocument();
    });
  });

  test('renders error state', async () => {
    nock(baseUrl)
      .get('/api/mileages')
      .query({ page: 1, limit: 10 })
      .reply(500, { error: 'Internal server error' });

    renderWithRedux(<Mileages />);
    await waitFor(() => {
      expect(screen.getByText(/Status: 500 - Internal server error/i)).toBeInTheDocument();
    });
  });

  // test('renders mileages data after successful fetch', async () => {
  //   nock(baseUrl)
  //     .get('/api/mileages')
  //     .query({ page: 1, limit: 10 })
  //     .delay(100)
  //     .reply(200, {
  //       TestMileages,
  //       total: 2,
  //       totalPages: 1,
  //       page: 1
  //     });

  //   renderWithRedux(<Mileages />);

  //   await waitFor(() => {
  //     expect(screen.getByText('2000.0')).toBeInTheDocument();
  //     expect(screen.getByText('4000.0')).toBeInTheDocument();
  //   });
  // });
});
