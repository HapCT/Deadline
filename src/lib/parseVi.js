// Đọc một câu tiếng Việt kiểu tin nhắn ("Nộp báo cáo trước 17h thứ 6 tuần sau nhé")
// → { task, due, where }. Viết bằng quy tắc, không thư viện, chạy ngay trên trình duyệt.
// Quy ước ở tasks/cau-mau.md: có ngày không giờ → 23:59; "chiều/tối" + giờ nhỏ → cộng 12 giờ.

const DAY = 864e5;
const pad = (n) => String(n).padStart(2, '0');
const toValue = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Bỏ dấu, viết thường, giữ nguyên độ dài để vị trí khớp với câu gốc.
function strip(s) {
  let out = '';
  for (const ch of s) {
    if (ch.length > 1) { out += ch; continue; } // ký tự ngoài BMP (emoji) giữ nguyên
    const base = ch.toLowerCase().normalize('NFD')[0];
    out += base === 'đ' ? 'd' : base;
  }
  return out;
}

const WEEKDAY = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, hai: 1, ba: 2, tu: 3, nam: 4, sau: 5, bay: 6 }; // 0 = chủ nhật như getDay()
const WEEKDAY_ACCENT = { hai: 'hai', ba: 'ba', tu: 'tư', nam: 'năm', sau: 'sáu', bay: 'bảy' };
const PERIOD_ACCENT = { sang: 'sáng', trua: 'trưa', chieu: 'chiều', toi: 'tối', dem: 'đêm' };
const PERIOD_DEFAULT = { sang: [9, 0], trua: [12, 0], chieu: [17, 0], toi: [23, 59], dem: [23, 59] };
const PLACES = 'lms|e-?mail|gmail|mail|google meet|meet|zalo|messenger|teams|google drive|drive|github|google classroom|classroom|moodle|canvas|lark';
const PREPOSITIONS = new Set(['truoc', 'luc', 'vao', 'la', 'trong', 'han', 'cho den', 'den']);
const FILLERS = ['nhé', 'nhe', 'nha', 'nhá', 'ạ', 'mọi người', 'moi nguoi', 'các em', 'cac em', 'cả lớp', 'ca lop',
  'deadline', 'hạn chót', 'han chot', 'hạn nộp', 'han nop', 'hạn', 'anh ơi', 'chị ơi', 'em ơi', 'là'];
const LEADING_ONLY = ['em', 'anh', 'chị'];

