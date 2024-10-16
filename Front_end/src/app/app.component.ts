import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Front_end';

  constructor(private chatService: ChatService) { } // tạo chatService ngay khi vào localhost:4200

  @HostListener('window:beforeunload', ['$event'])  //bắt các sự kiện người dùng đóng tab hay thoát trang
  unloadHandler(event: Event) {
    this.chatService.disconnect();
  }
}
