import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { basepath, downlod_five_hundred_kb, downlod_five_kb, downlod_five_mb, downlod_hundred_kb, downlod_one_kb, downlod_one_mb, ping, upload } from '../constant/api.urls';

@Injectable({
  providedIn: 'root'
})
export class SpeedService {

  constructor(
    private http: HttpClient
  ) { }

  ping() {
    return this.http.get(ping);
  }

  downloadOneKb() {
    return this.http.get(basepath + downlod_one_kb);
  }

  downloadFiveKb() {
    return this.http.get(basepath + downlod_five_kb);
  }

  downloadHundredKb() {
    return this.http.get(basepath + downlod_hundred_kb);
  }

  downloadFiveHundredKb() {
    return this.http.get(basepath + downlod_five_hundred_kb);
  }

  downloadOneMb() {
    return this.http.get(basepath + downlod_one_mb);
  }

  downloadFiveMb() {
    return this.http.get(basepath + downlod_five_mb);
  }

  upload(data) {
    return this.http.post(basepath + upload, data);
  }
}
