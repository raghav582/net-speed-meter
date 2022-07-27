import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeedService {

  url: string = 'https://locate.measurementlab.net/v2/nearest/ndt/ndt7';
  
  constructor(
    private http: HttpClient
  ) { }

  getData() {
    return this.http.get(this.url);
  }

  download(link: any) {
    return this.http.get(link);
  }

  upload(link: any, data: any) {
    return this.http.post(link, data);
  }
}
