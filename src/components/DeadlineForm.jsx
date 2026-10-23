import { useEffect, useRef, useState } from 'react';
import { parseVi } from '../lib/parseVi.js';
import { defaultDue, formatDue } from '../lib/time.js';

// Giờ chọn kiểu 24 giờ (00 đến 23), vì nhiều người nhầm AM/PM trên ô giờ của trình duyệt.
const pad = (n) => String(n).padStart(2, '0');
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i));

// Hạn lưu dạng "2026-10-23T12:00"; form tách thành ngày, giờ, phút.
const splitDue = (due) => ({ date: due.slice(0, 10), hour: due.slice(11, 13), minute: due.slice(14, 16) });
const joinDue = ({ date, hour, minute }) => (date ? `${date}T${hour}:${minute}` : '');
const emptyValues = () => ({ ...splitDue(defaultDue()), task: '', where: '' });

export default function DeadlineForm({ editing, now, onSubmit, onCancel }) {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  // Hạn đã qua mà người dùng vẫn bấm lưu lần 2 thì coi như cố ý.
  const [pastConfirmed, setPastConfirmed] = useState('');
  // Ô dán tin nhắn: câu gốc và kết quả đọc câu (null khi ô trống).
  const [quick, setQuick] = useState('');
  const [understood, setUnderstood] = useState(null);
  const formRef = useRef(null);
  const quickRef = useRef(null);
  const dateRef = useRef(null);
  const taskRef = useRef(null);

  // Chỉ nạp lại form khi đổi việc đang sửa, để chữ đang gõ không bị mất khi danh sách thay đổi.
  const editingId = editing?.id ?? null;
  useEffect(() => {
    setErrors({});
    setQuick('');
    setUnderstood(null);
    if (!editing) {
      setValues(emptyValues());
      return;
    }
    setValues({ ...splitDue(editing.due), task: editing.task, where: editing.where || '' });
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    taskRef.current.focus({ preventScroll: true });
  }, [editingId]);

  const due = joinDue(values);
  const dueIsPast = Boolean(due) && new Date(due).getTime() < now;

  // Dán hoặc gõ một câu → tự điền 3 ô bên dưới; người dùng xem lại, sửa rồi mới THÊM.
  const changeQuick = (e) => {
    const text = e.target.value;
    setQuick(text);
    setErrors({});
    if (!text.trim()) {
      setUnderstood(null);
      return;
    }
    const result = parseVi(text, new Date());
    setUnderstood(result);
    setValues({ ...splitDue(result.due || defaultDue()), task: result.task, where: result.where });
  };

  const change = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    // Ngày, giờ, phút đều thuộc ô Hạn nên chung một chỗ báo lỗi.
    const field = name === 'task' ? 'task' : 'due';
    if (errors[field]) setErrors((err) => ({ ...err, [field]: '' }));
  };

  const submit = (e) => {
    e.preventDefault();
    const data = { due, task: values.task.trim(), where: values.where.trim() };
    const next = {
      due: data.due ? '' : 'Chọn ngày hết hạn nhé.',
      task: data.task ? '' : 'Ghi công việc cần làm nhé.',
    };
    setErrors(next);
    if (next.due || next.task) {
      (next.due ? dateRef : taskRef).current.focus();
      return;
    }
    // Hạn đã qua thường là chọn nhầm ngày hoặc giờ, nên hỏi lại một lần.
    const isPast = new Date(data.due).getTime() < Date.now();
    if (isPast && data.due !== editing?.due && pastConfirmed !== data.due) {
      setErrors({ due: `Hạn này đã qua. Kiểm tra lại ngày giờ, hoặc bấm ${editing ? 'LƯU' : 'THÊM'} lần nữa nếu đúng là vậy.` });
      setPastConfirmed(data.due);
      dateRef.current.focus();
      return;
    }
    setPastConfirmed('');
    onSubmit(data);
    setValues(emptyValues());
    setQuick('');
    setUnderstood(null);
    // Thêm xong quay về ô dán tin nhắn để dán việc tiếp theo.
    (editing ? dateRef : quickRef).current?.focus();
  };

  return (
    <section className="form-card" aria-labelledby="form-title" ref={formRef}>
      <h2 id="form-title">{editing ? 'Sửa deadline' : 'Thêm deadline'}</h2>
      <form onSubmit={submit} noValidate>
        {!editing && (
          <div className="field quick-field">
            <label htmlFor="f-quick">Dán tin nhắn hoặc gõ một câu</label>
            <input
              id="f-quick" type="text" maxLength={500} ref={quickRef}
              placeholder="Vd: Nộp báo cáo CSDL trước 17h thứ 6 tuần sau nhé"
              value={quick} onChange={changeQuick} aria-describedby="h-quick"
            />
            <p id="h-quick" className="field-hint">
              {!understood && 'App tự điền các ô bên dưới, bạn xem lại rồi bấm THÊM.'}
              {understood?.due && (
                <>Hiểu là: <strong>{formatDue(understood.due)}</strong>{understood.where && <> · Ở đâu: <strong>{understood.where}</strong></>}</>
              )}
              {understood && !understood.due && 'Chưa thấy hạn trong câu, hãy chọn hạn bên dưới.'}
            </p>
          </div>
        )}
        <div className="field">
          <label htmlFor="f-date">Hạn</label>
          <div className="due-inputs">
            <input
              id="f-date" name="date" type="date" ref={dateRef}
              value={values.date} onChange={change}
              aria-invalid={errors.due ? 'true' : undefined} aria-describedby="h-due e-due"
            />
            <select name="hour" value={values.hour} onChange={change} aria-label="Giờ, từ 00 đến 23">
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="due-colon" aria-hidden="true">:</span>
            <select name="minute" value={values.minute} onChange={change} aria-label="Phút">
              {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {due && (
            <p id="h-due" className={dueIsPast ? 'field-hint is-warning' : 'field-hint'}>
              {formatDue(due)}{dueIsPast && ' (đã qua)'}
            </p>
          )}
          {errors.due && <p id="e-due" className="field-error">{errors.due}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-task">Công việc</label>
          <input
            id="f-task" name="task" type="text" maxLength={120} ref={taskRef}
            placeholder="Vd: Báo cáo CSDL"
            value={values.task} onChange={change}
            aria-invalid={errors.task ? 'true' : undefined} aria-describedby="e-task"
          />
          {errors.task && <p id="e-task" className="field-error">{errors.task}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-where">Ở đâu <span className="optional">(không bắt buộc)</span></label>
          <input
            id="f-where" name="where" type="text" maxLength={300}
            placeholder="Vd: LMS, phòng A2.301"
            value={values.where} onChange={change}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{editing ? 'LƯU' : 'THÊM'}</button>
          {editing && <button type="button" className="btn-text" onClick={onCancel}>Hủy sửa</button>}
        </div>
      </form>
    </section>
  );
}
