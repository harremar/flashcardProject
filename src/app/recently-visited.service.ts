// recently-visited.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecentlyVisitedService {
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  loadRecentlyVisitedDecks(): Observable<any> {
    return this.afAuth.authState;
  }

  async updateRecentlyVisitedDecks(decks: any[]) {
    const user: any = this.afAuth.currentUser;
    if (user) {
      const userId = user.uid;
      // Check if the user document exists
      const userDoc: any = await this.afs
        .collection('users')
        .doc(userId)
        .get()
        .toPromise();

      if (userDoc.exists) {
        // Update the recently visited decks in Firestore
        await this.afs.collection('users').doc(userId).update({
          recentlyVisitedDecks: decks,
        });

        console.log('Recently visited decks updated in Firestore');
      } else {
        // If the user document doesn't exist, create it
        await this.afs.collection('users').doc(userId).set({
          recentlyVisitedDecks: decks,
        });

        console.log('User document created with recently visited decks');
      }
      // return this.afs.collection('Users').doc(userId).update({
      //   recentlyVisitedDecks: decks,
      // });
    }
    return null;
  }
}
