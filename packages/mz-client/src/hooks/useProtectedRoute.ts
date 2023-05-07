import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMemorizedMyAccount } from '~/lib/api/auth';

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMemorizedMyAccount();
      if (result) {
        setHasUser(true);
      } else {
        navigate('/login');
      }
    };
    fetchData();
  }, [hasUser, navigate]);
  return hasUser;
};
