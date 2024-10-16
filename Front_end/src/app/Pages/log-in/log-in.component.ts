import { Component, OnInit } from '@angular/core';
import { DataService, User } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})

export class LogInComponent implements OnInit {

  constructor(
    private chatService: ChatService,
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    let email = this.logInForm.value.email;
    let password = this.logInForm.value.password;

    if (email && password) {
    this.dataService.logIn(email, password).subscribe(
      (userId: Number) => {
        if (userId !== null) {
          localStorage.setItem("localUserId", JSON.stringify(userId));      // Lưu id vào localStorage
          this.chatService.startSocket(userId);                             // Khoi tao socket
          this.router.navigate(['/home', userId]);                          // Chuyển trang
        }
      },
      error => {
        if (error.status === 400) {
          this.snackBar.open('Password is incorrect', 'Close', {
            duration: 3000
          });
        } else if (error.status === 401) {
          this.snackBar.open('User not found', 'Close', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Error logging in: ' + error.message, 'Close', {
            duration: 3000
          });
        }
      }
    );
    }
  }

  logInForm = this.fb.group({
    email: [''],
    password: ['']
  });
}
