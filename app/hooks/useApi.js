import { useState } from 'react';

export default useApi = (apiFunc) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    const response = await apiFunc(...args);
    setLoading(false);

    console.log('Full API Response:', response);

    if (!response.ok) {
      console.log('API Error:', response.problem);
      setError(true);
      return;
    }

    setError(false);
    setData(response.data);
  };

  return { data, error, loading, request };
};
