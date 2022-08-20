import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { SpeedService } from '../services/speed.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isCalc = false;
  isNetworkConnected = true;
  isConnecting = false;
  averageSpeed: string = 'not calculated. Press start.';
  speed: string;
  progress: number = 0;

  constructor(
    private statusBar: StatusBar,
    private speedService: SpeedService,
    private platform: Platform,
    private network: Network,
    private changeDetectRef: ChangeDetectorRef,
    private splashScreen: SplashScreen
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.hide();
      this.watchNetwork();
    })
  }

  refresh() {
    this.changeDetectRef.detectChanges();
  }

  watchNetwork() {
    if (navigator.onLine) {
      this.isNetworkConnected = true;
      this.refresh();
      this.start();
    } else {
      this.isNetworkConnected = false;
      this.refresh();
    }

    this.network.onConnect().subscribe(async () => {
      this.isNetworkConnected = true;
      this.start();
    });

    this.network.onDisconnect().subscribe(() => {
      this.isNetworkConnected = false;
      this.refresh();
    });
  }

  async start() {
    this.isCalc = true;
    this.refresh();
    this.progress = 0;
    var totalSpeed = 0;

    this.isConnecting = true;
    this.refresh();
    await this.speedService.ping().toPromise().then((res) => {
      console.log(res);
    }, (err) => {
      console.log(err);
    });
    this.isConnecting = false;
    this.refresh();

    for (let i = 0; i < 100; i++) {
      if (!this.isNetworkConnected) {
        console.log('loop break')
        break;
      }
      console.log("i: ", i);
      this.progress += 0.01;
      const startTime = Date.now();
      let res = await this.speedService.downloadOneKb(i).toPromise();
      const endTime = Date.now();
      this.speed = (1 * 1000 / (endTime - startTime)).toPrecision(3) + ' MB/s';
      totalSpeed += (1 * 1000 / (endTime - startTime));
      this.refresh();
    }

    this.isCalc = false;
    if ((totalSpeed / 100) < 1) {
      this.averageSpeed = (totalSpeed * 1000 / 100).toPrecision(3) + ' KB/s';
    } else {
      this.averageSpeed = (totalSpeed / 100).toPrecision(3) + ' MB/s';
    }
    this.refresh();
  }
}
