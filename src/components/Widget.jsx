import { countdown, urgency } from '../lib/time.js';
import DeadlineItem from './DeadlineItem.jsx';
import UndoBar from './UndoBar.jsx';
import UrgentCard from './UrgentCard.jsx';

const LIMIT = 5;

// Nội dung cửa sổ nổi: thẻ Gấp nhất và vài việc tiếp theo. `active` đã sắp theo hạn.
export default function Widget({ active, now, onToggle, undoItem, onUndo, compact, onToggleCompact }) {
  const [first, ...rest] = active;

  // Thu gọn: chỉ 1 dòng đếm ngược + tên việc, bấm vào để mở rộng.
  if (compact) {
    return (
      <button
        type="button"
        className={first ? `widget-compact is-${urgency(first.due, now)}` : 'widget-compact'}
        onClick={onToggleCompact}
        title="Bấm để mở rộng"
      >
        {first ? (
          <>
            <span className="item-when">{countdown(first.due, now)}</span>
            <span className="widget-compact-task">{first.task}</span>
          </>
        ) : (
          <span className="widget-compact-task">Hết deadline rồi</span>
        )}
      </button>
    );
  }

  const next = rest.slice(0, LIMIT - 1);
  const more = active.length - LIMIT;

  return (
    <>
      <div className="widget-bar">
        <button type="button" className="btn-text" onClick={onToggleCompact}>Thu gọn</button>
      </div>
      {first ? (
        <UrgentCard item={first} now={now} compact onToggle={onToggle} />
      ) : (
        <p className="widget-empty">Hết deadline rồi, nghỉ ngơi thôi.</p>
      )}
      {next.length > 0 && (
        <>
          <p className="widget-title">TIẾP THEO</p>
          <ul className="items">
            {next.map((item) => (
              <DeadlineItem key={item.id} item={item} now={now} compact onToggle={onToggle} />
            ))}
          </ul>
        </>
      )}
      {more > 0 && <p className="widget-more">Thêm {more} việc nữa trên trang chính</p>}
      {/* Luôn có mặt, kể cả khi vừa tích xong việc cuối cùng và widget trống. */}
      <UndoBar item={undoItem} onUndo={onUndo} />
    </>
  );
}
