import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './user.model';
import { ImageUploadService } from '../shared/image-upload.service';
import { switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: User = {
    userId: localStorage.getItem("userId")!,
    uid: localStorage.getItem("uid")!,
    desiredUserName: '',
    birthStar: '',
    birthDate: '',
    longitude: '',
    longitudeDirection: '', 
    modifiedDate : '',
    modifiedBy : '',
    photoURL: ''
  };

  starNames: string[] = [];

  constructor(
    private userService: UserService,
    private imageUploadService: ImageUploadService,
    private snackBar: MatSnackBar,
    private firestore: AngularFirestore,
    private router : Router
  ){}

  ngOnInit() {
    if(this.userService.isUserLoggedIn()){
      try {
        this.fetchStarNames();
        const userId = localStorage.getItem("userId") ?? '';
        this.loadUserData(userId);
        
        console.log('User data loaded successfully');
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.user.userId = localStorage.getItem("userId") ?? '';
      this.user.modifiedDate = new Date().toLocaleDateString('en-US');
      this.user.modifiedBy = this.user.userId;

      //Now update user data
      this.userService.editUser(this.user).subscribe(
        () => {
          console.log(`User with ID ${this.user.userId} updated successfully!`);
          this.router.navigate(['/find-matches']);
        },
        (error) => {
          console.log('Error updating user:', error);
        }
      );
    } else {
      console.log('Please fill in all the required fields with valid data.');
    }
  }

  isFormValid(): boolean {
    // Check that desiredUserName and birthStar have values
    if (this.user.desiredUserName.trim() === '' || this.user.birthStar.trim() === '') {
      return false;
    }
  
    // Check desiredUserName length is between 6 and 8 characters
    if (this.user.desiredUserName.trim().length < 6 || this.user.desiredUserName.trim().length > 8) {
      return false;
    }
  
    // Additional validation for birthDate and longitude if they are filled
    if (this.user.birthDate.trim() !== '' && !/^\d{2}\/\d{2}\/\d{4}$/.test(this.user.birthDate)) {
      return false;
    }
  
    if (this.user.longitude.trim() !== '' && !/^(\d{1,3}\.\d{2})$/.test(this.user.longitude)) {
      return false;
    }
  
    // Validate longitude direction if longitude is filled
    if (this.user.longitude.trim() !== '' && this.user.longitudeDirection.trim() === '') {
      return false;
    }
  
    return true;
  }

  loadUserData(userId: string ): void {
    this.userService.getUserData(userId).subscribe(
      (userData) => {
        // Update the form fields with the user data
        this.user.desiredUserName = userData?.desiredUserName ?? '';
        this.user.birthStar = userData?.birthStar ?? '';
        this.user.birthDate = userData?.birthDate ?? '';
        this.user.longitude = userData?.longitude ?? '';
        this.user.longitudeDirection = userData?.longitudeDirection ?? '';
        this.user.photoURL = userData?.photoURL ?? '';
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  uploadFile(event: any, uid:string, userId:string) {
    console.log(uid);
    console.log(userId);
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${uid}`)
      .pipe(
        tap(() => {
          this.snackBar.open('Image uploaded successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'], // Add your custom CSS class
          });
        }),
        switchMap((photoURL) =>
          this.userService.editUser({
            userId,
            photoURL,
          })
        )
      )
      .subscribe();
  }

  fetchStarNames() {
    this.firestore.collection('stars').doc('starNames').valueChanges().subscribe(
      (starNamesDoc: any) => {
        if (starNamesDoc && starNamesDoc.names) {
          this.starNames = starNamesDoc.names;
        } else {
          this.starNames = []; // Handle the case if the document or names array is missing
        }
      },
      (error) => {
        console.error('Error fetching star names:', error);
      }
    );
  }
  
  
}
