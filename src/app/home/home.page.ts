import { Component } from '@angular/core';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SpeedService } from '../services/speed.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';
import { Platform } from '@ionic/angular';

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
    document.addEventListener('online', () => console.log('Online!'), false);
    document.addEventListener('offline', () => console.log('Online!'), false);
    this.network.onChange().subscribe(() => {
      console.log("Network change");
    })
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.toast.show("Network disconnected", "2000", "center");
      alert("Network disconnected")
      this.isNetworkConnected = false;
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.toast.show("Network connected.", "2000", "center");
      alert("Network connected")
      this.isNetworkConnected = true;
      this.start();
    });
  }

  async start() {
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
