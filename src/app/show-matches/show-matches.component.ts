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
  displayedColumns: string[] = ["User", "Health", "Wealth", "Temperament", "Children", "Compatibility", "Sex", "Total"];
  loadingMatches: boolean = true; 

  constructor(private matchService: MatchesService) {
    this.currentUserId = localStorage.getItem("userId")!;
  }

  ngOnInit(): void {
    this.matchService.getMatchesOfUser(this.currentUserId)
      .then((matches: Match[]) => {
        // Matches data is available here, call getShowMatches with the data and userId
        this.getShowMatches(this.currentUserId, matches);
      })
      .catch((error) => {
        console.error('Error fetching matches:', error);
      });
  }
  
  private getShowMatches( userId: string, matches: Match[]): void {
    this.matchService.getShowMatches(userId, matches)
      .subscribe((showMatches: ShowMatch[]) => {
        // Sort the data by the 'total' property
        const sortedShowMatches = showMatches.sort((a, b) => b.Total - a.Total);
        this.selectedMatches = sortedShowMatches.filter(match => !match.Rejected);
        this.rejectedMatches = sortedShowMatches.filter(match => match.Rejected);
        // Set loadingMatches to false once the data is loaded
        this.loadingMatches = false;
      });
  }
  
}
