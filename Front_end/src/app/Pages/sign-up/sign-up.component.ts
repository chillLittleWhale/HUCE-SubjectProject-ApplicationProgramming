// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { DataService, Sex, User } from '../../services/data.service';

// @Component({
//   selector: 'app-sign-up',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule, RouterLink],
//   templateUrl: './sign-up.component.html',
//   styleUrl: './sign-up.component.css'
// })
// export class SignUpComponent {

//   constructor(
//     private fb: FormBuilder,
//     private dataService: DataService,
//     private router: Router
//   ) { }

//   onSubmit() {
//     let signUpUser = { id: 0, name: "", sex: Sex.UNKNOW, email: "", password: "", folowingList: [], folowedList: [], conversationList: [], avatar: '../../../assets/pic/avatar-unknown-90.png'};
//     let name = this.signUpForm.value.name;
//     let email = this.signUpForm.value.email;
//     let password = this.signUpForm.value.password;
//     localStorage.removeItem('localUserId');

//     if (name && email && password) {
//       signUpUser.name = name;
//       signUpUser.email = email;
//       signUpUser.password =password;

//       this.dataService.addUser(signUpUser)
//         .subscribe(response => {
//           if (response.status == 201) {
//             this.router.navigate(['/login']);
//           }
//           else {
//             console.log("thất bại khi thêm mới tài khoản ở signUP");
//           }
//         })
//     }
//     else {
//       console.log("ten,email hoac pass = null")
//     }
//   }

//   signUpForm = this.fb.group({
//     name: [''],
//     email: [''],
//     password: ['']
//   });
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService, Sex, User } from '../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  signUpForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9]).+$')]]
  });

  onSubmit() {
    // if (this.signUpForm.invalid) {
    //   console.log('Form không hợp lệ');
    //   return;
    // }
    if (this.signUpForm.get('name')?.errors?.['required']) {
      this.snackBar.open('Name is required! ', 'Close', {
        duration: 2000
      });
    }
    else if (this.signUpForm.get('name')?.errors?.['minlength']) {
      this.snackBar.open('Name must be at least 1 character long', 'Close', {
        duration: 2000
      });
    }

    else if (this.signUpForm.get('email')?.errors?.['required']) {
      this.snackBar.open('Email is required! ', 'Close', {
        duration: 2000
      });
    }

    else if (this.signUpForm.get('email')?.errors?.['email']) {
      this.snackBar.open('Email is invalid! ', 'Close', {
        duration: 2000
      });
    }

    else if (this.signUpForm.get('password')?.errors?.['required']) {
      this.snackBar.open('Password is required! ', 'Close', {
        duration: 2000
      });
    }

    else if (this.signUpForm.get('password')?.errors?.['minlength']) {
      this.snackBar.open('Password must be at least 5 characters long', 'Close', {
        duration: 2000
      });
    }

    else if (this.signUpForm.get('password')?.errors?.['pattern']) {
      this.snackBar.open('Password must contain at least one letter and one number', 'Close', {
        duration: 2000
      });
    }
    if (this.signUpForm.invalid) {
      console.log('Form không hợp lệ');
      return;
    }

    let signUpUser: User = {
      id: 0,
      name: this.signUpForm.value.name!.trim(), // Trim name
      sex: Sex.UNKNOW,
      email: this.signUpForm.value.email!,
      password: this.signUpForm.value.password!,
      folowingList: [],
      folowedList: [],
      conversationList: [],
      avatar: '../../../assets/pic/avatar-unknown-90.png'
    };

    this.dataService.addUser(signUpUser)
      .subscribe(response => {
        if (response.status === 201) {
          this.router.navigate(['/login']);
        } else {
          console.log("Thất bại khi thêm mới tài khoản ở signUP");
          this.snackBar.open('Error signing up, returned status is: ' + response.status, 'Close', {
            duration: 2000
          })
        }
      }, error => {
        console.log("Đã xảy ra lỗi khi thêm tài khoản:", error);
        this.snackBar.open('Error signing up: ' + error, 'Close', {
          duration: 2000
        })
      });
  }
}
