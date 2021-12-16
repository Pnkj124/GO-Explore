import { Component, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import {HttpClient} from "@angular/common/http";
import {Storage} from "@ionic/storage-angular";
import {environment} from "../../environments/environment";

declare var google: any;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  lat: any;
  long: any;
  address: any;
  accuracy: any;

  map: any;
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

  infowindows: any = [];
  markers: any;

  constructor(
    private geolocation: Geolocation,
    private http: HttpClient,
    private router: Router,
    private storage: Storage
  ) {}

  async ngOnInit() {
    const userLocationUrl = environment.apiUrl+"api/users/locations";

    this.http.get(userLocationUrl).subscribe((response : any) => {
      this.markers = response.locations
    });
    this.geoInformation();
  }

  geoInformation() {
    this.geolocation.getCurrentPosition().then((data) => {
      this.lat = data.coords.latitude;
      this.long = data.coords.longitude;
      this.accuracy = data.coords.accuracy;
      this.markers.push({
        name: "Your current location",
        lat: data.coords.latitude,
        lon: data.coords.longitude
      })
     });
  }

  ionViewDidEnter() {
    this.showMap();
  }

  addMarkersToMap(markers){
    for (let marker of markers) {
      let position = new google.maps.LatLng(marker.lat, marker.lon);

      let mapMarker = new google.maps.Marker({
        position: position,
        title: marker.name,
        latitude: marker.lat,
        longitude: marker.lon,
        animation: google.maps.Animation.DROP
      });
      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  addInfoWindowToMarker(marker) {
    let infoWindowContent = '<div id="content">' +
                            '<h2 id="firstHeading" class="firstHeading">' + marker.title + '</h2>' +
                            '<p>Latitude: ' + marker.latitude + '</p>' +
                            '<p>Longitude: ' + marker.longitude + '</p>' +
                            '<ion-button id="navigate">Go scan</ion-button>' +
                            '</div>';

    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('navigate').addEventListener('click', () => {
        this.router.navigate(['../tabs/tab2']);
        })
        });
    });
    this.infowindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for(let window of this.infowindows) {
      window.close();
    }
  }


  showMap() {
    const location = new google.maps.LatLng(this.lat, this.long );
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options)
    this.addMarkersToMap(this.markers);
  }

}
