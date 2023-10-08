import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userName = data.userName;
    this.matchUserId = data.userId;
    this.currentUserId = data.currentUserId;
    this.rejected = data.rejected;
  }

  submitEdit(): void {
    // Handle the submission logic here based on checkboxValue and rejected status
    // For example, update the database with the new status
    console.log(`Submit clicked for ${this.userName}, Rejected: ${this.rejected}, Checkbox Value: ${this.checkboxValue}`);

    // Implement your database update logic here

    // Close the dialog
    this.dialogRef.close(true);
  }

  closeDialog(): void {
    // Close the dialog without making any changes
    this.dialogRef.close();
  }
}
