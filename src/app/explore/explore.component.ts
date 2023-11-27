import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router'; // Import Router
import { data } from 'jquery';
import { RecentlyVisitedService } from '../recently-visited.service';
import { User } from 'firebase/auth'; // Import User from firebase/auth

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
  providers: [RecentlyVisitedService],
})
export class ExploreComponent implements OnInit {
  decks: any[] = [];
  // Define a collection to store decks
  decksCollection: AngularFirestoreCollection<any>;
  usersCollection: AngularFirestoreCollection<any>;

  subjects: string[] = [
    'Math',
    'English',
    'Languages',
    'Social Studies',
    'Science',
    'Music',
    'Art',
    'History',
    'Computer Science',
  ];
  visibleSubjects: string[] = [];
  startIndex: number = 0;
  subjectsPerPage: number = 4;

  currentPage: number = 1; // Initially, display the first page
  decksPerPage: number = 9; // Number of decks per page

  word = '';
  totalPages: number = 1;

  recentlyVisitedDecks: any[] = [];

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private dataService: DataService,
    private recentlyVisitedService: RecentlyVisitedService
  ) {
    this.decksCollection = afs.collection('Decks');
    this.updateVisibleSubjects();
    this.usersCollection = afs.collection('Users');
  }

  ngOnInit() {
    this.recentlyVisitedService
      .loadRecentlyVisitedDecks()
      .subscribe((user: User | null) => {
        if (user) {
          const userId = user.uid;
          this.loadRecentlyVisitedDecks(userId);
        }
      });

    this.dataService.getAllDecks().subscribe((decks: any[]) => {
      this.decks = decks.map((deck) => {
        const data = deck.payload.doc.data() as any;
        const id = deck.payload.doc.id;
        return { id, ...data, cardCount: data.cards.length };
      });

      this.totalPages = Math.ceil(this.decks.length / this.decksPerPage);
    });
    // Retrieve recently visited decks from localStorage
    const storedRecentlyVisitedDecks = localStorage.getItem(
      'recentlyVisitedDecks'
    );
    if (storedRecentlyVisitedDecks) {
      this.recentlyVisitedDecks = JSON.parse(storedRecentlyVisitedDecks);
    }
  }

  loadRecentlyVisitedDecks(userId: string) {
    this.recentlyVisitedService
      .loadRecentlyVisitedDecks()
      .subscribe((userData: any) => {
        if (userData && userData.recentlyVisitedDecks) {
          this.recentlyVisitedDecks = userData.recentlyVisitedDecks;
        }
      });
  }

  updateVisibleSubjects() {
    this.visibleSubjects = this.subjects.slice(
      this.startIndex,
      this.startIndex + this.subjectsPerPage
    );
  }

  scrollLeft() {
    if (this.startIndex > 0) {
      this.startIndex -= 1;
      this.updateVisibleSubjects();
    }
  }

  scrollRight() {
    if (this.startIndex + this.subjectsPerPage < this.subjects.length) {
      this.startIndex += 1;
      this.updateVisibleSubjects();
    }
  }

  navigateToDeck(deckId: string) {
    // Find the deck in the main decks array
    const selectedDeck = this.decks.find((deck) => deck.id === deckId);

    // Check if the deck is not already in the recentlyVisitedDecks
    const isNotInRecentlyVisited = !this.recentlyVisitedDecks.some(
      (deck) => deck.id === deckId
    );

    // Add the selected deck to the recentlyVisitedDecks array if not already present
    if (isNotInRecentlyVisited) {
      this.recentlyVisitedDecks.unshift(selectedDeck);

      // Limit the array to the top 3 decks
      this.recentlyVisitedDecks = this.recentlyVisitedDecks.slice(0, 3);

      // Update the recently visited decks and save to localStorage
      localStorage.setItem(
        'recentlyVisitedDecks',
        JSON.stringify(this.recentlyVisitedDecks)
      );
      // Update the recently visited decks using the service
      this.recentlyVisitedService.updateRecentlyVisitedDecks(
        this.recentlyVisitedDecks
      );
    }

    // Navigate to the selected deck
    this.router.navigate(['deck', deckId]);
  }

  searchCat(searchCat: string) {
    console.log(searchCat);
    this.dataService.getDeckSearch(searchCat).subscribe((decks: any[]) => {
      this.decks = decks.map((deck) => {
        const data = deck.payload.doc.data() as any;
        const id = deck.payload.doc.id;
        return { id, ...data, cardCount: data.cards.length };
      });
      console.log(this.decks);
    });
  }

  searchAll() {
    console.log(this.word);
    this.dataService.getDeckSearch2(this.word).subscribe(
      (decks: any[]) => {
        this.decks = decks.map((deck) => {
          const data = deck.payload.doc.data() as any;
          const id = deck.payload.doc.id;
          return { id, ...data, cardCount: data.cards.length };
        });
        console.log(this.decks);
      },
      (error) => {
        console.error('Error fetching decks:', error);
      }
    );
    this.dataService.getDeckSearch3(this.word.toLowerCase()).subscribe(
      (decks: any[]) => {
        this.decks = decks.map((deck) => {
          const data = deck.payload.doc.data() as any;
          const id = deck.payload.doc.id;
          return { id, ...data, cardCount: data.cards.length };
        });
        console.log(this.decks);
      },
      (error) => {
        console.error('Error fetching decks:', error);
      }
    );
    this.word = '';
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
