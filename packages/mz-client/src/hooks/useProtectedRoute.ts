import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMyAccount } from '~/lib/api/me';
import { setUser } from './stores/userStore';

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUser, setHasUser] = useState(false);
  const set = setUser();
  console.log(location);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getMyAccount();
      set(result);
      if (result) {
        setHasUser(true);
      } else {
        // navigate('/login?redirect=/write', { state: { from: location }, replace: true });
        navigate('/login', { state: { from: location, redirect: '/' }, replace: true });
      }
    };
    fetchData();
  }, [hasUser, navigate]);
  return hasUser;
};
