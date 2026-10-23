export const MINUTE = 6e4;
export const HOUR = 36e5;
export const DAY = 864e5;

const WEEKDAYS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const pad = (n) => String(n).padStart(2, '0');
const toTime = (due) => new Date(due).getTime();

export const byDue = (a, b) => toTime(a.due) - toTime(b.due);

export function countdown(due, now) {
  const diff = toTime(due) - now;
  const abs = Math.abs(diff);
  let amount;
  if (abs < HOUR) {
    amount = `${Math.max(1, Math.floor(abs / MINUTE))} phút`;
  } else if (abs < DAY) {
    // Kèm số phút, vì làm tròn xuống "2 giờ" khi còn 2 giờ 59 phút dễ gây hiểu nhầm.
    const hours = Math.floor(abs / HOUR);
    const minutes = Math.floor((abs % HOUR) / MINUTE);
    amount = minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`;
  } else {
    const days = Math.floor(abs / DAY);
    const hours = Math.floor((abs % DAY) / HOUR);
    // Kèm số giờ, vì làm tròn xuống "5 ngày" khi còn 5 ngày 23 giờ dễ gây hiểu nhầm.
    amount = hours > 0 ? `${days} ngày ${hours} giờ` : `${days} ngày`;
  }
  return diff < 0 ? `Quá hạn ${amount}` : `Còn ${amount}`;
}

// Nhóm hiển thị: Quá hạn, Hôm nay, 7 ngày tới, Sau đó.
export function group(due, now) {
  const t = toTime(due);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  if (t < now) return 'overdue';
  if (t < today.getTime() + DAY) return 'today';
  if (t < today.getTime() + 8 * DAY) return 'week';
  return 'later';
}

// Mức nêu bật: quá hạn, dưới 24 giờ, dưới 3 ngày, bình thường.
export function urgency(due, now) {
  const diff = toTime(due) - now;
  if (diff < 0) return 'overdue';
  if (diff < DAY) return 'urgent';
  if (diff < 3 * DAY) return 'soon';
  return 'normal';
}

export function formatDue(due) {
  const d = new Date(due);
  const year = d.getFullYear() !== new Date().getFullYear() ? `/${d.getFullYear()}` : '';
  return `${WEEKDAYS[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}${year} lúc ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Bản ngắn cho widget, vd "23:59 T6, 23/10".
const WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export function formatDueShort(due) {
  const d = new Date(due);
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${WEEKDAYS_SHORT[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

export function toInputValue(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Mặc định 23:59 hôm nay, đã qua thì 23:59 ngày mai.
export function defaultDue() {
  const d = new Date();
  d.setHours(23, 59, 0, 0);
  if (d <= new Date()) d.setDate(d.getDate() + 1);
  return toInputValue(d);
}
