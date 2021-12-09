import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {HttpClient} from "@angular/common/http";

import { Storage } from '@ionic/storage-angular';

import jsQR from 'jsqr';

@Component({ 
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  scanActive = false; 
  scanResult = null; 
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  loading: HTMLIonLoadingElement;

  constructor(
    private loadingCtrl: LoadingController, 
    private http: HttpClient,
    private storage: Storage
    ) {}

    async ngOnInit() {
      await this.storage.create();
    }

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  async startScan() {
    this.scanActive = true;
    if(this.scanActive == true){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'},
    });

    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true); 
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();
    requestAnimationFrame(this.scan.bind(this));
    }
  }

  async scan() {
    console.log ('SCAN'); 

    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading){
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true; 
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR (imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      console.log('code: ', code);

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        const email = await this.storage.get('email')
        this.http.post("http://localhost:3000/api/users/userScan", 
      {
        qrvalue: this.scanResult,
        email: email
      }).subscribe((response : any) => {
        console.log(response)
      });
      } 
      
      else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }

    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  reset()  {
    this.scanResult = null;
  } 

  stopScan() {
    this.scanActive = false;

  }
}