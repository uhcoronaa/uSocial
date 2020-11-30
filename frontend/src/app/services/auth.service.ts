import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  loggedIn(){
    let token = localStorage.getItem('token')
    if(token){
      return true
    }
    return false
  }

  getToken() {
    return localStorage.getItem('session-token');
  }
}
