import { Component, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import {HttpClient} from "@angular/common/http";
import { Tab2Page } from '../tab2/tab2.page';

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
  markers: any = [
      {
      title: "Zealand Roskilde",
      latitude: "55.63087610877062",
      longitude: "12.078749778139647"
      },
      {
      title: "ZBC Roskilde",
      latitude: "55.627815858323196",
      longitude: "12.078055085884328"
      },
      {
      title: "HTX Roskilde",
      latitude: "55.62528540644652",
      longitude: "12.082877697551513"
      },
      {
      title: "Roskilde Handelsskole",
      latitude: "55.62659683996188",
      longitude: "12.075673284475176"
      },
      {
      title: "Roskilde Universitet",
      latitude: "55.652251052251295",
      longitude: "12.141006127192856"
      },
      {
      title: "Himmerlev Gymnasium",
      latitude: "55.6567060735931",
      longitude: "12.112451329052622"
      },
      {
      title: "Café Korn - Roskilde",
      latitude: "55.64074898756519",
      longitude: "12.076624971074732"
      },
      {
      title: "Frellsen Chokolade Roskilde",
      latitude: "55.64089204000676",
      longitude: "12.07916099965007"
      }
    ];

  constructor(
    private geolocation: Geolocation,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.geoInformation(this.markers);
    this.http.get("http://localhost:3000/api/users/locations").subscribe((response : any) => {
      console.log(response)
    });
  }

  geoInformation(markers) {
    this.geolocation.getCurrentPosition().then((data) => {
      this.lat = data.coords.latitude;
      this.long = data.coords.longitude;
      this.accuracy = data.coords.accuracy;
      markers.push({
        title: "Your current location",
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      })
     });

     //console.log('from here ', this.geolocation.getCurrentPosition().then((data) => {data.coords.latitude}));
  }

  ionViewDidEnter() {
    this.showMap();
  }

  addMarkersToMap(markers){
    for (let marker of markers) {
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);

      let mapMarker = new google.maps.Marker({
        position: position,
        title: marker.title,
        latitude: marker.latitude,
        longitude: marker.longitude,
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
