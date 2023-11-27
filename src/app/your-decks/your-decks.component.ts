import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router'; // Import Router
import { data } from 'jquery';

@Component({
  selector: 'app-your-decks',
  templateUrl: './your-decks.component.html',
  styleUrls: ['./your-decks.component.css'],
})
export class YourDecksComponent implements OnInit {
  fullName = localStorage.getItem('fullName');

  decks: any[] = [];
  // Define a collection to store decks
  decksCollection: AngularFirestoreCollection<any>;
  currentPage: number = 1; // Initially, display the first page
  decksPerPage: number = 9; // Number of decks per page

  totalPages: number = 1;
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private dataService: DataService
  ) {
    this.decksCollection = afs.collection('Decks');
  }

  ngOnInit() {
    const email: any = localStorage.getItem('email');
    this.dataService.getYourDecks(email).subscribe((decks: any[]) => {
      this.decks = decks.map((deck) => {
        const data = deck.payload.doc.data() as any;
        const id = deck.payload.doc.id;
        return { id, ...data, cardCount: data.cards.length };
      });
      this.totalPages = Math.ceil(this.decks.length / this.decksPerPage);
    });
  }

  // Function to navigate to a specific deck when it's clicked
  navigateToDeck(deckId: string) {
    this.router.navigate(['yourDeck', deckId]);
  }

  navigateToEditDeck(deckId: string) {
    this.router.navigate(['updateDeck', deckId]);
  }

  getDecksForCurrentPage() {
    const startIndex = (this.currentPage - 1) * this.decksPerPage;
    const endIndex = startIndex + this.decksPerPage;
    return this.decks.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
