import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DeadlineForm from './components/DeadlineForm.jsx';
import DeadlineList from './components/DeadlineList.jsx';
import UndoBar from './components/UndoBar.jsx';
import UrgentCard from './components/UrgentCard.jsx';
import Widget from './components/Widget.jsx';
import { useDeadlines } from './hooks/useDeadlines.js';
import { useNow } from './hooks/useNow.js';
import { pipSupported, usePipWindow, WIDGET_COMPACT_HEIGHT, WIDGET_HEIGHT } from './hooks/usePipWindow.js';
import { loadCompact, saveCompact } from './lib/storage.js';
import { byDue, countdown } from './lib/time.js';

const UNDO_MS = 5000;
const APP_TITLE = 'Deadline Radar';

export default function App() {
  const { items, add, update, toggleDone, remove } = useDeadlines();
  const now = useNow();
  const { pipWindow, open, close, resize } = usePipWindow();
  const [editingId, setEditingId] = useState(null);

  // Widget thu gọn còn 1 dòng; cửa sổ co giãn theo.
  const [compact, setCompact] = useState(loadCompact);
  const widgetHeight = (isCompact) => (isCompact ? WIDGET_COMPACT_HEIGHT : WIDGET_HEIGHT);
  const toggleCompact = () => {
    const next = !compact;
    setCompact(next);
    saveCompact(next);
    resize(widgetHeight(next));
  };

  const editing = items.find((i) => i.id === editingId) ?? null;
  const active = useMemo(() => items.filter((i) => !i.done).sort(byDue), [items]);

  // Tiêu đề tab và cửa sổ widget hiện việc gấp nhất, để liếc thanh tab hay thanh tác vụ cũng thấy.
  const title = active[0] ? `${countdown(active[0].due, now)} · ${active[0].task}` : APP_TITLE;
  useEffect(() => {
    document.title = title;
    if (pipWindow) pipWindow.document.title = title;
  }, [title, pipWindow]);

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
              Dán tin nhắn có deadline vào đây, app tự hiểu ngày giờ. Mở widget để luôn thấy việc gấp nhất khi làm việc khác.
            </p>
          </div>
          <div className="pip-box">
            {pipSupported ? (
              <button type="button" className="btn btn-outline btn-small" onClick={pipWindow ? close : () => open(widgetHeight(compact))}>
                {pipWindow ? 'ĐÓNG WIDGET' : 'MỞ WIDGET'}
              </button>
            ) : (
              <p className="note">
                Widget nổi chỉ có trên Chrome hoặc Edge ở máy tính. Trên điện thoại, hãy thêm trang này ra màn hình chính để mở nhanh như app.
              </p>
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

      {pipWindow && createPortal(<Widget active={active} now={now} onToggle={handleToggle} undoItem={undoItem} onUndo={handleUndo} compact={compact} onToggleCompact={toggleCompact} />, pipWindow.document.body)}
    </>
  );
}
