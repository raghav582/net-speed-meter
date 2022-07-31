import { Component } from '@angular/core';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SpeedService } from '../services/speed.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';
import { Platform } from '@ionic/angular';
import { fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isCalc = false;
  isNetworkConnected = true;
  averageSpeed: string = 'not calculated. Press start.';
  speed: string;
  progress: number = 0;

  constructor(
    private statusBar: StatusBar,
    private speedService: SpeedService,
    private network: Network,
    private toast: Toast,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.watchNetwork();
    })
    
    // this.start();
  }

  watchNetwork() {
    console.log("watchNetwork")

    if(navigator.onLine) {
      this.isNetworkConnected = true;
      this.start();
    } else {
      this.isNetworkConnected = false;
    }

    window.addEventListener('online', async (event) => {
      console.log('online', event);
      this.isNetworkConnected = true;
      await new Promise((r) => setTimeout(r, 3000));
      this.start();
    });

    window.addEventListener('offline', (event) => {
      console.log('offline', event);
      this.isNetworkConnected = false;
    });
  }

  async start() {
    console.log('called start')
    this.isNetworkConnected = true;
    this.isCalc = true;
    this.progress = 0;
    var totalSpeed = 0;
    
    for (let i = 0; i < 100; i++) {
      this.progress += 0.01;
      const startTime = Date.now();
      let res = await this.speedService.downloadOneKb().toPromise();
      const endTime = Date.now();
      this.speed = (1 * 1000 / (endTime - startTime)).toPrecision(3);
      totalSpeed += (1 * 1000 / (endTime - startTime));
    }

    this.isCalc = false;
    if ((totalSpeed / 100) < 1) {
      this.averageSpeed = (totalSpeed * 1000 / 100).toPrecision(3) + ' KB/s';
    } else {
      this.averageSpeed = (totalSpeed / 100).toPrecision(3) + ' MB/s';
    }
  }
}
