// Chấm parseVi với bộ 20 câu mẫu (tasks/cau-mau.md). Chạy: node scripts/check-parseVi.mjs
import { parseVi } from '../src/lib/parseVi.js';

// Mốc: Thứ 6, 23/10/2026 lúc 14:00.
const NOW = new Date(2026, 9, 23, 14, 0);

// [câu, từ khóa phải có trong công việc, hạn đúng (null = không có), nơi nộp đúng ('' = không chấm)]
const SAMPLES = [
  ['Nộp báo cáo CSDL trước 17h thứ 6 tuần sau nhé', 'nộp báo cáo csdl', '2026-10-30T17:00', ''],
  ['Mai 9h họp nhóm ở phòng A2.301', 'họp nhóm', '2026-10-24T09:00', 'phòng A2.301'],
  ['Deadline slide tối nay 23h59 nha', 'slide', '2026-10-23T23:59', ''],
  ['Các em nộp bài tập chương 3 trên LMS trước ngày 30/10', 'nộp bài tập chương 3', '2026-10-30T23:59', 'LMS'],
  ['Em gửi anh file thiết kế trước 10h sáng thứ 2 nhé', 'file thiết kế', '2026-10-26T10:00', ''],
  ['Thứ 4 tuần sau 7h30 thi giữa kỳ môn Mạng máy tính', 'thi giữa kỳ môn mạng máy tính', '2026-10-28T07:30', ''],
  ['Mốt nộp tiểu luận Triết nha mọi người', 'nộp tiểu luận triết', '2026-10-25T23:59', ''],
  ['Báo cáo tuần gửi qua email cho chị trước 5h chiều nay', 'báo cáo tuần', '2026-10-23T17:00', 'email'],
  ['Hạn chót đăng ký học phần là 12h trưa ngày 2/11', 'đăng ký học phần', '2026-11-02T12:00', ''],
  ['Chiều mai 3h30 demo sprint với team', 'demo sprint với team', '2026-10-24T15:30', ''],
  ['Nộp CV cho phòng nhân sự trước cuối tuần', 'nộp cv cho phòng nhân sự', '2026-10-25T23:59', '-'],
  ['Sáng thứ 7 8h họp lớp online qua Google Meet', 'họp lớp online', '2026-10-24T08:00', 'Google Meet'],
  ['Làm xong bài lab 5 trong 3 ngày nữa nhé', 'làm xong bài lab 5', '2026-10-26T23:59', ''],
  ['Thứ 2 nộp nhật ký thực tập tuần 4', 'nộp nhật ký thực tập tuần 4', '2026-10-26T23:59', ''],
  ['17h hôm nay chốt danh sách nhóm', 'chốt danh sách nhóm', '2026-10-23T17:00', ''],
  ['Nop bai thuc hanh truoc 8h toi mai', 'nop bai thuc hanh', '2026-10-24T20:00', ''],
  ['Thuyết trình môn Kỹ năng mềm ngày 5/11 lúc 13h', 'thuyết trình môn kỹ năng mềm', '2026-11-05T13:00', ''],
  ['Gửi link Figma trong Zalo nhóm trước 9h tối nay https://figma.com/file/abc', 'gửi link figma trong zalo nhóm', '2026-10-23T21:00', 'https://figma.com/file/abc'],
  ['Ôn tập cho kỳ thi cuối kỳ', 'ôn tập cho kỳ thi cuối kỳ', null, ''],
  ['Thứ 6 này nộp bản thảo đồ án nhé', 'nộp bản thảo đồ án', '2026-10-23T23:59', ''],
];

let pass = 0;
SAMPLES.forEach(([text, key, due, where], i) => {
  const r = parseVi(text, NOW);
  const problems = [];
  if (r.due !== due) problems.push(`hạn ${r.due} ≠ ${due}`);
  if (!r.task.toLowerCase().includes(key)) problems.push(`việc "${r.task}" thiếu "${key}"`);
  if (where === '-' && r.where) problems.push(`không được có nơi nộp, ra "${r.where}"`);
  if (where && where !== '-' && r.where !== where) problems.push(`nơi nộp "${r.where}" ≠ "${where}"`);
  if (!problems.length) pass++;
  console.log(`${problems.length ? 'SAI' : 'ĐÚNG'} ${String(i + 1).padStart(2)} | ${r.task} | ${r.due ?? 'không có hạn'} | ${r.where || '—'}${problems.length ? '  ← ' + problems.join('; ') : ''}`);
});
console.log(`\nKết quả: ${pass}/${SAMPLES.length} câu đúng (mục tiêu ≥ 18)`);
process.exitCode = pass >= 18 ? 0 : 1;
