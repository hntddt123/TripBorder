import { BACKEND_DOMAIN, PORT } from '../constants/constants';

export const fetchUsers = async () => {
  const response = await fetch(`https://${BACKEND_DOMAIN}:${PORT}/api/users`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
