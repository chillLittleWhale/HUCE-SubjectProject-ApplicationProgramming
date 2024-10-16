import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { User } from '../../services/data.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nomal-conver-popup',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ListboxModule, ReactiveFormsModule, FormsModule],
  templateUrl: './nomal-conver-popup.component.html',
  styleUrl: './nomal-conver-popup.component.css'
})

export class NomalConverPopupComponent {

  constructor(private snackBar: MatSnackBar) { }


  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  @Input() header!: string;

  @Input() friendList: User[] = [];

  selectedFriend: User | null = null;

  // @Output() confirm = new EventEmitter<User[]>();
  @Output() createConversation = new EventEmitter<number>();

  onConfirm() {
    if (!this.selectedFriend) {
      this.snackBar.open('Cần chọn 1 người bạn để tạo cuộc trò chuyện', 'Close', {
        duration: 3000,
      });
      return;
    }
    
    // const conversationDetails = {
    //   participants: this.selectedFriendList.map(user => user.id)
    // };
    this.createConversation.emit(this.selectedFriend.id);
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel() {
    // console.log("Oncancel (): ");
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
