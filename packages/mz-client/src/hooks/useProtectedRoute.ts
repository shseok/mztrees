import { useUser } from '~/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';

export const useProtectedRoute = () => {
  const user = useUser();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!user) {
      navigate('/login?redirect=/write');
    }
  }, [user, navigate]);
};
