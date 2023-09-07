import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../shared/matches.service';
import { ShowMatch } from 'src/models/showmatch.model';
import { Match } from 'src/models/match.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-show-matches',
  templateUrl: './show-matches.component.html',
  styleUrls: ['./show-matches.component.scss']
})
export class ShowMatchesComponent implements OnInit {
  currentUserId: string;
  // Initialize as  empty observables
  selectedMatches$: Observable<ShowMatch[]> = of([]); 
  rejectedMatches$: Observable<ShowMatch[]> = of([]);

  constructor(private matchService: MatchesService) {
    this.currentUserId = localStorage.getItem("userId")!;
  }

  ngOnInit(): void {
    this.matchService.getMatchesOfUser(this.currentUserId).subscribe((matches: Match[]) => {
      this.matchService.getShowMatches(this.currentUserId, matches).subscribe((showMatches: ShowMatch[]) => {
        // Sort the data by the 'total' property
        const sortedShowMatches = showMatches.sort((a, b) => b.Total - a.Total);
        this.selectedMatches$ = of(sortedShowMatches.filter(match => !match.Rejected));
        this.rejectedMatches$ = of(sortedShowMatches.filter(match => match.Rejected));
      });
    });
  }
}
