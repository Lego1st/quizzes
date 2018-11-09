# QUIZZES
### INT3306 4 - Web application development - Project

## Mô tả

Hiện tại, những câu hỏi trắc nghiệm để kiểm tra kiến thức không còn xa lạ. Tuy nhiên hình thức tổ chức câu hỏi truyền thống gây nhàm chán và tỏ ra không hiệu quả.

Quizzes có vai trò đem đến một phương cách học không thụ động, học là tương tác.

Quizzes sẽ giúp bạn giỏi hơn ở những lĩnh vực mà nó cung cấp. Chúng tôi hướng việc đào tạo bạn trở thành người có thể học, nghĩ và giải quyết vấn đề tốt hơn.

Quizzes bao gồm rất nhiều câu hỏi với các mức độ khó dễ, được chia thành nhiều lĩnh vực khác nhau. Các câu hỏi được chọn lọc kĩ lưỡng, có hình ảnh minh họa sinh động. Người dùng với một tài khoản trên hệ thống có thể lựa chọn lĩnh vực yêu thích của mình để học tập hay giải trí.

## Chạy
Cài đặt thư viện
```sh
$ npm install
```
Bundle js
```sh
$ npm run build
```
Run server
```sh
$ python manage.py runserver
```
Bình thường khi thay đổi thì nó tự build lại, thi thoảng nó bị cache thì chạy lại cả hai cái

## Implement
Tạo component trong web_client/components/
Import vào App.js, thêm route cho component vừa tạo vào hàm render
Cập nhật url backend trong web_server/quizzes/urls

##Lưu ý: 
Sử dụng component <Link> của react để chuyển giữa các trang, ví dụ như trong component Navigation
Css để trong web_server/quizzes/static/css. Dùng file css nào thì tạo và import vào main.css
