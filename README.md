# Deadline Radar

Website giúp sinh viên vừa học vừa thực tập ghi lại deadline từ tin nhắn trong vài giây, rồi luôn thấy việc gấp nhất trên màn hình máy tính.

**Dùng thử:** https://deadline-bay.vercel.app/ (mở bằng Chrome hoặc Edge để dùng được widget)

## Vì sao tôi làm

Deadline của tôi đến từ nhóm Zalo, Messenger, lời thầy cô dặn và việc thực tập, và tôi chỉ nhớ trong đầu. Tin nhắn mới đẩy tin cũ trôi đi; mải làm việc khác là quên. Tôi thấy là ghi lại phải nhanh hơn tự nhớ thì mới bỏ được thói quen đó.

> Khi đang làm việc trên máy tính với cả việc học lẫn việc thực tập, tôi muốn biết chắc việc nào phải làm tiếp và còn bao lâu, để không trễ hạn mà không phải cố nhớ.

## Tính năng

- **Dán tin nhắn tiếng Việt:** dán một câu như "Nộp báo cáo CSDL trước 17h thứ 6 tuần sau nhé", app tự tách việc, hạn, nơi nộp; nhấn Enter là lưu. Hiểu "mai", "mốt", "thứ 6 tuần sau", "cuối tuần", "17h30", "5h chiều", "23/10", câu viết không dấu…
- **Nhập tay 3 ô** vẫn dùng được: hạn, công việc, nộp ở đâu. Giờ chọn kiểu 24 giờ nên không nhầm AM/PM.
- **Thẻ "Gấp nhất"** ở đầu trang cho việc có hạn sớm nhất.
- **Nêu bật theo độ gấp:** dưới 1 giờ thì viền vàng nhấp nháy, dưới 24 giờ thì dòng có nền vàng nhạt, dưới 3 ngày thì chữ vàng, quá hạn thì chữ đỏ.
- **Đếm ngược** kiểu "Còn 2 giờ 59 phút", tự cập nhật mỗi phút.
- **Widget nổi** luôn nằm trên cùng màn hình, tự hiện việc gấp nhất. Thu gọn được còn 1 dòng.
- **Tiêu đề tab** hiện việc gấp nhất, vd "Còn 45 phút · Báo cáo CSDL".
- **Hoàn tác** trong 5 giây nếu lỡ tích xong nhầm.
- **Dùng trên điện thoại:** thêm trang ra màn hình chính để mở như app, chạy được cả khi mất mạng.
- Không cần tài khoản. Dữ liệu lưu ngay trên trình duyệt của bạn.

## Cài ra màn hình chính điện thoại

- **Android (Chrome):** mở link dùng thử, bấm menu ⋮ rồi chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".
- **iPhone (Safari):** mở link dùng thử, bấm nút Chia sẻ rồi chọn "Thêm vào MH chính".

## Chạy trên máy

Cần Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Rồi mở `http://localhost:5173` bằng Chrome hoặc Edge.

Chấm phần đọc câu tiếng Việt bằng bộ 20 câu mẫu:

```bash
node scripts/check-parseVi.mjs
```

## Công nghệ

React 19, Vite 7, JavaScript. Widget dùng Document Picture-in-Picture API. Cài ra màn hình chính nhờ vite-plugin-pwa (manifest + service worker). Không có backend, dữ liệu lưu bằng localStorage.

## Giới hạn

- Ô dán tin nhắn chỉ hiểu các cách viết đã có quy tắc (chưa hiểu kiểu "45 phút nữa", "t6"); không tự đọc tin từ Zalo hay Messenger.
- Widget chỉ chạy trên Chrome hoặc Edge ở máy tính, và tắt khi đóng tab web.
- Trên điện thoại không có widget, cũng chưa có thông báo nhắc khi đã đóng app.
- Dữ liệu chỉ nằm trên trình duyệt đang dùng, chưa đồng bộ giữa các máy.
