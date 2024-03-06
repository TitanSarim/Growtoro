// import BaseApi from 'api/BaseApi';
import { useEffect, useState } from 'react';

export default function useApi(fetchFunction, ...params) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      fetchFunction
        .bind()(...params)
        .then((res) => {
          // console.log(res);
          setData(res);
        })
        .catch((err) => setError(err))
        .finally(() => {
          setLoading(false);
        });
    }

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFunction]);

  return {
    data,
    error,
    loading,
  };
}
