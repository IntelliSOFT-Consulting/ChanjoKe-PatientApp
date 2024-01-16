import { useState, useEffect } from 'react'

const UsePostRequest = (url, postData) => {
  const [data, setData] = useState(null)
  const [loading, setLoader] = useState(false)
  const [error, setError ] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://chanjoke.intellisoftkenya.com/${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error('Could not fetch data for that resource');
        }

        const result = await response.json();
        setData(result.entry);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoader(false);
      }
    };

    fetchData();

    return () => {
      // () => AbortController()
    };
  }, [url, postData]);

  return { data, loading, error }
}

export default UsePostRequest