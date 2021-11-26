import { Component, ViewChild, ElementRef } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';

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
      title: "Halfdan's Home",
      latitude: "55.40374801191922",
      longitude: "11.352125104648161"
    },
    {
      title: "school", 
      latitude: "55.631118",
      longitude: "12.078712"
    }
  ];

  constructor(
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.geoInformation();
  }

  geoInformation() {
    this.geolocation.getCurrentPosition().then((data) => {
      this.lat = data.coords.latitude;
      this.long = data.coords.longitude;
      this.accuracy = data.coords.accuracy;
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
        longitude: marker.longitude
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
                            '<ion-button id="navigate">Direction</ion-button>' +
                            '</div>';

    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
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
