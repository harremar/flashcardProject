import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from '@angular/fire/storage';

import { Observable, finalize } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-update-deck',
  templateUrl: './update-deck.component.html',
  styleUrls: ['./update-deck.component.css'],
})
export class UpdateDeckComponent implements OnInit {
  private storage: Storage = inject(Storage);
  decksCollection: AngularFirestoreCollection<any>;
  @Input() cardNumber: number | undefined;
  @Output() delete = new EventEmitter<void>();
  @ViewChild('titleInput')
  titleInput!: ElementRef;
  @ViewChild('descriptionInput')
  descriptionInput!: ElementRef;
  @ViewChild('subjectInput')
  subjectInput!: ElementRef;
  term: string = '';
  definition: string = '';
  deck: any = {};

  private basePath = '/uploads';

  public uploadImageURL = '../../assets/images/img.png';

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.decksCollection = afs.collection('Decks');
  }
  cards = [
    { term: '', definition: '', image: '' },
    { term: '', definition: '', image: '' },
  ];
  name = '';
  description = '';
  subject = '';

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

  updateDeck() {
    // Get the values from the template reference variables
    this.name = this.titleInput.nativeElement.value;
    this.description = this.descriptionInput.nativeElement.value;
    this.subject = this.subjectInput.nativeElement.value;

    const updatedDeck = {
      cards: this.deck.cards,
      name: this.name,
      description: this.description,
      subject: this.subject,
      creator: localStorage.getItem('fullName'),
      email: localStorage.getItem('email'),
      time: new Date().toLocaleDateString(),
      profileImg: localStorage.getItem('profileImg'),
    };

    if (this.name == '') {
      alert('In order to update the deck, it needs a title');
    } else if (this.subject == '') {
      alert('Error. Please choose a subject');
    } else if (this.deck.id) {
      // Generate searchKeywords based on the updated deck name
      const searchKeywords = this.name.toLowerCase().split(' ');

      // Update the deck in the Firestore collection, including searchKeywords
      this.decksCollection
        .doc(this.deck.id)
        .update({ ...updatedDeck, searchKeywords: searchKeywords })
        .then(() => {
          alert('Deck updated successfully');
          this.router.navigate(['yourDeck', this.deck.id]);
        })
        .catch((error) => {
          console.error('Error updating deck: ', error);
          alert('Error updating the deck');
        });
    }
  }

  addCard() {
    this.deck.cards.push({ term: '', definition: '', image: '' });
    console.log('adding card');
  }

  deleteCard(index: number) {
    this.deck.cards.splice(index, 1);
  }

  async uploadFile(input: HTMLInputElement, cardIndex: number) {
    if (!input.files) return;

    const file = input.files[0];
    if (file) {
      const timestamp = new Date().getTime();
      const storageRef = ref(
        this.storage,
        'images/' + timestamp + '-' + file.name
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        const snapshot = await uploadTask;
        // Now that the upload is completed, get the download URL
        const imageUrl = await getDownloadURL(storageRef);

        // Use the download URL as needed
        this.deck.cards[cardIndex].image = imageUrl;
        console.log('image URL', imageUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
}
