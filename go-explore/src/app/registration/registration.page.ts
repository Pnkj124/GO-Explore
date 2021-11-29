import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, PatternValidator } from '@angular/forms';
import { UsercrudService } from '../services/usercrud.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  validationMessages: any;
  validationForm: FormGroup;
  request: any = { Language: 'english' };
  confirm: any;

  constructor(
    public formBuilder: FormBuilder, 
    private userCrudService: UsercrudService,
    private router: Router,
    private storage: Storage
    ) { }
  
  ngOnInit() 
    {
      this.prepareFormValidation();
      this.storage.create();
  }

  prepareFormValidation() {

    this.validationForm = this.formBuilder.group({
      Password: new FormControl('', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z, 0-9 ]*'),
        Validators.required])),
        Username: new FormControl('', Validators.compose([
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z, 0-9 ]*'),
          Validators.required])),
          Terms: new FormControl('', Validators.compose([
            Validators.minLength(2),
            Validators.maxLength(30),
            Validators.pattern('[a-zA-Z, 0-9 ]*'),
            Validators.required])),
      Email: new FormControl('', Validators.compose([
        //Validators.email,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        Validators.required
      ]))
    });

    this.validationMessages = {
      
      'Email': [
        {
          type: 'required',
          message: 'Email is required.'
        },
        {
          type: 'pattern',
          message: 'Must be a valid email address.'
        },
      ],

      'Username': [
        {
          type: 'required',
          message: 'Username is required.'
        },
        {
          type: 'pattern',
          message: 'Must be a valid username.'
        },
      ],

      'Password': [
        {
          type: 'required',
          message: 'Password is required.'
        },
        {
          type: 'pattern',
          message: 'Invalid password.'
        }
      ]
    }

  }

  LogIn() {
    if (!this.validationForm.valid) {
      return false;
    } else {
      const formValues = {
        "username" : this.validationForm.value.Username,
        "password" : this.validationForm.value.Password,
        "email": this.validationForm.value.Email
      }
      this.userCrudService.createUser(formValues)
        .subscribe((response) => {
          console.log("from api response", response)
          this.storage.set('email', this.validationForm.value.Email);
          this.router.navigate(['../tabs']);
        })
    }
  }

}
