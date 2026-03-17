import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useUserRole = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchRole = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`http://localhost:3000/users/byAuth0/${user.sub}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRole(data.role);
      } catch {
        setRole('user');
      }
    };

    fetchRole();
  }, [isAuthenticated, user]);

  return role;
};