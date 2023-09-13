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

  canNavigateToShowMatches(): boolean {
    const userName = this.userService.getUserName();
    return !!userName; // Returns true if userName is not empty or null
  }

  canNavigateToFindMatches(): boolean {
    const userName = this.userService.getUserName();
    return !!userName; // Returns true if userName is not empty or null
  }

  onLinkClick(linkName: string): void {
    const msgAddendum = " is disabled until 'Edit Self' add of 'Desired User Name'";
    if (!this.canNavigateToShowMatches() && linkName === 'Show Matches') {
      this.showSnackBar("Show Matches"+msgAddendum);
    }

    if (!this.canNavigateToFindMatches() && linkName === 'Find Matches') {
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
