import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
  isLoggedIn = false;

  setLoggedIn(loggedIn:boolean) {
    // Logic to handle user login
    this.isLoggedIn = loggedIn;
    this.userLoggedIn.emit(loggedIn);
  }

  // Other methods and logic
}
