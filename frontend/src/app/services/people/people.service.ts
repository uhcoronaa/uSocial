import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { baseURL } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }

  getpeople(userId) {
    return this.http.get(baseURL + 'people/' + userId);
  }

  getuserinfo(userId)
  {
    return this.http.get(baseURL + 'users/getuserinfo/' + userId);
  }
}
