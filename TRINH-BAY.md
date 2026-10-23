# Deadline Radar

Website giúp sinh viên luôn thấy deadline gấp nhất ngay trên màn hình máy tính.

- **Dùng thử:** https://deadline-bay.vercel.app/
- **Code:** https://github.com/HapCT/Deadline

## 1. Vấn đề

Tôi học nhiều môn cùng lúc và deadline đến từ nhiều chỗ: LMS của trường, nhóm Zalo của lớp, lời thầy cô dặn cuối buổi. Không có chỗ nào gom hết lại.

Thông báo thì có, nhưng tin nhắn mới đẩy tin cũ trôi đi. Muốn biết việc nào gấp thì phải mở từng chỗ ra xem, mà lúc đang bận thì tôi không nhớ để mở. Nên có lúc tôi chỉ biết mình lỡ hạn khi đã quá muộn.

## 2. Job to Be Done

> Khi đang làm việc trên máy tính, tôi muốn luôn thấy deadline gấp nhất mà không phải mở web ra xem, để không bao giờ bị bất ngờ vì lỡ hạn.

- **Việc cần làm:** biết ngay việc nào phải làm trước, còn bao lâu nữa.
- **Cảm xúc:** bớt lo, không có cảm giác "hình như mình quên gì đó".
- **Với người khác:** nộp bài đúng hạn, không phải nhắn xin thầy cô hay nhóm thêm thời gian.

## 3. Vì sao các cách hiện có chưa đủ

| Cách đang dùng | Chỗ chưa ổn |
|---|---|
| Nhóm Zalo, tin nhắn | Tin bị trôi, phải cuộn lên tìm |
| Ghi chú, lịch điện thoại | Phải nhớ mở ra xem, và chỉ báo một lần lúc tới giờ |
| LMS của trường | Chỉ có bài của LMS, không có việc thầy cô dặn miệng hay việc nhóm |

Tôi thấy là vấn đề không nằm ở chỗ thiếu thông báo. Vấn đề là deadline không nằm sẵn ở chỗ mắt mình hay nhìn.

## 4. Website giải quyết thế nào

| Tính năng | Giúp được gì cho Job |
|---|---|
| Form 3 ô: Hạn, Công việc, Ở đâu | Gom deadline từ mọi nguồn vào 1 chỗ, nhập trong vài giây |
| Giờ chọn kiểu 24 giờ, có dòng ghi lại giờ đã chọn | Không nhầm 12 giờ trưa với nửa đêm. Chọn giờ đã qua thì được hỏi lại |
| Thẻ "Gấp nhất" ở đầu trang | Mở ra là thấy ngay việc cần làm trước |
| Nêu bật theo độ gấp | Dưới 24 giờ thì dòng có nền vàng nhạt, dưới 3 ngày thì chữ vàng, quá hạn thì chữ đỏ. Liếc qua là biết |
| Đếm ngược "Còn 2 giờ 59 phút" | Hiểu ngay còn bao lâu, không phải tự tính từ ngày giờ |
| Widget nổi luôn nằm trên màn hình | Không cần nhớ mở web. Đang làm việc khác vẫn thấy deadline ở góc màn hình |
| Ô "Ở đâu" bấm được nếu là link | Bấm một cái là tới đúng trang nộp bài |
| Thanh "Hoàn tác" 5 giây sau khi tích xong | Lỡ tích nhầm thì lấy lại ngay, ở cả trang chính lẫn widget |
| Lưu trên máy, không cần tài khoản | Mở là dùng được ngay |

## 5. Kịch bản demo (2 phút)

1. **(20 giây) Nêu vấn đề.** Mở nhóm Zalo lớp, cuộn tìm một deadline cũ để thấy tin bị trôi.
2. **(30 giây) Thêm deadline.** Nhập "Báo cáo CSDL", chọn giờ 23:59 tối nay, ở đâu là link LMS. Việc mới hiện lên với nền vàng nhạt vì còn dưới 24 giờ.
3. **(30 giây) Nêu bật.** Chỉ vào thẻ "Gấp nhất" và các mức màu: quá hạn đỏ, dưới 24 giờ nền vàng, dưới 3 ngày chữ vàng.
4. **(30 giây) Widget.** Bấm "Mở widget", kéo widget ra góc màn hình, rồi mở Word hay VS Code. Widget vẫn nằm trên cùng. Tích xong một việc trong widget thì trang chính cũng đổi theo.
5. **(10 giây) Kết.** Quay lại câu Job: không cần nhớ mở web, deadline luôn ở trước mắt.

## 6. Giới hạn và bước tiếp theo

- Widget chỉ chạy trên Chrome hoặc Edge bản mới, và tắt khi đóng tab web.
- Dữ liệu chỉ lưu trên một máy, chưa đồng bộ sang điện thoại.
- Bước tiếp theo tôi nghĩ là có ích: gói thành app desktop để widget tự bật khi mở máy, và cho nhập nhanh bằng một dòng chữ như "Báo cáo CSDL thứ 6 tuần sau".

## Cách chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:5173` bằng Chrome hoặc Edge.
