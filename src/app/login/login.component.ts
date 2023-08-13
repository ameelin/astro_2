import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  showPassword = false;
  constructor() { }

  onLoginFormSubmit(loginForm: NgForm): void {
    console.log('Username:', loginForm.value.username);
    console.log('Password:', loginForm.value.password);
    console.log('Form submitted');
    
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
