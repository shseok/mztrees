import { useUser } from '~/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useProtectedRoute = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/write');
    }
  }, [user, navigate]);

  return !!user;
};
