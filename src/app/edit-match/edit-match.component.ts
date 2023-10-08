import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchesService } from '../shared/matches.service';

@Component({
  selector: 'app-edit-match',
  templateUrl: './edit-match.component.html',
  styleUrls: ['./edit-match.component.scss'],
})
export class EditMatchComponent {
  userName: string;
  matchUserId: string;
  currentUserId: string;
  rejected: boolean;
  checkboxValue: boolean = false; // Initialize checkbox value

  constructor(
    public dialogRef: MatDialogRef<EditMatchComponent>,
    private matchService: MatchesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userName = data.userName;
    this.matchUserId = data.userId;
    this.currentUserId = data.currentUserId;
    this.rejected = data.rejected;
  }

  submitEdit(): void {
    this.rejected = !this.rejected;
    // Call the updateMatch method from your MatchService
    this.matchService.updateMatch(this.currentUserId, this.matchUserId, this.rejected)
    .then(() => {
      // Handle successful update here if needed
      // For example, update the UI or notify the parent component
      this.dialogRef.close(true);
    })
    .catch((error) => {
      // Handle error if the update fails
      // You can show an error message or log the error
      console.error('Update failed:', error);
      this.dialogRef.close(false);
    });
  }

  closeDialog(): void {
    // Close the dialog without making any changes
    this.dialogRef.close();
  }
}
