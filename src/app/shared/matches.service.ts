import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { StarDocument } from '../../models/stardata.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  constructor(private userService: UserService, private firestore: AngularFirestore) { }

  async saveMatch(
    currentUserId: string,
    matchedUser: User,
    rejected:boolean,
    astroMethod: string
  ): Promise<void> {



    // Calculate compatibility score based on astroMethod
    const compatibilityScore = await this.calculateCompatibilityScore(
      currentUserId,
      matchedUser.birthStar,
      astroMethod
    );

    // Prepare match data
    const matchData = {
      userId: matchedUser.userId,
      astroMethod: astroMethod,
      compatibilityScore: compatibilityScore,
      rejected: rejected,
      canOverwrite: true,
    };

    try {
      // Reference to the "matches" collection
      const matchesCollectionRef = this.firestore.collection('matches');

      // Reference to the specific user's matches document
      const userMatchesDocRef = matchesCollectionRef.doc(currentUserId);

      // Fetch the current user's matches document
      userMatchesDocRef.get().subscribe((userMatchesDoc) => {
        if (userMatchesDoc.exists) {
          // If the user's matches document exists, update the "userMatches" array
          const userData = userMatchesDoc.data() as { userMatches?: any[] } || {};
          let userMatches = userData.userMatches || [];

          // Check if there's an existing match with the same userId
          const existingMatchIndex = userMatches.findIndex(
            (match) => match.userId === matchedUser.userId
          );

          if (existingMatchIndex !== -1) {
            // Replace the existing match with the new one
            userMatches[existingMatchIndex] = matchData;
          } else {
            // Add the new match to the array
            userMatches.push(matchData);
          }

          // Update the user's matches document with the updated array
          userMatchesDocRef.update({ userMatches });
        } else {
          // If the user's matches document doesn't exist, create it
          userMatchesDocRef.set({ userMatches: [matchData] });
        }
      });
    } catch (error) {
      console.error('Error saving match:', error);
      // Handle error as needed
    }
    
  }


  async calculateCompatibilityScore(currentUserId: string, matchedUserStar: string, astroMethod: string): Promise<number> {
    let totalCompatibilityScore = 0;
  
    // Create a Promise to fetch the user data
    const userDataPromise = new Promise<any>((resolve, reject) => {
      this.userService.getUserData(currentUserId).subscribe(
        (userData) => {
          resolve(userData);
        },
        (error) => {
          reject(error);
        }
      );
    });
  
    try {
      // Wait for the user data to be available
      const userData = await userDataPromise;
      const currentUserStar = userData?.birthStar ?? '';
  
      // Check if the astroMethod matches 'Vedic'
      if (astroMethod === 'Vedic') {
        // Reference to the starCollection
        const starCollection = this.firestore.collection(currentUserStar);
  
        // Query for the matching document
        const querySnapshot = await starCollection.ref.where('star', '==', matchedUserStar).get();
  
        if (!querySnapshot.empty) {
          // There is a matching document
          const matchedUserDoc = querySnapshot.docs[0].data() as StarDocument;
  
          // Access the 'total' field in the currentUser's star document
          totalCompatibilityScore = matchedUserDoc.total;
        }
      }
      else if (astroMethod === 'XXXXXX') {
        //TODO
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  
    return totalCompatibilityScore;
  }
  

  

}
