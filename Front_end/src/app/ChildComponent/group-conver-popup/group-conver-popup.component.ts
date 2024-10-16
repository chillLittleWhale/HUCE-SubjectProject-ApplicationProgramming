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
  selector: 'app-group-conver-popup',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ListboxModule, ReactiveFormsModule, FormsModule],
  templateUrl: './group-conver-popup.component.html',
  styleUrl: './group-conver-popup.component.css'
})
export class GroupConverPopupComponent {

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar) { }
  form = this.formBuilder.group({
    name: [''],
    avatar: ['']
  }); 

  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  @Input() header!: string;

  @Input() friendList: User[] = [];

  selectedFriendList: User[] = [];

  // @Output() confirm = new EventEmitter<User[]>();
  @Output() createConversation = new EventEmitter<{name: string, avatar: string, participants: number[]}>();

  onConfirm() {
    if (this.selectedFriendList.length < 2) {
      this.snackBar.open('Nhóm chat cần ít nhất 3 thành viên.', 'Close', {
        duration: 3000,
      });
      return;
    }
    const name = this.form.value.name ?? 'New Group'; // Thêm giá trị mặc định nếu name bị null hoặc undefined
    const avatar = this.form.value.avatar ?? "../../../assets/pic/add-group-chat-48.png"; // Thêm giá trị mặc định nếu avatar bị null hoặc undefined
    
    const conversation = {
      name,
      avatar,
      participants: this.selectedFriendList.map(user => user.id)
    };
    this.createConversation.emit(conversation);
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel() {
    console.log("Oncancel (): ");
    this.selectedFriendList.forEach(element => {
      console.log("element: ", element.name);
    });
    this.display = false;
    this.displayChange.emit(this.display);
  }

  // onFriendSelect(friend: User) {
  //   this.selectedFriendList.push(friend);
  // }
}
