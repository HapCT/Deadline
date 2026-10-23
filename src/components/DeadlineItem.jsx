import { countdown, formatDue, formatDueShort, urgency } from '../lib/time.js';

// "Ở đâu" là link thì bấm mở được ở tab mới, còn lại hiện như chữ.
export function Where({ text }) {
  if (/^https?:\/\/\S+$/i.test(text)) {
    return (
      <span className="item-where">
        <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>
      </span>
    );
  }
  return <span className="item-where">{text}</span>;
}

export default function DeadlineItem({ item, now, compact, confirming, onToggle, onEdit, onDelete }) {
  const level = item.done ? 'done' : urgency(item.due, now);

  return (
    <li className={`item is-${level}`}>
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item.id)}
        aria-label={item.done ? `Bỏ đánh dấu xong: ${item.task}` : `Đánh dấu xong: ${item.task}`}
      />
      {/* Hàng 1: đếm ngược và công việc. Hàng 2: ở đâu và hạn (widget: hạn ngắn đứng trước). */}
      <div className="item-body">
        <p className="item-line">
          <span className="item-when">{item.done ? 'Đã xong' : countdown(item.due, now)}</span>
          <span className="item-task">{item.task}</span>
        </p>
        <p className="item-meta">
          {compact ? (
            <>
              <span className="item-due">{formatDueShort(item.due)}</span>
              {item.where && <Where text={item.where} />}
            </>
          ) : (
            <>
              {item.where && <Where text={item.where} />}
              <span className="item-due">Hạn: {formatDue(item.due)}</span>
            </>
          )}
        </p>
      </div>
      {!compact && (
        <div className="item-actions">
          <button type="button" className="btn-text" onClick={() => onEdit(item.id)}>Sửa</button>
          <button
            type="button"
            className={confirming ? 'btn-text is-danger' : 'btn-text'}
            onClick={() => onDelete(item.id)}
          >
            {confirming ? 'Bấm lần nữa để xóa' : 'Xóa'}
          </button>
        </div>
      )}
    </li>
  );
}
