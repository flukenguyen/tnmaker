# TNMaker Pro – đóng gói thành file APK

Dự án này biến `src/index.html` (bản HTML cho điện thoại) thành ứng dụng Android (`.apk`)
bằng Capacitor. Việc build chạy tự động trên GitHub, bạn không cần cài Android Studio.

## Cách lấy file APK (khoảng 10 phút, miễn phí)

1. Tạo tài khoản tại https://github.com (nếu chưa có) và tạo một repository mới (để **Private** cũng được).
2. Tải **toàn bộ nội dung thư mục này** lên repository (nút *Add file → Upload files*, kéo thả tất cả,
   nhớ giữ cả thư mục ẩn `.github`).
3. Vào tab **Actions** → chọn **Build APK** → bấm **Run workflow**.
4. Đợi khoảng 5–8 phút cho đến khi có dấu tích xanh, mở lần chạy đó, kéo xuống mục **Artifacts**
   và tải **TNMaker-Pro-apk** (file nén chứa `app-debug.apk`).
5. Chép `app-debug.apk` sang điện thoại, mở lên và cài. Android sẽ hỏi cho phép
   **cài ứng dụng từ nguồn không xác định**, hãy cho phép cho trình duyệt/trình quản lý tệp bạn đang dùng.

## Khi cần sửa giao diện hoặc logic
Sửa `src/index.html`, tải lên lại repository, chạy lại workflow **Build APK** để có APK mới.

## Ghi chú
- Ứng dụng chạy **offline hoàn toàn**: Tailwind và Font Awesome được gói sẵn trong APK.
  Font Inter/JetBrains Mono không được gói, ứng dụng dùng font hệ thống của điện thoại.
- Camera: ứng dụng xin quyền camera lần đầu mở. Cả nút "Chụp ảnh phiếu" và "Camera trực tiếp" đều dùng được.
- Dữ liệu (kỳ thi, đáp án, điểm) lưu trong bộ nhớ của ứng dụng; gỡ ứng dụng hoặc xóa dữ liệu ứng dụng
  sẽ mất dữ liệu, nên xuất CSV định kỳ.
- APK này là bản **debug** (ký bằng khóa debug), dùng để cài trực tiếp. Muốn đưa lên Google Play
  cần build bản release có khóa ký riêng.
- Đổi tên/ID ứng dụng ở `capacitor.config.json` (`appName`, `appId`).

## Nếu build bị lỗi
Mở lần chạy lỗi trong tab Actions, bấm vào bước bị đỏ và gửi lại đoạn log cuối cho người hỗ trợ bạn.
