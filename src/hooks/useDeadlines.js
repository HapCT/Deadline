import { useCallback, useEffect, useState } from 'react';
import { KEY, load, save } from '../lib/storage.js';

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function useDeadlines() {
  const [items, setItems] = useState(load);

  useEffect(() => save(items), [items]);

  // Mở 2 tab thì tab kia cũng cập nhật theo.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setItems(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((data) => {
    setItems((list) => [...list, { id: newId(), ...data, done: false, createdAt: new Date().toISOString() }]);
  }, []);

  const update = useCallback((id, data) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...data } : i)));
  }, []);

  const toggleDone = useCallback((id) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }, []);

  const remove = useCallback((id) => {
    setItems((list) => list.filter((i) => i.id !== id));
  }, []);

  return { items, add, update, toggleDone, remove };
}
