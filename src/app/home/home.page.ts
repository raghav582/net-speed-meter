import { ChangeDetectorRef, Component } from '@angular/core';
import { Network } from '@awesome-cordova-plugins/network/ngx';
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
  averageSpeed: string = 'not calculated. Press start.';
  speed: string;
  progress: number = 0;

  constructor(
    private statusBar: StatusBar,
    private speedService: SpeedService,
    private platform: Platform,
    private network: Network,
    private changeDetectRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
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
      this.refresh();
      this.start();
    });

    this.network.onDisconnect().subscribe(() => {
      this.isNetworkConnected = false;
      this.refresh();
    });
  }

  async start() {
    this.isNetworkConnected = true;
    this.isCalc = true;
    this.progress = 0;
    var totalSpeed = 0;

    for (let i = 0; i < 100; i++) {
      if(this.isNetworkConnected) {
        this.progress += 0.01;
        const startTime = Date.now();
        let res = await this.speedService.downloadOneKb().toPromise();
        const endTime = Date.now();
        this.speed = (1 * 1000 / (endTime - startTime)).toPrecision(3);
        totalSpeed += (1 * 1000 / (endTime - startTime));
      }
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
