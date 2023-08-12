import { useEffect } from 'react';

const useScreenWakeLock = () => {
  useEffect(() => {
    try {
      navigator.wakeLock.request('screen');
    } catch (err) {
      console.error(err);
    }
  }, []);
};

export default useScreenWakeLock;
