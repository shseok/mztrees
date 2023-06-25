import { useCallback, useEffect, useState } from 'react';

interface FetchProps<T> {
  getDataFunc: () => Promise<T>;
}

export const useFetch = <T>({ getDataFunc }: FetchProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const res = await getDataFunc();
      setData(res);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }

      setLoading(false); // 중복?
    } finally {
      setLoading(false);
    }
  }, [getDataFunc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading };
};

export default useFetch;
