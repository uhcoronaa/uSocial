import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { baseURL } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  addnotification(body) {
    return this.http.post(baseURL + 'notification', body);
  }

  getnotification(userId) {
    return this.http.get(baseURL + 'notification/' + userId);
  }

  deletenotification(id) {
    return this.http.delete(baseURL + 'notification/' + id);
  }

  updatenotification(body) {
    return this.http.put(baseURL + 'notification', body);
  }
}
