import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DeadlineForm from './components/DeadlineForm.jsx';
import DeadlineList from './components/DeadlineList.jsx';
import UndoBar from './components/UndoBar.jsx';
import UrgentCard from './components/UrgentCard.jsx';
import Widget from './components/Widget.jsx';
import { useDeadlines } from './hooks/useDeadlines.js';
import { useNow } from './hooks/useNow.js';
import { pipSupported, usePipWindow } from './hooks/usePipWindow.js';
import { byDue } from './lib/time.js';

const UNDO_MS = 5000;

export default function App() {
  const { items, add, update, toggleDone, remove } = useDeadlines();
  const now = useNow();
  const { pipWindow, open, close } = usePipWindow();
  const [editingId, setEditingId] = useState(null);

  const editing = items.find((i) => i.id === editingId) ?? null;
  const active = useMemo(() => items.filter((i) => !i.done).sort(byDue), [items]);

  const handleSubmit = (data) => {
    if (editingId) {
      update(editingId, data);
      setEditingId(null);
    } else {
      add(data);
    }
  };

  // Việc vừa tích xong, để hiện thanh Hoàn tác trong 5 giây.
  const [undoItem, setUndoItem] = useState(null);
  const undoTimer = useRef(null);
  useEffect(() => () => clearTimeout(undoTimer.current), []);

  const hideUndo = () => {
    clearTimeout(undoTimer.current);
    setUndoItem(null);
  };

  // Mọi chỗ tích xong (danh sách, thẻ Gấp nhất, widget) đều đi qua đây.
  const handleToggle = (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    toggleDone(id);
    if (item.done) {
      // Bỏ tích thì không cần hoàn tác; nếu đang hiện thanh cho chính việc này thì ẩn đi.
      if (undoItem?.id === id) hideUndo();
      return;
    }
    clearTimeout(undoTimer.current);
    setUndoItem({ id, task: item.task });
    undoTimer.current = setTimeout(() => setUndoItem(null), UNDO_MS);
  };

  // Đặt thẳng done: false thay vì đảo, để không tích lại việc đã được bỏ tích bằng tay.
  const handleUndo = () => {
    if (undoItem) update(undoItem.id, { done: false });
    hideUndo();
  };

  const handleDelete = (id) => {
    remove(id);
    if (id === editingId) setEditingId(null);
    if (id === undoItem?.id) hideUndo();
  };

  return (
    <>
      <header className="top">
        <div className="wrap top-inner">
          <div>
            <p className="eyebrow">DEADLINE RADAR</p>
            <h1>Deadline gấp nhất, luôn ở trước mắt</h1>
            <p className="lead">
              Ghi hạn nộp vào đây rồi mở widget. Widget nằm trên màn hình, liếc qua là biết việc nào cần làm trước.
            </p>
          </div>
          <div className="pip-box">
            {pipSupported ? (
              <button type="button" className="btn btn-outline btn-small" onClick={pipWindow ? close : open}>
                {pipWindow ? 'ĐÓNG WIDGET' : 'MỞ WIDGET'}
              </button>
            ) : (
              <p className="note">Widget nổi chỉ chạy trên Chrome hoặc Edge bản mới. Trang này vẫn dùng bình thường.</p>
            )}
          </div>
        </div>
      </header>

      <main className="wrap">
        <UrgentCard item={active[0]} now={now} onToggle={handleToggle} />
        <DeadlineForm editing={editing} now={now} onSubmit={handleSubmit} onCancel={() => setEditingId(null)} />
        <section className="list" aria-live="polite">
          <DeadlineList items={items} now={now} onToggle={handleToggle} onEdit={setEditingId} onDelete={handleDelete} />
        </section>
      </main>

      <UndoBar item={undoItem} onUndo={handleUndo} />

      {pipWindow && createPortal(<Widget active={active} now={now} onToggle={handleToggle} undoItem={undoItem} onUndo={handleUndo} />, pipWindow.document.body)}
    </>
  );
}
