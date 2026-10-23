export const KEY = 'deadline-radar:v1';

// Trình duyệt chặn localStorage thì app vẫn chạy, chỉ không nhớ dữ liệu.
export function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function save(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

// Widget đang thu gọn hay không, để lần mở sau giữ nguyên.
const COMPACT_KEY = 'deadline-radar:widget-compact';

export function loadCompact() {
  try {
    return localStorage.getItem(COMPACT_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveCompact(compact) {
  try {
    localStorage.setItem(COMPACT_KEY, compact ? '1' : '0');
  } catch {}
}
