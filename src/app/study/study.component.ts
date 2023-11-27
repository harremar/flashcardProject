import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css'],
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'rotateY(180deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
        })
      ),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in')),
    ]),
  ],
})
export class StudyComponent implements OnInit {
  deck: any = {};
  currentCard: any;
  currentCardIndex: number = 0;
  flip: string = 'inactive';
  terms: string = 'true';

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    const deckId = this.route.snapshot.paramMap.get('id');

    if (deckId) {
      this.afs
        .collection('Decks')
        .doc(deckId)
        .valueChanges()
        .subscribe((data) => {
          if (data) {
            this.deck = data;
            this.deck.id = deckId;

            // Retrieve the current card index from local storage
            const savedIndex = localStorage.getItem('currentCardIndex');
            if (savedIndex) {
              this.currentCardIndex = Number(savedIndex);
              this.currentCard = this.deck.cards[this.currentCardIndex];
            } else {
              this.currentCard = this.deck.cards[0];
              this.currentCardIndex = 0;
            }
          }
        });
    }
    this.startOver();
  }

  nextCard(): void {
    // Reset flip state to 'inactive' when moving to the next card
    this.flip = 'inactive';
    const currentIndex = this.deck.cards.indexOf(this.currentCard);
    if (currentIndex < this.deck.cards.length - 1) {
      this.currentCard = this.deck.cards[currentIndex + 1];
      this.currentCardIndex = currentIndex + 1;

      // Save the current card index to local storage
      localStorage.setItem(
        'currentCardIndex',
        this.currentCardIndex.toString()
      );
    }
  }

  previousCard(): void {
    const currentIndex = this.deck.cards.indexOf(this.currentCard);
    if (currentIndex > 0) {
      this.currentCard = this.deck.cards[currentIndex - 1];
      this.currentCardIndex = currentIndex - 1;

      // Save the current card index to local storage
      localStorage.setItem(
        'currentCardIndex',
        this.currentCardIndex.toString()
      );
    }
  }

  toggleFlip(): void {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
  }

  switch(): void {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
    this.currentCardIndex = 0;
    this.currentCard = this.deck.cards[this.currentCardIndex];
  }

  shuffle(): void {
    console.log('shuffle deck');
    for (let i = this.deck.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck.cards[i], this.deck.cards[j]] = [
        this.deck.cards[j],
        this.deck.cards[i],
      ];
      console.log(j);
    }
    // this.startOver();
  }
  // Add these methods to handle the new buttons
  startOver(): void {
    this.shuffle();
    this.currentCardIndex = 0;
    this.currentCard = this.deck.cards[this.currentCardIndex];
    this.flip = 'inactive';

    // Save the current card index to local storage
    localStorage.setItem('currentCardIndex', this.currentCardIndex.toString());
  }

  navigateToDeck(deckId: string) {
    this.router.navigate(['deck', deckId]);
    this.startOver();
  }
}
