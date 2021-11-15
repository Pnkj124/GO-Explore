import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  private file: File;
  sanitizer: any;
  image: any;

  constructor(private http: HttpClient, private storage: Storage){}

  async ngOnInit() {
    await this.storage.create();
    const email = await this.storage.get('email')
    const header = { 'email': email}
    this.http.get("http://localhost:3000/api/users/profile-picture", {headers: header, responseType: 'blob'}).subscribe((blob : any) => {
      let objectURL = URL.createObjectURL(blob);
      this.image = objectURL;
    });
  }

  onFileChange(fileChangeEvent) {
    this.file = fileChangeEvent.target.files[0];
  }

  async submitForm(){
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
