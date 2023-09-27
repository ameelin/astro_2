import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../shared/matches.service';
import { ShowMatch } from 'src/models/showmatch.model';
import { Match } from 'src/models/match.model';

@Component({
  selector: 'app-show-matches',
  templateUrl: './show-matches.component.html',
  styleUrls: ['./show-matches.component.scss']
})
export class ShowMatchesComponent implements OnInit {

  currentUserId: string;
  selectedMatches: ShowMatch[] = [];
  rejectedMatches: ShowMatch[] = [];
  displayedColumns: string[] = ["User Name", "Health", "Wealth", "Temperament", "Children", "Compatibility", "Sex", "Total",  "Actions"];
  loadingMatches: boolean = true; 

  constructor(private matchService: MatchesService) {
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

  openDialog(action: string, match: Match) {
    if (action === 'Edit') {
      // Handle edit action
      console.log('Edit clicked for:', match);
    } else if (action === 'Delete') {
      // Handle delete action
      console.log('Delete clicked for:', match);
    }
  }

  debugAction(index: number) {
    console.log(`Debug: Clicked on cell with index ${index}`);
    // You can also log other variables or data for debugging purposes
  }
  
  
}
