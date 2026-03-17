import { useAuth0 } from '@auth0/auth0-react';

const BASE_URL = 'http://localhost:3000';

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const authFetch = async (endpoint, options = {}) => {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  };

  return { authFetch };
};