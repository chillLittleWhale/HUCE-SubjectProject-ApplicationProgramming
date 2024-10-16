import { Injectable } from '@angular/core';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Conversation, Message } from './data.service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { __values } from 'tslib';


@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private stompClient: any;
  private messageSubject: BehaviorSubject<Message> = new BehaviorSubject<Message>({} as Message);
  private roomSubscriptions: StompSubscription[] = []; // Sử dụng kiểu StompSubscription

  private onlineUsersSubject: BehaviorSubject<Set<number>> = new BehaviorSubject<Set<number>>(new Set());

  private newConversationSubject: BehaviorSubject<Conversation> = new BehaviorSubject<Conversation>({} as Conversation);
  private userId: Number = -1;

  constructor() {
    
  }

  startSocket(id: Number) {
    this.userId = id;
    this.initConnectToSocket();
  }

  initConnectToSocket(){
    const url = 'http://localhost:8000/chat-socket';
    const sock = new SockJS(url);
    this.stompClient = Stomp.over(sock);

    this.stompClient.connect({}, (frame: any) => {
      console.log("WebSocket connected: userId: " + this.userId.toString(), frame);
      this.notifiOnline();
      this.subscribeToUserStatus();
      this.subscribeToNewConversations();
      this.requestOnlineUsers();           // lấy về OnlineUsers lần đầu khi đăng nhập
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  subscribeToUserStatus() {
    const subscription = this.stompClient.subscribe('/topic/user-status', (res: any) => {
      const onlineUsers = new Set<number>(JSON.parse(res.body));
      console.log('Online users:', onlineUsers);
      this.onlineUsersSubject.next(onlineUsers);
    });
  }

  subscribeToNewConversations() {
    this.stompClient.subscribe('/topic/new-conversation', (res: any) => {
      const newConversation = JSON.parse(res.body);
      console.log('New conversation:', newConversation);
      this.newConversationSubject.next(newConversation);
    });
  }
  
  subscribeToRoom(roomId: string){
    if (this.stompClient && this.stompClient.connected) {
      console.log(`Subscribing to room with ID: ${roomId}`);
      this.unsubAllRoom();
      
      const subscription = this.stompClient.subscribe(`/topic/${roomId}`, (message: any) => {
        const messageContent = JSON.parse(message.body);
        // console.log('Received message:', messageContent);
        this.messageSubject.next(messageContent);
      });

      this.roomSubscriptions.push(subscription); // Lưu trữ subscription mới
    } else {
      console.error('subscribeToRoom: WebSocket is not connected');
    }
  }
  
  sendMessage(roomId: string, message: Message){
    console.log("Sending message: " + message);
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message));
  }

  notifiyNewConversation(conversation: Conversation) {
    this.stompClient.send('/app/new-conversation', {}, JSON.stringify(conversation));
  }

  getMessageSubject(){
    return this.messageSubject.asObservable();
  }

  getOnlineUsersSubject() {
    return this.onlineUsersSubject.asObservable();
  }

  getNewConversationSubject() {
    return this.newConversationSubject.asObservable();
  }
  unsubAllRoom() {
    this.roomSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.roomSubscriptions = [];
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.notifiOffline();
      this.stompClient.disconnect();
    }
  }

  requestOnlineUsers() {
    this.stompClient.send('/app/request-online-users', {});
  }


  notifiOnline(){
    this.stompClient.send('/app/online', {}, this.userId.toString());
  }

  notifiOffline(){
    this.stompClient.send('/app/offline', {}, this.userId.toString());
  }
}
