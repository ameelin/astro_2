import { Component } from '@angular/core';
import { UserService } from '../shared/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  canNavigate(): boolean {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return false; 
    }

    this.userService.checkBirthStarExists(userId).subscribe(
      (birthStarExists) => {
        if(birthStarExists){
         return true;
        }
        return false;
      },
      (error) => {
        // Handle error checking birthstar
        alert(error.message);
      });
  
      return false;
  }
  
  

  onLinkClick(linkName: string): void {
    const msgAddendum = " is disabled until 'Edit Self' add of 'Desired User Name'";
    if (!this.canNavigate() && linkName === 'Show Matches') {
      this.showSnackBar("Show Matches"+msgAddendum);
    }

    if (!this.canNavigate() && linkName === 'Find Matches') {
      this.showSnackBar("Find Matches"+msgAddendum);
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

}
