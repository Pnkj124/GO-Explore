import {AfterContentInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page{

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

  private baseUrl: string = environment.apiUrl

  constructor(private http: HttpClient, private storage: Storage, private toastController: ToastController, private router: Router){
  }

  async ngOnInit() {

    await this.storage.create();
    const email = await this.storage.get('email')
    const header = { 'email': email }

    await this.loadProfilePicture(header);
    await this.loadUserBadges(header);
    await this.loadUserDetails(header);

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

  async loadUserBadges(header){
    this.http.get(`${this.baseUrl}/api/users/badges`, {headers: header}).subscribe((response: any) => {
      this.images = response.data.badges.map(item => this.baseUrl+'/'+item);
    });
  }

  async loadUserDetails(header){
    this.http.get(`${this.baseUrl}/api/users/details`, {headers: header}).subscribe((response : any) => {
      this.username = response.username;
    });
  }

  async logout(){
    const email = await this.storage.get('email')
    const header = { 'email': email };
    this.http.get(`${this.baseUrl}/api/users/logout`, { headers: header }).subscribe(async (response: any) => {
    if(response.success){
      await this.router.navigate(['/sign-in']);
    }
      const toast = await this.toastController.create({
        message: 'User Logged out successfully.',
        duration: 3000
      });
      await toast.present();

      await this.storage.set('email',"")

      await this.router.navigate(['/sign-in']);

    });
  }

  async submitForm(){
    const email = await this.storage.get('email')
    let formData = new FormData();
    formData.append("profile_picture", this.file, this.file.name)
    formData.append("email", email)
    this.http.put(`${this.baseUrl}/api/users/upload`, formData).subscribe(async (response) => {
      console.log(response);

      const header = { 'email': email };

      await this.loadProfilePicture(header);
    });

    const toast = await this.toastController.create({
      message: 'Profile Updated successfully.',
      duration: 3000
    });
    await toast.present();
  }

  async doRefresh(event) {
    const email = await this.storage.get('email')
    const header = { 'email': email };
    await this.loadProfilePicture(header);
    await this.loadUserBadges(header);
    await this.loadUserDetails(header);
    setTimeout(() => {
      console.log('Profile picture loaded successfully.');
      event.target.complete();
    }, 2000);
  }
}
