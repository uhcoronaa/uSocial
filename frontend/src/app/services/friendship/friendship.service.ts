import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { baseURL } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(private http: HttpClient) { }

  updatefriendship(body) {
    return this.http.put(baseURL + 'friendship', body);
  }

  addfriendship(body) {
    return this.http.post(baseURL + 'friendship', body);
  }

  getfriendship(id) {
    return this.http.get(baseURL + 'people/friendship/' + id);
  }
}
