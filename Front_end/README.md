# FrontEnd
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

## Development server
Run `ng serve -o` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Lưu ý
Frontend có sử dụng Cloudiary để upload và lưu trữ avatar. Vì vậy, bạn cần làm theo các bước sau:

1. Cài đặt Cloudinary SDK cho frontend bằng câu lệnh sau: 
    'npm install @cloudinary/angular-5.x @cloudinary/base'

2. Tạo một tài khoản Cloudinary, sau đó tạo 1 "upload preset" trong Cloudinary Console, đảm bảo upload preset này được đặt là   unsigned để có thể sử dụng trực tiếp từ frontend.

3. Vào file sau: FrontEnd > src > app > Pages > Profile > profile.component.ts

4. Sau khi vào được file trên, chỉnh lại Cloudinary upload preset và cloud name có sẵn bằng cái của bạn.



