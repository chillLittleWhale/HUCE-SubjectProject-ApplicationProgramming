## Back End
1. Vào file "application.properties" để chỉnh lại DataBase Url của bạn.
2. Để khởi chạy backend, chuột phải vào file ChatappApplication.java rồi chọn "Run java".


## Front End
Để khởi chạy frontend, bạn chuột phải vào thư mục FrontEnd để mở Terminal hoặc tạo Terminal trước rồi cd đến Frontend sau, sau đó gõ lệnh "ng serve -o".

Frontend có sử dụng Cloudiary để upload và lưu trữ avatar. Vì vậy, bạn cần làm theo các bước sau:

1. Cài đặt Cloudinary SDK cho frontend bằng câu lệnh sau: 
    'npm install @cloudinary/angular-5.x @cloudinary/base'

2. Tạo một tài khoản Cloudinary, sau đó tạo 1 "upload preset" trong Cloudinary Console, đảm bảo upload preset này được đặt là   unsigned để có thể sử dụng trực tiếp từ frontend.

3. Vào file sau: FrontEnd > src > app > Pages > Profile > profile.component.ts

4. Sau khi vào được file trên, chỉnh lại Cloudinary upload preset và cloud name có sẵn bằng cái của bạn.
