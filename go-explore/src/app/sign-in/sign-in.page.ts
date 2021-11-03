import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, PatternValidator } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  validationMessages: any;
  validationForm: FormGroup;
  request: any = { Language: 'english' };
  confirm: any;

  

  constructor(
    public formBuilder: FormBuilder
  ) {
   }

  ngOnInit() {
    this.prepareFormValidation();
  }

  prepareFormValidation() {

    this.validationForm = this.formBuilder.group({
      Password: new FormControl('', Validators.compose([
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

      'Password': [
        {
          type: 'required',
          message: 'Password is required'
        },
        {
          type: 'pattern',
          message: 'Invalid password'
        }
      ]
    }

  }

  LognIn(values) {
    this.request = values;
    console.log(this.request);
    this.confirm();
  }
}
