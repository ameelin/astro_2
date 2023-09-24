import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
  isLoggedIn = false;
  private userNameSubject = new BehaviorSubject<string>('');
  userName$: Observable<string> = this.userNameSubject.asObservable();

  
  constructor(private firestore: AngularFirestore) { }

  setLoggedIn(loggedIn:boolean) {
    // Logic to handle user login
    this.isLoggedIn = loggedIn;
    this.userLoggedIn.emit(loggedIn);
  }

  getUserData(userId: string): Observable<any> {
    if(userId==''){
      throw new Error('userId is empty');
    }
    // Find the document ID based on the userId
    return this.findDocIdByUserId(userId).pipe(
      switchMap((docId) => {
        if (docId) {
          // Fetch the user data from the document with the provided docId
          return this.firestore.collection('users').doc(docId).valueChanges();
        } else {
          throw new Error('Document with the provided userId not found.');
        }
      })
    );
  }

  addUser(user: any): Observable<any> {
    return from(this.firestore.collection('users').add(user));
  }

  editUser(user: any): Observable<any> {
    const { userId, ...userData } = user;
    
    // Find the document ID based on the userId
    return this.findDocIdByUserId(userId).pipe(
      switchMap((docId) => {
        if (docId) {
          // Update the document with the provided userData
          return from(this.firestore.collection('users').doc(docId).update(userData));
        } else {
          throw new Error('Document with the provided userId not found.');
        }
      })
    );
  }

  findDocIdByUserId(userId: string): Observable<string | null> {
    const usersRef = this.firestore.collection('users');
    return from(
      usersRef
        .ref.where('userId', '==', userId)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // Document with the provided userId not found.
            console.log(`Document with userId '${userId}' not found.`);
            return null; 
          }
          const docId = querySnapshot.docs[0].id;
          console.log(`Document ID for userId '${userId}': ${docId}`);
          return docId;
        })
        .catch((error) => {
          console.error('Error fetching docId:', error);
          return null; // Return null in case of an error
        })
    );
  }

  


  checkUserExists(userId: string): Observable<boolean> {
    return this.firestore.collection('users', (ref) => ref.where('userId', '==', userId)).get().pipe(
      map((querySnapshot) => !querySnapshot.empty)
    );
  }

  checkBirthStarExists(userId: string): Observable<boolean> {
    const usersRef = this.firestore.collection('users');
    return from(
      usersRef
        .ref.where('userId', '==', userId)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            //set global userName
            const userData = querySnapshot.docs[0].data() as { desiredUserName?: any };
            if(!!userData?.desiredUserName){
              this.setUserName(userData.desiredUserName);
            }
            const birthStarData = querySnapshot.docs[0].data() as { birthStar?: any };
            return !!birthStarData?.birthStar;
          }
          return false;
        })
    );
  }

  isUserLoggedIn(){
    if(this.userLoggedIn){
      return true;
    }
   return  false
  }

  getUsersExceptCurrentUser(limit: number, currentUserId: string) {
    // Fetch users from Firestore, excluding the current user
    return this.firestore.collection('users', (ref) =>
      ref.where('userId', '!=', currentUserId).limit(limit)
    ).valueChanges();
  }

  
  setUserName(newUserName: string) {
    this.userNameSubject.next(newUserName);
  }

  getUserName(): string {
    return this.userNameSubject.getValue();
  }
}
