import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../../shared/baseURL'

@Injectable({
  providedIn: 'root'
})
export class UpdateInfoService {

  constructor(private http: HttpClient) { }

  postImage(data: any) {
    return this.http.post(baseURL + "users/updateimage",data);
  }

  postInfo(data: any) {
    return this.http.post(baseURL + "users/updateinfo",data);
  }

  getInfo(data: any) {
    return this.http.post(baseURL + "users/getinfo", data);
  }
}
