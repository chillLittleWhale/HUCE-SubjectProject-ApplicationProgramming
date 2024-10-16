import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Conversation, DataService, Message, MessageType, User } from '../../services/data.service';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GroupConverPopupComponent } from '../../ChildComponent/group-conver-popup/group-conver-popup.component';
import { NomalConverPopupComponent } from '../../ChildComponent/nomal-conver-popup/nomal-conver-popup.component';
// import { FormatDatePipe } from '../../Pipes/format-date.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, GroupConverPopupComponent, NomalConverPopupComponent, ButtonModule, DialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  userIdNumber: number = -1;
  onlineUsers: number[] = [];

  mySelf: User | undefined;

  conversationList: Array<Conversation> = [];
  // receiverList: Array<User> = [];
  // messageList: Array<Message> = [];
  messageList: any[] = [];

  selectedConversation: Conversation | undefined;
  selectedConverName: string = 'chưa select conversation';
  selectedConverAvatar: string = '';

  displayGroupConverPopup: boolean = false;
  displayNomalConverPopup: boolean = false;
  friendList: User[] = [];
  constructor(
    private fbSearch: FormBuilder,
    private fbMessage: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    // private formatDate: FormatDatePipe
  ) { }

  ngOnInit(): void {
    this.userIdNumber = Number(this.route.snapshot.paramMap.get('userId'));

    this.dataService.getFriendList(this.userIdNumber)
      .subscribe((data: User[]) => {
        this.friendList = data;
        this.friendList.forEach(element => {
          console.log("friend: " + element.name);
        });
      });

    this.dataService.getConversationList(this.userIdNumber)
      .subscribe((data: Array<Conversation>) => {
        this.conversationList = data;
        this.conversationList.forEach(async (conversation) => {
          await this.setConversationDetails(conversation);
        });
      });

    this.dataService.getUserById(this.userIdNumber)
      .subscribe((data: User) => {
        this.mySelf = data
      });

    this.listenerMessage();
    this.listenerStatus();
    this.listenerConversation();
  }

  searchForm = this.fbSearch.group({
    search: ['']
  });

  messageForm = this.fbMessage.group({
    content: ['']
  });

  onConversationSelect(conversation: Conversation) {
    console.log("onConversationSelect() được gọi");

    this.updateSelectedConverName(conversation);
    this.updateSelectedConverAvatar(conversation);

    this.dataService.getConversationById(conversation.id)
      .subscribe((data: Conversation) => {
        console.log("onConversationSelect: getConversationById ")
        this.selectedConversation = data;

        //-----real time chat ở đây
        if (this.selectedConversation?.id !== undefined) {
          this.chatService.subscribeToRoom(this.selectedConversation.id.toString());
        } else { console.error('onConversationSelect(): Conversation ID is undefined'); }

      });

    this.dataService.getMessageList(conversation.id)
      .subscribe((data: Array<Message>) => {
        console.log("onConversationSelect: getMessageList ")
        this.messageList = data
        console.log("messageList:", this.messageList);
      });
  }

  onSendMessage() {
    let newMessage = { id: 0, senderId: 0, senderAvatar: "", content: "", timeStamp: "", type: MessageType.NOMAL };
    let content = this.messageForm.value.content;

    if (content && this.mySelf) {
      newMessage.senderId = this.mySelf.id;
      newMessage.content = content;
      newMessage.senderAvatar = this.mySelf.avatar;

      newMessage.timeStamp = this.formatDateToJavaStyle(new Date());  //right now
      console.log("sentTime:", newMessage.timeStamp);

      if (this.selectedConversation?.id !== undefined) {
        this.chatService.sendMessage(this.selectedConversation.id.toString(), newMessage);
      } else {
        console.error('onSendMessage(): Conversation ID is undefined');
        return;
      }

      this.dataService.sendMessage(newMessage)
        .subscribe(response => {
          console.log('Response:', response);

          if (response.status === 201) {
            const messageIdString: string | null = response.body;

            if (messageIdString) {
              const messageId: number = parseInt(messageIdString, 10);
              console.log('Message ID vừa được tạo:', messageId);

              if (!isNaN(messageId) && this.selectedConversation) {
                console.log("selectedConversation trước khi update:", this.selectedConversation);

                // Lấy conversation từ server để đảm bảo chúng ta có danh sách tin nhắn mới nhất
                this.dataService.getConversationById(this.selectedConversation.id)
                  .subscribe(conversation => {
                    let newConversation: Conversation = {
                      id: conversation.id,
                      groupName: conversation.groupName,
                      groupAvatar: conversation.groupAvatar,
                      participantList: [...conversation.participantList],
                      messageList: [...conversation.messageList],
                      displayName: conversation.displayName,
                      displayAvatar: conversation.displayAvatar,
                      displayStatus: conversation.displayStatus
                    };

                    newConversation.messageList.push(messageId); // thêm message id vào messageList của conversation
                    console.log("newConversation sau khi thêm message:", newConversation);

                    this.dataService.updateConversation(newConversation.id, newConversation)
                      .subscribe(updateResponse => {
                        console.log("Update success:", updateResponse);
                        console.log("selectedConversation sau khi cập nhật:", this.selectedConversation);
                      }, error => {
                        console.error('FAIL:updateConversation:', error);
                      });
                  }, error => {
                    console.error('FAIL:getConversationById:', error);
                  });
              } else {
                console.error('FAIL:sendMessage:Invalid message ID');
              }
            } else {
              console.error('FAIL:sendMessage:Invalid response body');
            }
          } else {
            console.log("FAIL:sendMessage: response.status != 201");
          }
        }, error => {
          console.error('FAIL:sendMessage:', error);
        }
        );

      this.messageForm.reset();
    }
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((message: Message) => {
      this.messageList.push(message);
      // console.log("messageList:", this.messageList);
    });
  }


  listenerStatus() {
    this.chatService.getOnlineUsersSubject().subscribe((onlineUsers: Set<number>) => {
      this.onlineUsers = Array.from(onlineUsers);

      this.conversationList.forEach(conversation => {
        this.setConversationDetails(conversation);
      });
      // console.log("onlineUsers:", this.onlineUsers);
    });
  }

  listenerConversation() {
    this.chatService.getNewConversationSubject().subscribe((newConversation: Conversation) => {
      if (newConversation.participantList.includes(this.userIdNumber)) {
        this.conversationList.push(newConversation);
        this.updateUI();
        this.conversationList.forEach(async (conversation) => {
          await this.setConversationDetails(conversation);
        });
      }
    });
  }
  updateUI() {
    this.conversationList = [...this.conversationList];
  }
  updateSelectedConverName(conver: Conversation): void {
    if (conver.groupName) {
      this.selectedConverName = conver.groupName;
      console.log("Tên: có groupName");
    } else {
      if (conver.participantList) {
        const filteredParticipantList = conver.participantList.filter(id => id !== this.userIdNumber);
        const id = filteredParticipantList[0];
        console.log("filteredParticipantList[0]:", filteredParticipantList[0]);
        console.log("id:", id);
        if (id) {
          this.dataService.getUserById(id).subscribe(res => {
            this.selectedConverName = res.name || "không lấy được name";
          });
        } else {
          this.selectedConverName = "không lấy được name";
        }
      }
    }
  }

  updateSelectedConverAvatar(conver: Conversation): void {
    if (conver.groupName) {
      this.selectedConverAvatar = '../../../assets/pic/avatar-group-100.png';
    }
    else {
      if (conver.participantList) {
        const filteredParticipantList = conver.participantList.filter(id => id !== this.userIdNumber);
        const id = filteredParticipantList[0];
        console.log("filteredParticipantList[0]:", filteredParticipantList[0]);
        console.log("id:", id);
        if (id) {
          this.dataService.getUserById(id).subscribe(res => {
            this.selectedConverAvatar = res.avatar || '../../../assets/pic/avatar-unknown-90.png';
          });
        } else {
          this.selectedConverAvatar = '../../../assets/pic/avatar-unknown-90.png';
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.chatService.unsubAllRoom();
  }

  isUserOnline(userId: number): boolean {
    return this.onlineUsers.includes(userId);
  }


  async isConversationOnline(converId: number): Promise<boolean> {
    try {
      const conversation = await this.dataService.getConversationById(converId).toPromise();
      var newConversation: Conversation = {
        id: 0,
        groupName: "",
        groupAvatar: "",
        participantList: [],
        messageList: [],
        displayName: "",
        displayAvatar: "",
      };

      if (conversation) {
        newConversation = {
          id: conversation.id,
          groupName: conversation.groupName,
          groupAvatar: conversation.groupAvatar,
          participantList: [...conversation.participantList],
          messageList: [...conversation.messageList],
          displayName: conversation.displayName,
          displayAvatar: conversation.displayAvatar,
        };
      }
      
      for (const id of newConversation.participantList) {
        if (id !== this.userIdNumber) {
          if (this.isUserOnline(id)) {
            console.log("User với id:", id, "đang online");
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking conversation online status:', error);
      return false;
    }
  }
  async setConversationDetails(conversation: Conversation) {
    // Nếu là 1 group
    if (conversation.groupName) {
      conversation.displayName = conversation.groupName;
      if(conversation.groupAvatar) {
        conversation.displayAvatar = conversation.groupAvatar;
      }
      else{
        conversation.displayAvatar = '../../../assets/pic/avatar-group-100.png'; // Đặt avatar nhóm
      }
      
    }
    else {   // nếu là cuộc hội thoại 2 người thì lấy tên và avatar của người còn lại
      const filteredParticipantList = conversation.participantList.filter(id => id !== this.userIdNumber);
      let id = filteredParticipantList[0];

      if (id) {
        this.dataService.getUserById(id).subscribe(res => {
          conversation.displayName = res.name;
          conversation.displayAvatar = res.avatar;
        });
      }
    }

    // set trạng thái 
    const isOnline = await this.isConversationOnline(conversation.id);
    conversation.displayStatus = isOnline;

    // console.log("ConversationDetail: ", conversation);
  }

  // Lắng nghe sự kiện createConversation từ GroupConverPopupComponent
  // onConfirmGroupConver(conversation: {name: string, avatar: string, participants: number[]}) {
  //   const newConversation: Conversation = {
  //     id: 0, // sẽ được backend gán ID
  //     groupName: conversation.name,
  //     groupAvatar: conversation.avatar,
  //     participantList: [this.userIdNumber, ...conversation.participants],
  //     messageList: []
  //   };
    
  //   this.dataService.createConversation(newConversation).subscribe(res => {
  //     const newConverId = res.body;
  //     if(newConverId){
  //       let newConverIdNumber = parseInt(newConverId, 10);
  //       console.log("newConverId:", newConverId);
  //       // this.conversationList.push(createdConversation);
  //       console.log('New conversation created successfully:');

  //       newConversation.participantList.forEach(participantId => {
  //         this.dataService.getUserById(participantId).subscribe(res => {
  //           let participant = res;

  //           if (participant) {
  //             participant.conversationList.push(newConverIdNumber);
  //             this.dataService.updateUser(participant.id, participant).subscribe(res => {
  //               console.log("Update user success for userId:", participant.id);
  //             });
  //           }
  //         })
  //       });
  //     }
  //   });
  // }
  onConfirmGroupConver(conversation: {name: string, avatar: string, participants: number[]}) {
    const newConversation: Conversation = {
      id: 0, // sẽ được backend gán ID
      groupName: conversation.name,
      groupAvatar: conversation.avatar,
      participantList: [this.userIdNumber, ...conversation.participants],
      messageList: []
    };
    
    this.dataService.createConversation(newConversation).subscribe(res => {
      const returnedConver = res;
      if(returnedConver){
              // Notify backend about new conversation
      this.chatService.notifiyNewConversation(returnedConver);
        // let newConverIdNumber = parseInt(returnedConver.id, 10);
        console.log("newConverId:", returnedConver.id);
        // this.conversationList.push(createdConversation);
        console.log('New conversation created successfully:');

        returnedConver.participantList.forEach(participantId => {
          this.dataService.getUserById(participantId).subscribe(res => {
            let participant = res;

            if (participant) {
              participant.conversationList.push(returnedConver.id);
              this.dataService.updateUser(participant.id, participant).subscribe(res => {
                console.log("Update user success for userId:", participant.id);
              });
            }
          })
        });
      }
    });
  }

  onConfirmNomalConver(selectedFriendId: number){
    const newConversation: Conversation = {
      id: 0, // sẽ được backend gán ID
      groupName: null,
      groupAvatar: null,
      participantList: [this.userIdNumber, selectedFriendId],
      messageList: []
    };

    this.dataService.createConversation(newConversation).subscribe(res => {
      const returnedConver = res;
      if(returnedConver){
              // Notify backend about new conversation
      this.chatService.notifiyNewConversation(returnedConver);
        // let newConverIdNumber = parseInt(returnedConver.id, 10);
        console.log("newConverId:", returnedConver.id);
        // this.conversationList.push(createdConversation);
        console.log('New conversation created successfully:');

        returnedConver.participantList.forEach(participantId => {
          this.dataService.getUserById(participantId).subscribe(res => {
            let participant = res;

            if (participant) {
              participant.conversationList.push(returnedConver.id);
              this.dataService.updateUser(participant.id, participant).subscribe(res => {
                console.log("Update user success for userId:", participant.id);
              });
            }
          })
        });
      }
    });
  }

  showGroupConverPopup(){
    console.log("Show group conver popup");
    this.displayGroupConverPopup = true;
  }

  showNomalConverPopup(){
    console.log("Show nomal conver popup");
    this.displayNomalConverPopup = true;
  }

  formatDateToJavaStyle(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Tháng bắt đầu từ 0, cần +1 và đảm bảo có 2 chữ số
    const day = ('0' + date.getDate()).slice(-2); // Đảm bảo có 2 chữ số
    const hours = ('0' + date.getHours()).slice(-2); // Đảm bảo có 2 chữ số
    const minutes = ('0' + date.getMinutes()).slice(-2); // Đảm bảo có 2 chữ số
    const seconds = ('0' + date.getSeconds()).slice(-2); // Đảm bảo có 2 chữ số
    const milliseconds = ('00' + date.getMilliseconds()).slice(-3); // Đảm bảo có 3 chữ số

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}000`;
}
}
