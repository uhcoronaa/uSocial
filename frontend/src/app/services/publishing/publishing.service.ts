import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class PublishingService {

  constructor(private http: HttpClient) { }

  postPublishing(data: any) {
    return this.http.post(baseURL + 'publishings/publish', data);
  }

  getPublishings(data: any) {
    return this.http.post(baseURL + 'publishings/publishings', data);
  }
}
