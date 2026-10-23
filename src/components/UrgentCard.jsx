import { countdown, formatDue, urgency } from '../lib/time.js';
import { Where } from './DeadlineItem.jsx';

// Thẻ lớn cho việc chưa xong có hạn sớm nhất.
export default function UrgentCard({ item, now, compact, onToggle }) {
  if (!item) return null;

  return (
    <section className={`urgent-card is-${urgency(item.due, now)}${compact ? ' is-compact' : ''}`} aria-label="Việc gấp nhất">
      <div className="urgent-body">
        <p className="eyebrow">GẤP NHẤT</p>
        <p className="urgent-when">{countdown(item.due, now)}</p>
        <p className="urgent-task">{item.task}</p>
        {(item.where || !compact) && (
          <p className="item-meta">
            {item.where && <Where text={item.where} />}
            {!compact && <span className="item-due">Hạn: {formatDue(item.due)}</span>}
          </p>
        )}
      </div>
      <button type="button" className="btn btn-outline btn-small" onClick={() => onToggle(item.id)}>
        ĐÃ XONG
      </button>
    </section>
  );
}
