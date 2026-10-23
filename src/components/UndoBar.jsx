// Thanh "Đã xong: ... · HOÀN TÁC" hiện vài giây sau khi tích xong, phòng khi tích nhầm.
// Vùng aria-live luôn có mặt để trình đọc màn hình đọc được khi nội dung xuất hiện.
export default function UndoBar({ item, onUndo }) {
  return (
    <div className="undo-bar" role="status" aria-live="polite">
      {item && (
        <>
          <span className="undo-text">Đã xong: <strong>{item.task}</strong></span>
          <button type="button" className="btn btn-outline btn-small" onClick={onUndo}>HOÀN TÁC</button>
        </>
      )}
    </div>
  );
}
