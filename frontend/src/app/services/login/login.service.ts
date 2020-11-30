import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { baseURL } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginPerUser(user: any){
    return this.http.post(baseURL+'users/login', user);
  }
}
