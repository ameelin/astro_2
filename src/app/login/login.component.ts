import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor() { }

  onLoginFormSubmit(loginForm: NgForm): void {
    console.log('Username:', loginForm.value.username);
    console.log('Password:', loginForm.value.password);
    console.log('Form submitted');
    
  }
}
