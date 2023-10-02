import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../shared/matches.service';
import { ShowMatch } from 'src/models/showmatch.model';
import { Match } from 'src/models/match.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-matches',
  templateUrl: './show-matches.component.html',
  styleUrls: ['./show-matches.component.scss']
})
export class ShowMatchesComponent implements OnInit {

  currentUserId: string;
  selectedMatches: ShowMatch[] = [];
  rejectedMatches: ShowMatch[] = [];
  
  selectedDisplayedColumns: string[] = ["User Name", "Health", "Wealth", "Temperament", "Children", "Compatibility", "Sex", "Total", "Actions"];
  rejectedDisplayedColumns: string[] = ["User Name", "Health", "Wealth", "Temperament", "Children", "Compatibility", "Sex", "Total", "Actions"];

  loadingMatches: boolean = true; 

  constructor(private router:Router, private activatedRoute: ActivatedRoute, private matchService: MatchesService, private dialog: MatDialog) {
    this.currentUserId = localStorage.getItem("userId")!;
  }

  ngOnInit(): void {
    this.getShowMatches(this.currentUserId);
  }
  
  private getShowMatches( userId: string): void {
    this.matchService.getUserMatches(userId)
      .subscribe((showMatches: ShowMatch[]) => {
        // Sort the data by the 'total' property
        const sortedShowMatches = showMatches.sort((a, b) => b.Total - a.Total);
        this.selectedMatches = sortedShowMatches.filter(match => !match.Rejected);
        this.rejectedMatches = sortedShowMatches.filter(match => match.Rejected);
        // Set loadingMatches to false once the data is loaded
        this.loadingMatches = false;
      });
  }

  deleteMatch(match:Match) {
    throw new Error('Method not implemented.');
  }

  editMatch(match:Match) {
    throw new Error('Method not implemented.');
  }

  openDialog(action: string, match: ShowMatch) {
    //EDIT match
    if (action === 'Edit') {
      // Handle edit action
      console.log('Edit clicked for:', match);
    }
    //DELETE match
    else if (action === 'Delete') {
      const dialogConfig: MatDialogConfig = {
        data: {
          userName: match['User Name'],
          userId: match['User'],
          currentUserId: this.currentUserId,
        },
        disableClose: true, // Disable click outside to close
      };
  
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, dialogConfig);
  
      // Subscribe to the dialog result
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          // User confirmed deletion
          console.log('Delete confirmed for:', match);
          // Reload the current page
          this.router.navigate(['.', { relativeTo: this.activatedRoute }]);
        } else {
          // User canceled deletion
          console.log('Delete canceled');
        }
      });
    }
  }

  debugAction(index: number) {
    console.log(`Debug: Clicked on cell with index ${index}`);
    // You can also log other variables or data for debugging purposes
  }
  
  
}
