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

  email : string = '';
  password : string = '';

  constructor(private auth : AuthService, private userService: UserService, private router : Router) { }

  login(loginForm: NgForm): void {
    if(this.email == '') {
      alert('Please enter email');
      return;
    }

    if(this.password == '') {
      alert('Please enter password');
      return;
    }

    this.auth.login(this.email, this.password).subscribe(
      (res) => {
        if (res.user) {
          // If the login is successful and res.user is not null,
          // obtain the user's token using res.user.getIdToken() method
          res.user.getIdToken().then((token: string) => {
            localStorage.removeItem("userId");
            localStorage.removeItem(token);
            localStorage.removeItem('uid');
            localStorage.clear();
            // Store the token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', this.email);
            localStorage.setItem('uid', res.user?.uid);
                      });
        }
        this.userService.checkUserExists(this.email).subscribe(
          (userExists) => {
            if (userExists) {
              // check if birthStar exists
              this.userService.checkBirthStarExists(this.email).subscribe(
                (birthStarExists) => {
                  if(birthStarExists){
                    localStorage.setItem('birthStarExists', "true");
                    this.navigateTo('/find-matches');
                  }
                  else{
                    localStorage.setItem('userId', this.email);
                    localStorage.setItem('birthStarExists', "false");
                    this.userService.setUserName(this.email.split('@')[0]);
                    this.navigateTo('/edit-user');
                  }
                },
                (error) => {
                  // Handle error checking birthstar
                  alert(error.message);
                  this.router.navigate(['/login']);
                });
              
            } else {
              // User does not exist, call the addUser method
              const user = {userId: this.email,birthStar:''}; // Replace ... with additional user data
              this.userService.addUser(user).subscribe(
                () => {
                  // Logic after adding the user
                  localStorage.setItem('userId', this.email);
                  this.userService.setUserName(this.email.split('@')[0]);
                  this.navigateTo('/edit-user');
                },
                (error) => {
                  // Handle error while adding the user
                  alert(error.message);
                  this.router.navigate(['/login']);
                });
            }
          },
          (error) => {
            // Handle error while checking user existence
            alert(error.message);
            this.router.navigate(['/login']);
          });
      },
      (error) => {
        // navigate back to login page
        alert(error.message);
        this.router.navigate(['/login']);
      });
    
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateTo(location:string){
    this.email = '';
    this.password = '';
    this.userService.setLoggedIn(true);
    this.router.navigate([location]);

  }
}
