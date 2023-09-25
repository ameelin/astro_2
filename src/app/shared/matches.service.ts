import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { StarDocument } from '../../models/stardata.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserService } from './user.service';
import { Observable, from, map } from 'rxjs';
import { ShowMatch } from 'src/models/showmatch.model';
import { Match } from 'src/models/match.model';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  MAX_USER_MATCHES_ALLOWED: number =6;
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
      userName: matchedUser.desiredUserName,
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

          // this keeps size to MAX_USER_MATCHES_ALLOWED
          userMatches=this.filterAndRemoveMatches(userMatches);
          
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

  //used by saveMatch
  filterAndRemoveMatches(userMatches: any[]): any[] {
    // Check if there are more than 6 matches
  if (userMatches.length > this.MAX_USER_MATCHES_ALLOWED) {
      // Separate userMatches into accepted and rejected arrays
      const accepted = userMatches.filter((match) => !match.rejected);
      const rejected = userMatches.filter((match) => match.rejected);
  
      // Sort both accepted and rejected arrays by compatibility score in descending order
      accepted.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      rejected.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
      // Merge accepted and rejected arrays while ensuring the total length is 6 or less
      const mergedMatches = [...accepted, ...rejected].slice(0, 6);
  
      // Return the merged array as userMatches
      return mergedMatches;
    }
  
    // If there are 6 or fewer matches, return userMatches as is
    return userMatches;
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

  //Decommisioned func
  async getMatchesOfUser(userId: string): Promise<Match[]> {
    try {
      const doc = await this.firestore.doc(`matches/${userId}`).get().toPromise();
      if (doc && doc.exists) {
        const data = doc.data() as { userMatches: Match[] } | undefined;
        if (data && data.userMatches) {
          // Assuming 'userMatches' is an array of 'Match' objects
          return data.userMatches;
        } else {
          // 'userMatches' doesn't exist or is not an array, return an empty array
          return [];
        }
      } else {
        // Document doesn't exist, return an empty array
        return [];
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      // Handle the error as needed, e.g., show an error message
      throw error; // Rethrow the error
    }
  }

  //Decommissioned func
  getShowMatches(userId: string, matches: Match[]): Observable<ShowMatch[]> {
    return from((async () => {
      const currentUserStar = await this.findUserBirthStar(userId);
      const starCollection = this.firestore.collection(currentUserStar);
      const showMatches: ShowMatch[] = [];

      for (const match of matches) {
        const matchedUserStar = await this.findUserBirthStar(match.userId);
        const querySnapshot = await starCollection.ref.where('star', '==', matchedUserStar).get();

        if (!querySnapshot.empty) {
          const matchedUserDoc = querySnapshot.docs[0].data() as StarDocument;
          const health = matchedUserDoc['Dina Porutham'];
          const wealth = matchedUserDoc['Stree Deergha Porutham'];
          const temperament = matchedUserDoc['Gana Porutham'];
          const children = matchedUserDoc['Mahendra Porutham'];
          const compatibility = matchedUserDoc['Rasiyathipathi Porutham'];
          const sex = matchedUserDoc['Yoni Porutham'];
          const total = matchedUserDoc.total;

          const showMatch: ShowMatch = {
            "User": match.userId,
            "User Name":match.userName,
            "Health": health,
            "Wealth": wealth,
            "Temperament": temperament,
            "Children": children,
            "Compatibility": compatibility,
            "Sex": sex,
            "Total": total,
            "Rejected": match.rejected
          };

          showMatches.push(showMatch);
        }
      }

      return showMatches;
    })());
  }

  //this combines getMatchesOfUser() and getShowMatches()
  getUserMatches(userId: string): Observable<ShowMatch[]> {
    return from((async () => {
      try {
        const doc = await this.firestore.doc(`matches/${userId}`).get().toPromise();
        if (doc && doc.exists) {
          const data = doc.data() as { userMatches: Match[] } | undefined;
          if (data && data.userMatches) {
            const matches = data.userMatches;

            const currentUserStar = await this.findUserBirthStar(userId);
            const starCollection = this.firestore.collection(currentUserStar);
            const showMatches: ShowMatch[] = [];
            for (const match of matches) {
              const matchedUserStar = await this.findUserBirthStar(match.userId);
              const querySnapshot = await starCollection.ref.where('star', '==', matchedUserStar).get();

              if (!querySnapshot.empty) {
                const matchedUserDoc = querySnapshot.docs[0].data() as StarDocument;
                const health = matchedUserDoc['Dina Porutham'];
                const wealth = matchedUserDoc['Stree Deergha Porutham'];
                const temperament = matchedUserDoc['Gana Porutham'];
                const children = matchedUserDoc['Mahendra Porutham'];
                const compatibility = matchedUserDoc['Rasiyathipathi Porutham'];
                const sex = matchedUserDoc['Yoni Porutham'];
                const total = matchedUserDoc.total;

                const showMatch: ShowMatch = {
                  "User": match.userId,
                  "User Name": match.userName,
                  "Health": health,
                  "Wealth": wealth,
                  "Temperament": temperament,
                  "Children": children,
                  "Compatibility": compatibility,
                  "Sex": sex,
                  "Total": total,
                  "Rejected": match.rejected
                };

                showMatches.push(showMatch);
              }
            }

            return showMatches;
          }
        }
        // Document doesn't exist or no userMatches found, return an empty array
        return [];
      } catch (error) {
        console.error('Error fetching user matches:', error);
        throw error;
      }
    })());
  }

  

  private async findUserBirthStar(currentUserId: string): Promise<string> {
    try {
      // Create a Promise to fetch user data
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
  
      // Wait for the user data to be available
      const userData = await userDataPromise;
      const currentUserStar = userData?.birthStar ?? '';
      console.log('matchedUserStar:', currentUserStar);

      return currentUserStar;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return ''; // Return an empty string or handle the error as needed
    }
  }
  
}