export function parseVi(input, now = new Date()) {
  const text = input.normalize('NFC').trim();
  const lower = text.toLowerCase();
  const norm = strip(text);
  const accented = norm !== lower;
  const used = new Array(text.length).fill(false);
  const mark = (start, end) => { for (let i = start; i < end; i++) used[i] = true; };
  const free = (start, end) => used.slice(start, end).every((u) => !u);
  // Câu có dấu thì phân biệt "mốt" với "một", "tối" với "tôi"…; câu không dấu thì chấp nhận.
  const looksLike = (start, word) => !accented || lower.slice(start, start + word.length) === word;
  const all = (re) => [...norm.matchAll(re)];

  let where = '';
  const url = text.match(/https?:\/\/\S+/);
  if (url) {
    where = url[0];
    mark(url.index, url.index + url[0].length);
  }
  if (!where) {
    const m = norm.match(/\b(?:o\s+)?(phong\s+[a-z]\d[\w.-]*)/d);
    if (m) {
      where = text.slice(...m.indices[1]);
      mark(m.index, m.index + m[0].length);
    }
  }
  if (!where) {
    const m = norm.match(new RegExp(`\\b(?:tren|qua|o)\\s+(${PLACES})\\b`, 'd'));
    if (m) {
      where = text.slice(...m.indices[1]);
      mark(m.index, m.index + m[0].length);
    }
  }

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const addDays = (n) => new Date(today.getTime() + n * DAY);
  let date = null;
  let isToday = false;

  // Thứ trong tuần: "thứ 6", "thứ 6 tuần sau", "thứ 6 này", "chủ nhật".
  for (const m of all(/\b(?:thu\s*([2-7]|hai|ba|tu|nam|sau|bay)|chu\s+nhat|cn)\b(\s+(?:tuan\s+(?:sau|toi|nay)|nay))?/g)) {
    if (date || !free(m.index, m.index + m[0].length)) continue;
    if (!/^(thứ|chủ|cn)/.test(lower.slice(m.index)) && accented) continue;
    if (m[1] && WEEKDAY_ACCENT[m[1]] && !looksLike(m.index + m[0].indexOf(m[1]), WEEKDAY_ACCENT[m[1]])) continue;
    const target = m[1] ? WEEKDAY[m[1]] : 0;
    const nextWeek = /tuan\s+(sau|toi)/.test(m[2] || '');
    if (nextWeek) {
      const mondayNext = addDays(7 - ((today.getDay() + 6) % 7));
      date = new Date(mondayNext.getTime() + ((target + 6) % 7) * DAY);
    } else {
      date = addDays((target - today.getDay() + 7) % 7);
    }
    mark(m.index, m.index + m[0].length);
  }

  // Ngày cụ thể: "30/10", "2/11/2026", "ngày 5 tháng 11".
  for (const m of all(/\b(?:ngay\s+)?(\d{1,2})(?:[/-](\d{1,2})(?:[/-](\d{2,4}))?|\s+thang\s+(\d{1,2}))\b/g)) {
    if (date || !free(m.index, m.index + m[0].length)) continue;
    const day = Number(m[1]);
    const month = Number(m[2] || m[4]);
    if (!month || month > 12 || day > 31) continue;
    let year = m[3] ? Number(m[3].length === 2 ? `20${m[3]}` : m[3]) : today.getFullYear();
    let d = new Date(year, month - 1, day);
    if (!m[3] && d < today) d = new Date(year + 1, month - 1, day);
    date = d;
    mark(m.index, m.index + m[0].length);
  }

  // Ngày tương đối: "hôm nay", "mai", "mốt", "cuối tuần", "3 ngày nữa".
  const relative = [
    [/\bhom\s+nay\b/g, 'hôm nay', () => 0],
    [/\bngay\s+mai\b/g, 'ngày mai', () => 1],
    [/\bngay\s+kia\b/g, 'ngày kia', () => 2],
    [/\bmai\b/g, 'mai', () => 1],
    [/\bmot\b/g, 'mốt', () => 2],
    [/\bcuoi\s+tuan\b/g, 'cuối tuần', () => (7 - today.getDay()) % 7],
    [/\b(?:trong\s+)?(\d{1,3})\s+ngay\s+nua\b/g, null, (m) => Number(m[1])],
  ];
  for (const [re, word, days] of relative) {
    for (const m of all(re)) {
      if (date || !free(m.index, m.index + m[0].length)) continue;
      if (word && !looksLike(m.index, word)) continue;
      date = addDays(days(m));
      isToday = days(m) === 0;
      mark(m.index, m.index + m[0].length);
    }
  }

  // Buổi trong ngày: "sáng", "chiều nay", "tối nay"…
  let period = null;
  for (const m of all(/\b(sang|trua|chieu|toi|dem)\b(\s+nay\b)?/g)) {
    if (period || !free(m.index, m.index + m[0].length)) continue;
    if (!looksLike(m.index, PERIOD_ACCENT[m[1]])) continue;
    period = m[1];
    if (m[2]) isToday = true;
    mark(m.index, m.index + m[0].length);
  }

  // Giờ: "17h", "23h59", "7h30", "17:30", "5 giờ".
  let time = null;
  for (const m of all(/\b(\d{1,2})\s*(?:h|g|gio|:)\s*(\d{2})?(?:\s*phut)?\b/g)) {
    if (time || !free(m.index, m.index + m[0].length)) continue;
    let h = Number(m[1]);
    const min = Number(m[2] || 0);
    if (h > 23 || min > 59) continue;
    if (period && ['chieu', 'toi', 'dem'].includes(period) && h < 12) h += 12;
    if (period === 'trua' && h <= 3) h += 12;
    time = [h, min];
    mark(m.index, m.index + m[0].length);
  }

  // Bỏ cả giới từ đứng ngay trước phần ngày giờ, nơi nộp ("trước", "lúc", "là"…).
  for (let i = 1; i < text.length; i++) {
    if (!used[i] || used[i - 1]) continue;
    const before = norm.slice(0, i).trimEnd();
    for (const p of PREPOSITIONS) {
      if (before.endsWith(p) && !/[a-z0-9]/.test(before.charAt(before.length - p.length - 1) || ' ')) {
        mark(before.length - p.length, i);
        break;
      }
    }
  }

  let due = null;
  if (!date && (time || period || isToday)) date = new Date(today);
  if (date) {
    const [h, min] = time || PERIOD_DEFAULT[period] || [23, 59];
    date.setHours(h, min, 0, 0);
    due = toValue(date);
  }

  let task = text.split('').filter((_, i) => !used[i]).join('').replace(/\s+/g, ' ').trim();
  task = cleanTask(task);
  return { task, due, where };
}

// Bỏ từ đệm ở đầu và cuối câu, dấu câu thừa, viết hoa chữ đầu.
function cleanTask(s) {
  let prev;
  do {
    prev = s;
    s = s.replace(/^[\s,.:;!\-–]+|[\s,.:;!\-–]+$/g, '');
    for (const w of [...FILLERS, ...LEADING_ONLY]) {
      if (new RegExp(`^${w}(?=\\s|$)`, 'iu').test(s)) s = s.slice(w.length);
    }
    for (const w of FILLERS) {
      const re = new RegExp(`\\s${w}$`, 'iu');
      if (re.test(s)) s = s.replace(re, '');
    }
    s = s.trim();
  } while (s !== prev);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
