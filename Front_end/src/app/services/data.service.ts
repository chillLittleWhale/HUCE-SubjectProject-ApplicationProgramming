import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  rootURL = "http://localhost:8000";
  constructor(private http: HttpClient) { }
  // User------------------------------------------------------------------------------------------------------
  getUserList(): Observable<Array<User>> {
    return this.http.get<Array<User>>(this.rootURL + "/user/all");
  }

  getUserById(id: any): Observable<User> {
    return this.http.get<User>(`${this.rootURL}/user/${id}`);
  }


  addUser(user: User) {
    return this.http.post<Response>(`${this.rootURL}/user`, user,
      {
        observe: 'response' // trả về một Observable của HttpResponse thay vì dữ liệu thô từ response body. HttpResponse chứa thông tin về phản hồi HTTP như mã trạng thái, headers và thân của phản hồi
      }
    );
  }

  updateUser(id: any, user: User) {
    return this.http.put(`${this.rootURL}/user/${id}`, user);
  }

  // deleteUser(Userid: any) {
  //   return this.http.delete(this.rootURL + "/User/" + Userid);
  // }

  getFriendList(userId: any): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.rootURL}/user/getFriendList/${userId}`);
  }
  getFollowingList(userId: any): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.rootURL}/user/getFollowingList/${userId}`);
  }
  getFollowedList(userId: any): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.rootURL}/user/getFollowedList/${userId}`);
  }
  getConversationList(userId: any): Observable<Array<Conversation>> {
    return this.http.get<Array<Conversation>>(`${this.rootURL}/user/getConversationList/${userId}`);
  }

  logIn(email: string, password: string): Observable<Number> {
    return this.http.get<Number>(`${this.rootURL}/user/login?email=${email}&password=${password}`);
  }

  findUserByEmail(email: string): Observable<HttpResponse<User>> {
    // return this.http.get<HttpResponse<User>>(`${this.rootURL}/user/searchByEmail`, email);
    const params = new HttpParams().set('email', email);
    return this.http.get<User>(`${this.rootURL}/user/searchByEmail`, { params, observe: 'response' });
  }
  
  // Conversation-----------------------------------------------------------------------------------------------------

  getConversationById(id: any): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.rootURL}/conversation/${id}`);
  }

  getMessageList(converId: any): Observable<Array<Message>> {
    return this.http.get<Array<Message>>(`${this.rootURL}/conversation/getMessageList/${converId}`);
  }

  updateConversation(id: any, conversation: Conversation) {
    return this.http.put(`${this.rootURL}/conversation/${id}`, conversation);
  }

  // createConversation(conversation: Conversation): Observable<HttpResponse<string>> {
  //   return this.http.post<string>(`${this.rootURL}/conversation`, conversation, { observe: 'response' });
  // }
  createConversation(conversation: Conversation): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.rootURL}/conversation`, conversation);
  }

  // Message  -------------------------------------------------------------------------------------------------------
  sendMessage(message: Message): Observable<HttpResponse<string>> {
    return this.http.post<string>(`${this.rootURL}/message`, message, { observe: 'response' });
  }
  
}

export interface User {
  id: number,
  name: string,
  sex: Sex,
  email: string,
  password: string,
  folowingList: number[],
  folowedList: number[],
  conversationList: number[],
  avatar: string,
}

export interface Conversation {
  id: number,
  groupName: string | null,   
  groupAvatar: string | null,
  participantList: number[],
  messageList: number[],
  displayName?: string,         //----v3
  displayAvatar?: string,    //----v3
  displayStatus?: boolean    //----v3, các thuộc tính ? có nghĩa là nó không bắt buộc, không lưu vào db
}

export interface Message {
  id: number,
  senderId: number,
  senderAvatar: string,         //----v3
  content: string,
  timeStamp: string,
  type: MessageType
}

// export enum Sex {
//   UNKNOW,
//   MALE,
//   FEMALE
// }
export enum Sex {
  UNKNOW = "UNKNOW",
  MALE = "MALE",
  FEMALE = "FEMALE"
}


export enum MessageType {
  NOMAL,
  DELETED,
  EDITED,
  FORWARDED
}