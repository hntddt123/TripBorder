import { useCheckAuthStatusQuery } from '../api/authAPI';
import { isDevMode } from '../constants/constants';

export function useMockAuth() {
  if (isDevMode) {
    return {
      data: {
        isAuthenticated: true,
        uuid: '550e8400-e29b-41d4-a716-446655440001',
        email: 'test@tripborder.com',
        provider: 'tripborder',
        provider_user_id: '1',
        name: 'Test',
      },
      isLoading: false,
    };
  }
  return useCheckAuthStatusQuery();
}
