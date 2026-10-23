import { useEffect, useState } from 'react';
import { MINUTE } from '../lib/time.js';

// Thời gian hiện tại, cập nhật mỗi phút và khi quay lại tab, để đếm ngược luôn đúng.
export function useNow() {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    const timer = setInterval(tick, MINUTE);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return now;
}
