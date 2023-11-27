import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.css'],
})
export class DeckDetailComponent implements OnInit {
  deck: any = {};
  d: string = 'inactive';

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

  navigateToExplore() {
    this.router.navigate(['explore']);
  }

  printPage() {
    window.print();
  }

  moreOption() {
    this.d = this.d == 'inactive' ? 'active' : 'inactive';
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
    this.d = this.d == 'inactive' ? 'active' : 'inactive';
  }
}
