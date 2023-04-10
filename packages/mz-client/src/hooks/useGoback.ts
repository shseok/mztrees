import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useGoBack = () => {
  const navigate = useNavigate();
  return useCallback(() => navigate(-1), [navigate]);
};
