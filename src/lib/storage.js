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
