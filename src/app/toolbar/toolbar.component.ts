import { Component, Output, EventEmitter } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavToggle = new EventEmitter<void>();
  isLoggedIn = false;

  constructor(private userService: UserService,private router : Router) {}

  ngOnInit() {
    this.userService.userLoggedIn.subscribe((loggedIn) => {
       this.isLoggedIn = loggedIn;
    });
  }

  onSidenavToggle(): void {
    console.log("onSidenavToggle");
    this.sidenavToggle.emit();
  }

  logout(){
    localStorage.removeItem("userId");
    localStorage.clear();
    this.router.navigate(['/login']);
    this.userService.setLoggedIn(false);
    this.sidenavToggle.emit();
  }
}
