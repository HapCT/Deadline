# Deadline Radar

Website giúp sinh viên vừa học vừa thực tập ghi lại deadline từ tin nhắn trong vài giây, rồi luôn thấy việc gấp nhất trên màn hình máy tính.

- **Dùng thử:** https://deadline-bay.vercel.app/
- **Code:** https://github.com/HapCT/Deadline

## 1. Vấn đề

Deadline của tôi đến từ nhóm Zalo, Messenger, lời thầy cô dặn và việc thực tập. Tôi không dùng app nào, chỉ nhớ trong đầu. Khi mải làm việc trên máy tính hoặc nhiều việc dồn lại, tôi quên hoặc không biết việc nào phải làm trước.

| Khoảnh khắc | Vì sao nhớ trong đầu thất bại |
|---|---|
| Nhận deadline qua tin nhắn, lời dặn | Không ghi ngay thì tin trôi, lời dặn bị quên |
| Đang làm việc khác trên máy tính | Trí nhớ không tự nhắc |
| Việc học và việc thực tập dồn lại | Không rõ việc nào gấp nhất, còn bao lâu |

## 2. Job to Be Done

> Khi đang làm việc trên máy tính với cả việc học lẫn việc thực tập, tôi muốn biết chắc việc nào phải làm tiếp và còn bao lâu, để không trễ hạn mà không phải cố nhớ.

- **Chức năng:** ghi nhanh, luôn thấy việc gấp nhất, biết còn bao lâu.
- **Cảm xúc:** nhẹ đầu vì không phải tự nhớ.
- **Xã hội:** đúng hạn với thầy cô, nhóm và người hướng dẫn thực tập.

Đối thủ thật là **nhớ trong đầu**. Tôi thấy là ghi lại phải nhanh hơn tự nhớ thì người dùng mới chịu đổi.

## 3. 3 app tham chiếu

| App | Làm tốt | Chưa có hoặc chưa tốt |
|---|---|---|
| Todoist | Ghi nhanh bằng phím tắt, sắp theo hạn và ưu tiên | Không hiểu ngày viết bằng tiếng Việt; muốn luôn thấy thì ghim cả cửa sổ app to |
| TickTick | Nhiều công cụ, ghim việc lên màn hình | Phải tự chọn việc để ghim, note không tự đổi |
| MyStudyLife | Làm riêng cho sinh viên | Phải điền form; bản miễn phí 5 việc; máy tính không có gì luôn hiện |

Không app nào hiểu deadline viết bằng tiếng Việt từ tin nhắn.

## 4. Tính năng chọn để làm tốt hơn

**Ghi deadline bằng tiếng Việt từ tin nhắn.** Dán một câu như *"Nộp báo cáo CSDL trước 17h thứ 6 tuần sau nhé"*, app tự tách việc, hạn và nơi nộp, ghi rõ "Hiểu là: Thứ 6, 30/10 lúc 17:00" để kiểm tra, nhấn Enter là lưu.

| Đo được | Kết quả |
|---|---|
| Hiểu đúng bộ 20 câu mẫu | 20/20 |
| Thao tác để ghi 1 deadline từ tin nhắn | 2 (dán, Enter), trước đây ít nhất 7 |
| Cần tài khoản, cài app | Không |

Widget tự hiện việc gấp nhất, đếm ngược và nêu bật độ gấp là nền đã có sẵn, lo Job 2 và Job 3.

## 5. Kịch bản demo (2 phút)

1. **(20 giây) Nêu vấn đề.** Mở nhóm Zalo, chỉ một tin có deadline đã bị trôi lên trên.
2. **(30 giây) Ghi bằng tin nhắn.** Copy tin đó, dán vào ô "Dán tin nhắn hoặc gõ một câu". Chỉ dòng "Hiểu là…" rồi nhấn Enter. Nhắc: Todoist không hiểu "thứ 6 tuần sau".
3. **(30 giây) Luôn thấy.** Bấm MỞ WIDGET, mở VS Code đè lên, bấm "Thu gọn". Widget còn 1 dòng ở góc màn hình, đếm ngược và tự đổi khi có việc gấp hơn.
4. **(30 giây) Sắp hết giờ.** Gõ một việc có hạn khoảng 40 phút sau giờ demo, vd lúc 15h thì gõ "Nộp nhật ký thực tập trước 15h40": viền nhấp nháy, tiêu đề tab đổi theo.
5. **(10 giây) Kết.** Quay lại câu Job: không phải cố nhớ, dán một câu là xong.

## 6. Giới hạn và bước tiếp theo

- Ô dán tin nhắn chỉ hiểu các cách viết đã có quy tắc; không tự đọc tin từ Zalo hay Messenger.
- Widget chỉ chạy trên Chrome hoặc Edge ở máy tính, và tắt khi đóng tab web.
- Dữ liệu chỉ lưu trên một máy, chưa đồng bộ.
- Bước tiếp theo tôi nghĩ là có ích: dạy ô dán hiểu thêm cách viết từ tin nhắn thật, và thêm thông báo nhắc trước hạn.

## Cách chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:5173` bằng Chrome hoặc Edge. Chấm bộ 20 câu mẫu: `node scripts/check-parseVi.mjs`.
