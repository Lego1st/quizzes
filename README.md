# QUIZZES
### INT3306 4 - Web application development - Project

## Mô tả

Hiện tại, những câu hỏi trắc nghiệm để kiểm tra kiến thức không còn xa lạ. Tuy nhiên hình thức tổ chức câu hỏi truyền thống gây nhàm chán và tỏ ra không hiệu quả.

Quizzes có vai trò đem đến một phương cách học không thụ động, học là tương tác.

Quizzes sẽ giúp bạn giỏi hơn ở những lĩnh vực mà nó cung cấp. Chúng tôi hướng việc đào tạo bạn trở thành người có thể học, nghĩ và giải quyết vấn đề tốt hơn.

Quizzes bao gồm rất nhiều câu hỏi với các mức độ khó dễ, được chia thành nhiều lĩnh vực khác nhau. Các câu hỏi được chọn lọc kĩ lưỡng, có hình ảnh minh họa sinh động. Người dùng với một tài khoản trên hệ thống có thể lựa chọn lĩnh vực yêu thích của mình để học tập hay giải trí.

## Hướng dẫn cài đặt
### Yêu cầu: Quizzes yêu cầu máy chủ cài Nodejs và Python 3.5+
### Cài đặt thư viện, packages: 
```sh
$ npm install

$  pip install -r requirements.txt
```
### Các bước để deploy web local:

Tại thư mục web_server chạy khởi tạo cơ sở dữ liệu: 
```sh
$ python mange.py makemigrations userprofile quizzes
$ python mange.py migrate
```
Tại thư mục gốc của project, chạy webpack để build React app frontend ra bundle js
```sh
$ npm run build
```
Tại thư mục web_server chạy 
```sh
$ python mange.py runserver
```

## Temporary Web address Ngrok
http://55efaa49.ngrok.io/
