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

  test('renders MileageUploadForm have Create wording', () => {
    renderWithRedux(<MileageUploadForm />);

    expect(screen.getByText(/Create/i)).toHaveTextContent('Create');
  });
});
