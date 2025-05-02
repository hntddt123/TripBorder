/* eslint-disable import/no-extraneous-dependencies */
import nock from 'nock';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import Mileages from '../src/components/Mileages';
import { renderWithRedux } from './renderWithRedux';
import { TestMileages, TestBaseUrl } from '../src/constants/testConstants';

describe('Mileages tests', () => {

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
    nock(TestBaseUrl)
      .get('/api/mileages');

    renderWithRedux(<Mileages />);
    await waitFor(() => {
      expect(screen.getByText(/Status: FETCH_ERROR/i)).toBeInTheDocument();
    });
  });

  test('renders error state', async () => {
    nock(TestBaseUrl)
      .get('/api/mileages')
      .query({ page: 1, limit: 10 })
      .reply(500, { error: 'Internal server error' });

    renderWithRedux(<Mileages />);
    await waitFor(() => {
      expect(screen.getByText(/Status: 500 - Internal server error/i)).toBeInTheDocument();
    });
  });

  test('renders mileages data after successful fetch', async () => {
    nock(TestBaseUrl)
      .get('/api/mileages')
      .query({ page: 1, limit: 10 })
      .delay(100)
      .reply(200, {
        mileages: TestMileages,
        total: 4,
        totalPages: 1,
        page: 1
      });

    renderWithRedux(<Mileages />);

    await waitFor(() => {
      expect(screen.getByText(/2000.0/)).toBeInTheDocument();
      expect(screen.getByText(/4000.0/)).toBeInTheDocument();
    });
  });

  test('renders only 2 verified and listed example mileages data', async () => {
    nock(TestBaseUrl)
      .get('/api/mileages')
      .query({ page: 1, limit: 10 })
      .delay(100)
      .reply(200, {
        mileages: TestMileages,
        total: 4,
        totalPages: 1,
        page: 1
      });

    renderWithRedux(<Mileages />);

    await waitFor(() => {
      expect(screen.getAllByText(/Tripborder Air/).length).toBe(2);
    });
  });

  test('renders mileages data and handle click on image popup and close', async () => {
    nock(TestBaseUrl)
      .get('/api/mileages')
      .query({ page: 1, limit: 10 })
      .delay(100)
      .reply(200, {
        mileages: TestMileages,
        total: 4,
        totalPages: 1,
        page: 1
      });

    renderWithRedux(<Mileages />);

    const image = await screen.findByRole('button', { name: 'Mileage Picture Button 1' });
    fireEvent.click(image);

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText('Close')).not.toBeInTheDocument();
    });
  });

  // test('renders mileages data and handle 2 Mileage per page next/prev button', async () => {
  //   nock(TestBaseUrl)
  //     .get('/api/mileages')
  //     .query({ page: 1, limit: 10 })
  //     .delay(100)
  //     .reply(200, {
  //       mileages: TestMileagesPage1,
  //       total: 40,
  //       totalPages: 2,
  //       page: 1
  //     });

  //   nock(TestBaseUrl)
  //     .get('/api/mileages')
  //     .query({ page: 2, limit: 10 })
  //     .delay(100)
  //     .reply(200, {
  //       mileages: TestMileagesPage2,
  //       total: 40,
  //       totalPages: 2,
  //       page: 2
  //     });

  //   renderWithRedux(<Mileages />);

  //   await waitFor(() => {
  //     expect(screen.getByText(/2025/)).toBeInTheDocument();
  //   });

  //   const nextButton = await screen.findByRole('button', { name: 'Next Page Button' });

  //   // const prevbutton = await screen.findByRole('button', { name: 'Previous Page Button' });
  //   fireEvent.click(nextButton);

  //   // fireEvent.click(prevbutton);

  //   await waitFor(() => {
  //     expect(screen.getByText(/2099/)).toBeInTheDocument();
  //   });
  // });
});
