import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  constructor(private firestore: AngularFirestore) { }

  // Save a match for a user
  saveMatch(currentUserId: string, matchedUser: User, astroMethod:string) {
    // Define the path to the user's matches collection
    const matchesCollectionPath = `matches/${currentUserId}/matches`;

    // Define the new match object
    const newMatch = {
      userId: matchedUser.userId, // The matched user's userId
      scoreBreakdown: [] // You can add score breakdown data here
    };

    // Add the new match to the user's matches collection
    this.firestore.collection(matchesCollectionPath).add(newMatch)
      .then(() => {
        console.log(`Match saved successfully for user ${currentUserId}`);
      })
      .catch((error) => {
        console.error(`Error saving match for user ${currentUserId}:`, error);
      });
  }
}
