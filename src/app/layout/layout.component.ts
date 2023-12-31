// layout.component.ts

import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor(public userService: UserService){}

  toggleSidenav(): void {
    console.log("toggleSidenav click received")
    this.sidenav.toggle();
  }
}
