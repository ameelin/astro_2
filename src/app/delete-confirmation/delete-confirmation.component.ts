import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchesService } from '../shared/matches.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
})
export class DeleteConfirmationComponent {
  userName: string;
  matchUserId: string;
  currentUserId: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    private matchService: MatchesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userName = data.userName;
    this.matchUserId = data.userId;
    this.currentUserId = data.currentUserId;
  }

  confirmDelete(): void {
    // Call the deleteMatch method from your MatchService
    this.matchService.deleteMatch(this.currentUserId, this.matchUserId)
  .then(() => {
    // Handle successful deletion here if needed
    // For example, update the UI or notify the parent component
    this.dialogRef.close(true);
  })
  .catch((error) => {
    // Handle error if the deletion fails
    // You can show an error message or log the error
    console.error('Deletion failed:', error);
    this.dialogRef.close(false);
  });

  }

  cancelDelete(): void {
    // close the dialog without performing any deletion action
    this.dialogRef.close(false);
  }
}
