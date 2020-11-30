import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket,
    private http: HttpClient
    ) { }

  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public connect(data: any) {
    this.socket.emit('new user', data);
  }

  public getNewMessage = () => {
    return new Observable((observer) => {
      this.socket.on('new message', (message) => {
        observer.next(message);
      });
    });
  }

  public getConversation = () => {
    return new Observable((observer) => {
      this.socket.on('get conversation', (message) => {
        observer.next(message);
      });
    });
  }
}
