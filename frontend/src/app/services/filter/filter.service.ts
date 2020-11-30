import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient) { }

  get(){
    return this.http.get(baseURL + 'filters/filters');
  }

  getfiltered(idtag) {
    return this.http.get(baseURL + 'filters/filters_publishing/' + idtag)
  }
}
