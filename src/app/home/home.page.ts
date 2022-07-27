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
  isDownloadSpeed: boolean = false;
  isUploadSpeed: boolean = false;

  constructor(
    private localNotifications: LocalNotifications,
    private speedService: SpeedService,
    private statusBar: StatusBar
  ) { }

  ngOnInit() {
    this.statusBar.hide();
    this.start();
  }

  async start() {
    this.isDownloadSpeed = true;
    let startTime = Date.now();
    this.speedService.download("http://ipv6-http-speedtest6.thinkbroadband.com/5MB.zip").subscribe(
      (res) => {
        console.log("success")
        const endTime = Date.now();
        this.showDownloadSpeed(5 * 1000 / (endTime - startTime));
        this.isDownloadSpeed = false;
      }, (err) => {
        console.log("error")
        const endTime = Date.now();
        this.showDownloadSpeed(5 * 1000 / (endTime - startTime));
        this.isDownloadSpeed = false;
      }
    );

    this.isUploadSpeed = true;
    const file = await fetch('assets/5MB.zip');
    const blob = await file.blob();
    console.log(blob.size);
    let formData = new FormData();
    formData.append('file', blob, '5MB.zip');
    startTime = Date.now();
    this.speedService.upload("http://ipv6-http-speedtest4.thinkbroadband.com/speedsync.php", formData).subscribe(
      (res) => {
        console.log("success")
        const endTime = Date.now();
        this.showUploadSpeed(5 * 1000 / (endTime - startTime));
        this.isUploadSpeed = false;
      }, (err) => {
        console.log("error")
        const endTime = Date.now();
        this.showUploadSpeed(5 * 1000 / (endTime - startTime));
        this.isUploadSpeed = false;
      }
    )
  }

  showDownloadSpeed(speed: number) {
    if (speed < 1) {
      this.downloadSpeed = (speed * 1000).toFixed(2) + ' KB/S';
    } else {
      this.downloadSpeed = speed.toFixed(2) + ' MB/s';
    }
  }

  showUploadSpeed(speed: number) {
    if (speed < 1) {
      this.uploadSpeed = (speed * 1000).toFixed(2) + ' KB/S';
    } else {
      this.uploadSpeed = speed.toFixed(2) + ' MB/s';
    }
  }
}
