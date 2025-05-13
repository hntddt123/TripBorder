import { screen } from '@testing-library/react';
import nock from 'nock';
import { renderWithRedux } from './renderWithRedux';
import MileageUploadForm from '../src/components/MileageUploadForm';

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
    renderWithRedux(<MileageUploadForm />);
    const mileage = screen.getByText(/Create/i);

    expect(mileage).toHaveTextContent('Create');
  });
});
