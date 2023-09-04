import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatchesService } from '../shared/matches.service';

@Component({
  selector: 'app-show-matches',
  templateUrl: './show-matches.component.html',
  styleUrls: ['./show-matches.component.scss'],
})
export class ShowMatchesComponent implements OnInit {
  selectedMatchesDataSource = new MatTableDataSource<any>();
  rejectedMatchesDataSource = new MatTableDataSource<any>();

  displayedColumns = ['userId', 'compat1', 'compat2', 'compat3', 'compat4', 'edit', 'delete'];

  constructor(private matchService: MatchesService) {}

  ngOnInit(): void {
    // Fetch the matches data and filter them into selected and rejected
    this.matchService.getAllMatches().subscribe((matches: any[]) => {
      const selectedMatches = matches.filter((match) => !match.rejected);
      const rejectedMatches = matches.filter((match) => match.rejected);

      // Sort both tables by compatibility score
      this.selectedMatchesDataSource.data = this.sortMatchesByCompatibility(selectedMatches);
      this.rejectedMatchesDataSource.data = this.sortMatchesByCompatibility(rejectedMatches);
    });
  }

  private sortMatchesByCompatibility(matches: any[]): any[] {
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}
