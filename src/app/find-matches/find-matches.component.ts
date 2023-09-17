import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../shared/user.service';

import { User } from '../../models/user.model';
import { MatchesService } from '../shared/matches.service';


@Component({
  selector: 'app-find-matches',
  templateUrl: './find-matches.component.html',
  styleUrls: ['./find-matches.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('300ms', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ transform: 'scale(0.5)', opacity: 0 }))
      ])
    ])
  ]
})
export class FindMatchesComponent implements OnInit {
  
  noMorePhotos: boolean = false;
  users: User[] = [];
  displayedUsers: User[] = [];
  currentUserId: string;
  currentDisplayIndex: number = 0;

  constructor(private userService: UserService, private matchesService: MatchesService, private router: Router, private snackBar: MatSnackBar) {
    this.currentUserId = <string>localStorage.getItem('userId') || '';
   }

  ngOnInit(): void {
    if (this.currentUserId) {
      // Fetch users dynamically (e.g., 20 users), excluding the current user
      const limit = 20;
      this.userService.getUsersExceptCurrentUser(limit, this.currentUserId).subscribe(
        (users: unknown[]) => {
          this.users = users as User[]; // Explicitly cast to User[] type
          this.loadDisplayedUsers();
        },
        (error) => {
          // Handle any errors that may occur during the HTTP request.
          console.error('Error fetching users:', error);
        }
      );
      
    }
  }

 

  loadDisplayedUsers() {
    if (this.users.length !== 0) {
      this.displayedUsers.unshift(this.users.shift() as User);
    } else {
      this.noMorePhotos = true;
      this.snackBar.open('No more users', 'OK', {
        duration: 3000, // Duration in milliseconds
        verticalPosition: 'top', // Position at the top
      });
      this.router.navigate(['/show-matches']);
    }
  }

  //reject
  swipeLeft(currentUserId:string, selectedUser: User, astroMethod:string) {
    console.log('Swiped left on user:', selectedUser);
    // Handle left swipe action here
    this.matchesService.saveMatch(currentUserId, selectedUser, true, astroMethod);
    this.displayedUsers.shift();
    this.currentDisplayIndex++;
    this.loadDisplayedUsers();
  }

  //select
  swipeRight(currentUserId:string, selectedUser: User, astroMethod:string) {
    console.log('Swiped right on user:', selectedUser);
    // Handle right swipe action here
    this.matchesService.saveMatch(currentUserId, selectedUser, false, astroMethod);
    this.displayedUsers.shift();
    this.currentDisplayIndex++;
    this.loadDisplayedUsers();
  }


  skipUser(selectedUser: User) {
    console.log('Skipped user:', selectedUser);
    // Handle right swipe action here
    this.displayedUsers.shift();
    this.currentDisplayIndex++;
    this.loadDisplayedUsers();
  }


  getEmailUsername(email: string): string {
    if (email) {
      return email.split('@')[0];
    }
    return '';
  }
  
}
