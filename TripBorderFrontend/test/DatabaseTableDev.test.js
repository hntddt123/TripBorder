import nock from 'nock';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRedux } from './renderWithRedux';
import DatabaseTableDev from '../src/components/devtables/DatabaseTableDev';
import {
  TestAdminUser,
  TestAdminUsers,
  TestBaseUrl,
  TestMileages,
  TestTrips,
  TestMeals,
  TestPOIs,
  TestHotels,
  TestTransports,
  TestTags,
  TestTripTags,
  TestRatings,
} from '../src/constants/testConstants';
import { authAPI } from '../src/api/authAPI';

describe('Database Table tests', () => {
  let authSpy;

  beforeEach(() => {
    authSpy = jest.spyOn(authAPI.endpoints.checkAuthStatus, 'select');
    authSpy.mockClear();
    // Clear Nock mocks before each test
    nock.cleanAll();
    // Allow non-mocked requests to pass through (optional, for safety)
    nock.enableNetConnect();
  });

  afterEach(() => {
    authSpy.mockRestore();
    // Ensure no pending Nock mocks
    nock.cleanAll();
  });

  test('renders null if not admin', () => {
    authSpy.mockReturnValue(() => null);
    renderWithRedux(<DatabaseTableDev />);

    const databaseTable = screen.queryByText(/Database/i);

    expect(databaseTable).toBe(null);
  });

  test('renders DatabaseTableDev if user role is admin', async () => {
    authSpy.mockReturnValue(() => TestAdminUser);

    nock(TestBaseUrl)
      .get('/api/users/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        users: TestAdminUsers,
        total: 2,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/mileages/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        mileages: TestMileages,
        total: 1,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/trips/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        trips: TestTrips,
        total: 2,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/meals/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        meals: TestMeals,
        total: 1,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/pois/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        pois: TestPOIs,
        total: 1,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/hotels/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        hotels: TestHotels,
        total: 1,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/transports/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        transports: TestTransports,
        total: 1,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/tags/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        tags: TestTags,
        total: 2,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/trip_tags/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        tripTags: TestTripTags,
        total: 2,
        totalPages: 1,
        page: 1
      });

    nock(TestBaseUrl)
      .get('/api/ratings/')
      .query({ page: 1, limit: 3 })
      .delay(100)
      .reply(200, {
        ratings: TestRatings,
        total: 1,
        totalPages: 1,
        page: 1
      });

    renderWithRedux(<DatabaseTableDev />);

    await waitFor(() => {
      expect(screen.getByText(/Database/i)).toHaveTextContent('Database Table');
      expect(screen.getByText(/user_accounts/i)).toHaveTextContent('user_accounts');
      expect(screen.getByText(/mileages/i)).toHaveTextContent('mileages');
      expect(screen.getAllByText(/testuser@tripborder.com/i).length).toBe(2);
      expect(screen.getAllByText(/testtrip@tripborder.com/i).length).toBe(2);
      expect(screen.getByText(/Ichiran/i)).toHaveTextContent('Ichiran');
      expect(screen.getByText(/Skytree/i)).toHaveTextContent('Skytree');
      expect(screen.getByText(/Hilton Osaka/i)).toHaveTextContent('Hilton Osaka');
      expect(screen.getByText(/ANA789/i)).toHaveTextContent('ANA789');
      expect(screen.getByText(/culture/i)).toHaveTextContent('culture');
      expect(screen.getByText(/550e8400-e29b-41d4-a716-446655440901/i)).toHaveTextContent('550e8400-e29b-41d4-a716-446655440901');
      expect(screen.getByText(/friendly staff/i)).toHaveTextContent('friendly staff');
    });
  });
});
