import { useEffect, useRef, useState } from 'react';
import { byDue, group } from '../lib/time.js';
import DeadlineItem from './DeadlineItem.jsx';

const GROUPS = [
  { id: 'overdue', title: 'Quá hạn' },
  { id: 'today', title: 'Hôm nay' },
  { id: 'week', title: '7 ngày tới' },
  { id: 'later', title: 'Sau đó' },
];

export default function DeadlineList({ items, now, onToggle, onEdit, onDelete }) {
  // Bấm "Xóa" lần đầu thì hỏi lại, bấm lần nữa trong 4 giây mới xóa thật.
  const [confirmId, setConfirmId] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const askDelete = (id) => {
    clearTimeout(timer.current);
    if (confirmId === id) {
      setConfirmId(null);
      onDelete(id);
      return;
    }
    setConfirmId(id);
    timer.current = setTimeout(() => setConfirmId(null), 4000);
  };

  if (!items.length) {
    return <p className="empty">Chưa có deadline nào. Thêm việc đầu tiên ở trên nhé.</p>;
  }

  const active = items.filter((i) => !i.done).sort(byDue);
  const done = items.filter((i) => i.done).sort(byDue);
  const renderItem = (item) => (
    <DeadlineItem
      key={item.id}
      item={item}
      now={now}
      confirming={confirmId === item.id}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={askDelete}
    />
  );

  return (
    <>
      {GROUPS.map(({ id, title }) => {
        const list = active.filter((i) => group(i.due, now) === id);
        if (!list.length) return null;
        return (
          <section key={id} className="group">
            <h2>{title} <span className="count">({list.length})</span></h2>
            <ul className="items">{list.map(renderItem)}</ul>
          </section>
        );
      })}

      {!active.length && <p className="empty">Hết deadline rồi, nghỉ ngơi thôi.</p>}

      {done.length > 0 && (
        <details className="done-group">
          <summary>Đã xong <span className="count">({done.length})</span></summary>
          <ul className="items">{done.map(renderItem)}</ul>
        </details>
      )}
    </>
  );
}
