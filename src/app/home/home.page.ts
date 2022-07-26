import { Component } from '@angular/core';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SpeedService } from '../services/speed.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  downloadSpeed: string;
  uploadSpeed: string;

  constructor(
    private localNotifications: LocalNotifications,
    private speedService: SpeedService
  ) { }

  ngOnInit() {
    this.downloadSpeed = navigator.connection['downlink'] + ' MB/s';
    this.uploadSpeed = navigator.connection['uplink'] + ' MB/s';
    this.localNotifications.schedule({
      id: 1,
      text: 'Donwload:' + this.downloadSpeed,
      sticky: true,
      smallIcon: 'assets/icon/baseline_swap_vert_black_24dp.png',
      title: ''
    });
  }

  async start() {
    const startTime = Date.now();
    let img = new Image();
    img.onload = function () {console.log("onload")};
    img.onerror = function() {console.log("onerror")};
    img.src = "http://www.google.co.in/?gfe_rd=cr&ei=1wIjWPqZA6DmugSY4I-IDw";
    const endTime = Date.now();
    console.log(endTime - startTime);
  }
}
