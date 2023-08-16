import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  showPassword = false;
  constructor(private auth : AuthService, private userService: UserService, private router : Router) { }

  onLoginFormSubmit(loginForm: NgForm): void {
    console.log('Username:', loginForm.value.username);
    console.log('Password:', loginForm.value.password);
    console.log('Form submitted');
    this.userService.setLoggedIn(true);
    
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
