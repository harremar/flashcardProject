import { Injectable, Query } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  getQueryResults(q: Query) {
    throw new Error('Method not implemented.');
  }
  constructor(private firestore: AngularFirestore) {}

  getAllUsers() {
    return this.firestore.collection('Users').snapshotChanges();
  }

  getAllDecks() {
    return this.firestore.collection('Decks').snapshotChanges();
  }

  getYourDecks(email: string) {
    return this.firestore
      .collection('Decks', (ref) => ref.where('email', '==', email))
      .snapshotChanges();
  }

  getDeckSearch(subject: string) {
    return this.firestore
      .collection('Decks', (ref) => ref.where('subject', '==', subject))
      .snapshotChanges();
  }

  getDeckSearch2(word: string) {
    return this.firestore
      .collection('Decks', (ref) => ref.where('name', '==', word))
      .snapshotChanges();
  }

  getDeckSearch3(word: string) {
    return this.firestore
      .collection('Decks', (ref) =>
        ref.where('searchKeywords', 'array-contains', word.toLowerCase())
      )
      .snapshotChanges();
  }
}
