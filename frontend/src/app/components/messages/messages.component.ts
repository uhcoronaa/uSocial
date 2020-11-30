import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from '../../services/chat/chat.service';
import { FriendsService } from '../../services/friends/friends.service';
import { User } from '../../models/user/user'
import { Message } from 'src/app/models/message/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  id_user_loggedin = "1";
  friend: User;
  message: Message;
  friends: User[] = []
  messages = []
  imgurl = "";
  constructor(private chatService: ChatService,
    private friendServices: FriendsService,
    private toastrService: ToastrService
  ) {

    this.friend = new User(0, "...", "...", '', '', '', 0, 0);
    this.id_user_loggedin = localStorage.getItem('token');
    this.message = new Message(0, 0, "", "", 0, Number(this.id_user_loggedin))
    this.friendServices.getFriends({ id_user: localStorage.getItem('token') }).subscribe((data: any) => {
      this.friends = data.data;
      console.log(this.friends);
    }, err => {
      this.toastrService.error(err.message);
    })
    this.chatService.connect({ id_user: this.id_user_loggedin });
  }

  ngOnInit(): void {
  }

  keyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  observable = false;
  selectFriend(friend: User) {
    this.messages = friend.messages;
    this.friend = friend;
    this.message.id_friendship = friend.id_friendship;
    this.message.bot = friend.bot;
    this.imgurl = friend.user_picture_location;
    this.friendServices.getMessages({ id_friendship: friend.id_friendship }).subscribe((data: any) => {
      this.messages = data.data;
      if (this.observable == false) {
        this.chatService.getNewMessage().subscribe((mess: Message) => {
          if (mess.id_friendship == this.friend.id_friendship) {
            this.messages.push(mess);
          }
          this.observable = true;
        })
      }

    }, err => {
      this.toastrService.error(err.message);
    })

  }

  sendMessage() {
    if (this.message.message != "") {
      this.message.id_user_received = this.friend.id_user;
      this.chatService.sendMessage(this.message);
      this.message.message = "";
    }
  }

}
