import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  private file: File;

  constructor(private http: HttpClient){}

  onFileChange(fileChangeEvent) {
    this.file = fileChangeEvent.target.files[0];
  }

  async submitForm(){
    let formData = new FormData();
    formData.append("profile_picture", this.file, this.file.name)
    this.http.put("http://localhost:3000/api/users/upload", formData).subscribe((response) => {
      console.log(response);
    });
  }
}
