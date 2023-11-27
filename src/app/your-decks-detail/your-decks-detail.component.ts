import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-your-decks-detail',
  templateUrl: './your-decks-detail.component.html',
  styleUrls: ['./your-decks-detail.component.css'],
})
export class YourDecksDetailComponent implements OnInit {
  deck: any = {};
  d: string = 'inactive';
  m: string = 'inactive';

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
          }
        });
    }
  }

  // Function to navigate to a specific deck when it's clicked
  navigateToStudyDeck(deckId: string) {
    this.router.navigate(['studyDeck', deckId]);
  }

  navigateToEditDeck(deckId: string) {
    this.router.navigate(['updateDeck', deckId]);
  }

  navigateToYourDecks() {
    this.router.navigate(['yourDecks']);
  }

  deleteDeck() {
    this.d = this.d == 'inactive' ? 'active' : 'inactive';
  }

  deleting(deckId: string) {
    console.log(deckId);
    this.router.navigate(['yourDecks']);

    this.afs
      .collection('Decks')
      .doc(deckId)
      .delete()
      .then(() => {
        console.log('Deck deleted successfully');
        // Navigate to another page or refresh the current page
        this.router.navigate(['yourDecks']);
        alert('You have deleted Deck');
      })
      .catch((error) => {
        console.error('Error deleting deck: ', error);
      });
  }

  printPage() {
    window.print();
  }

  moreOption() {
    this.m = this.m == 'inactive' ? 'active' : 'inactive';
  }

  copyLink() {
    const url = window.location.href;

    // Create a temporary input element to copy the URL to the clipboard
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = url;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    // Display a message or perform any other desired action
    alert('Link has been copied to clipboard');
    this.m = this.m == 'inactive' ? 'active' : 'inactive';
  }
}
