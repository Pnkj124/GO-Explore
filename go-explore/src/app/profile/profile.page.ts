import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  title: string = "Profile"

  private file: File;
  sanitizer: any;
  image: any;
  badge_image: any;
  username: any;
  level: any = 12;
  points: any = 1178;

  constructor(private http: HttpClient, private storage: Storage) { }

  async ngOnInit() {
    await this.storage.create();
    const email = await this.storage.get('email')
    const header = { 'email': email }
    this.http.get("http://localhost:3000/api/users/profile-picture", { headers: header, responseType: 'blob' }).subscribe((blob: any) => {
      let objectURL = URL.createObjectURL(blob);
      this.image = objectURL;
    });

    this.http.get("http://localhost:3000/api/users/badges", { headers: header, responseType: 'blob' }).subscribe((blob: any) => {
      let objectURL = URL.createObjectURL(blob);
      this.badge_image = objectURL;
    });

    this.http.get("http://localhost:3000/api/users/details", { headers: header }).subscribe((response: any) => {
      this.username = response.username;
    });
  }

  onFileChange(fileChangeEvent) {
    this.file = fileChangeEvent.target.files[0];
  }

  async submitForm() {
    const email = await this.storage.get('email')
    let formData = new FormData();
    formData.append("profile_picture", this.file, this.file.name)
    formData.append("email", email)
    this.http.put("http://localhost:3000/api/users/upload", formData).subscribe((response) => {
      console.log(response);
      window.location.reload();
    });

  }
}
