# Deadline Radar

Website giúp sinh viên luôn thấy deadline gấp nhất ngay trên màn hình máy tính.

**Dùng thử:** https://deadline-bay.vercel.app/ (mở bằng Chrome hoặc Edge để dùng được widget)

## Vì sao tôi làm

Tôi học nhiều môn cùng lúc và deadline đến từ nhiều chỗ: LMS của trường, nhóm Zalo của lớp, lời thầy cô dặn cuối buổi. Tin nhắn mới đẩy tin cũ trôi đi, nên có lúc tôi chỉ biết mình lỡ hạn khi đã quá muộn.

Tôi thấy là vấn đề không nằm ở chỗ thiếu thông báo. Vấn đề là deadline không nằm sẵn ở chỗ mắt mình hay nhìn.

> Khi đang làm việc trên máy tính, tôi muốn luôn thấy deadline gấp nhất mà không phải mở web ra xem, để không bao giờ bị bất ngờ vì lỡ hạn.

## Tính năng

- **Nhập nhanh 3 ô:** hạn, công việc, nộp ở đâu. Giờ chọn kiểu 24 giờ nên không nhầm AM/PM.
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

## Công nghệ

React 19, Vite 7, JavaScript. Widget dùng Document Picture-in-Picture API. Cài ra màn hình chính nhờ vite-plugin-pwa (manifest + service worker). Không có backend, dữ liệu lưu bằng localStorage.

## Giới hạn

- Widget chỉ chạy trên Chrome hoặc Edge ở máy tính, và tắt khi đóng tab web.
- Trên điện thoại không có widget, cũng chưa có thông báo nhắc khi đã đóng app.
- Dữ liệu chỉ nằm trên trình duyệt đang dùng, chưa đồng bộ giữa các máy.
