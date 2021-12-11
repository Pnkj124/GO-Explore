import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  title = 'Profile';
  alt = 'Profile';
  sanitizer: any;
  image: any;
  badgeImage: any;
  username: any = '';
  level: any = 12;
  points: any = 1178;
  images: any;

  private file: File;

  private baseUrl: string = 'http://localhost:3000'

  constructor(private http: HttpClient, private storage: Storage, private toastController: ToastController){}

  async ngOnInit() {

    await this.storage.create();
    const email = await this.storage.get('email')
    const header = { 'email': email }

    await this.loadProfilePicture(header);

    this.http.get(`${this.baseUrl}/api/users/badges`, {headers: header}).subscribe((response: any) => {
      this.images = response.data.map(item => this.baseUrl+'/'+item);
    });

    this.http.get(`${this.baseUrl}/api/users/details`, {headers: header}).subscribe((response : any) => {
      this.username = response.username;
    });
  }

  onFileChange(fileChangeEvent) {
    this.file = fileChangeEvent.target.files[0];
  }

  async loadProfilePicture(header){
    this.http.get(`${this.baseUrl}/api/users/profile-picture`, { headers: header, responseType: 'blob' }).subscribe((blob: any) => {
      let objectURL = URL.createObjectURL(blob);
      this.image = objectURL;
    });
  }

  async submitForm(){
    const email = await this.storage.get('email')
    let formData = new FormData();
    formData.append("profile_picture", this.file, this.file.name)
    formData.append("email", email)
    this.http.put(`${this.baseUrl}/api/users/upload`, formData).subscribe((response) => {
      console.log(response);

      const header = { 'email': email };

      this.loadProfilePicture(header);
  
    });

    const toast = await this.toastController.create({
      message: 'Profile Updated successfully.',
      duration: 3000
    });
    toast.present();
  }
}
