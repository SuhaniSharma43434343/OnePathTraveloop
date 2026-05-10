import { useState, useEffect } from 'react';

/**
 * Fetches a Lottie JSON file from the /public folder at runtime.
 * Pass the public-relative path e.g. '/lottie/airplane.json'
 */
export default function useLottieData(publicPath) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!publicPath) return;
    fetch(publicPath)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [publicPath]);

  return data;
}
