import { Component } from '@angular/core';
import { UserService } from '../shared/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  canNavigate(): boolean {
    if(localStorage.getItem('birthStarExists') === "true"){
      return true;
    }
    return false;
  }

  onLinkClick(linkName: string): void {
    const msgAddendum = " is disabled until 'Edit User' submitted";
    if (!this.canNavigate() && linkName === 'Show Matches') {
      this.showSnackBar("Show Matches"+msgAddendum);
      this.navigateToEditUser()
    }

    if (!this.canNavigate() && linkName === 'Find Matches') {
      this.showSnackBar("Find Matches"+msgAddendum);
      this.navigateToEditUser()
    }
  }

  private navigateToEditUser(){
    // Use setTimeout to navigate to edit-user after a delay of 3 seconds
    setTimeout(() => {
      this.router.navigate(['/edit-user']);
    }, 3000); 
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

}
