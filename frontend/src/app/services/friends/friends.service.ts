import { Injectable } from '@angular/core';
import { baseURL} from '../../shared/baseURL';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FriendsService {


  constructor(
    private http: HttpClient
  ) { }

  getFriends(data: any) {
    return this.http.post(baseURL + 'friends/friends', data);
  }

  getMessages(data: any) {
    return this.http.post(baseURL + 'friends/conversation', data);
  }
}
