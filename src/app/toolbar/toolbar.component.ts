import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavToggle = new EventEmitter<void>();
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isLoggedIn = false;
  userName = ''
  constructor(private auth : AuthService, private userService: UserService,private router : Router) {}

  ngOnInit() {
    this.userService.userName$.subscribe((newUserName: string) => {
      this.userName = newUserName;
    });
    this.userService.userLoggedIn.subscribe((loggedIn) => {
       this.isLoggedIn = loggedIn;
    });
  }

  onSidenavToggle(): void {
    console.log("onSidenavToggle");
    this.sidenavToggle.emit();
  }

  logout(){
    this.auth.logout();
    localStorage.removeItem("userId");
    localStorage.clear();
    this.router.navigate(['/login']);
    this.userService.setLoggedIn(false);
    this.userService.setUserName('');
    this.sidenav.close();
  }
}
