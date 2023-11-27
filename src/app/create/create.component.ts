// import { AngularFireStorage } from '@angular/fire/compat/storage';
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
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { serverTimestamp } from 'firebase/firestore';

import { Router } from '@angular/router';
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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
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

  // backgroundImageUrl: string = '../../assets/images/img.png';

  private basePath = '/uploads';

  public uploadImageURL = '../../assets/images/img.png';

  constructor(
    private auth: Auth,
    private afs: AngularFirestore,
    private router: Router // private storage: AngularFireStorage
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

  ngOnInit(): void {}

  createNewDeck() {
    // Get the values from the template reference variables
    this.name = this.titleInput.nativeElement.value;
    this.description = this.descriptionInput.nativeElement.value;
    this.subject = this.subjectInput.nativeElement.value;

    const newDeck = {
      cards: this.cards,
      name: this.name,
      description: this.description,
      subject: this.subject,
      creator: localStorage.getItem('fullName'),
      email: localStorage.getItem('email'),
      time: new Date().toLocaleDateString(),
      profileImg: localStorage.getItem('profileImg'),
      // image: imageURL,
    };
    // Get the image file from the input element

    if (this.name == '') {
      alert('In order to create a deck, it needs a title');
    } else if (this.subject == '') {
      alert('Error. Please choose a subject');
    } else if (
      this.cards[0].term == '' ||
      this.cards[1].term == '' ||
      this.cards[0].definition == '' ||
      this.cards[1].definition == ''
    ) {
      alert('Error. You need at least 2 cards');
    } else {
      // Generate searchKeywords based on the deck name
      const searchKeywords = this.name.toLowerCase().split(' ');

      // Add the new deck to the Firestore collection, including searchKeywords
      this.decksCollection
        .add({ ...newDeck, searchKeywords: searchKeywords })
        .then((docRef) => {
          alert('Deck has been created');
          console.log('Deck added with ID: ', docRef.id);
          this.router.navigate(['yourDecks']);
        })
        .catch((error) => {
          console.error('Error adding deck: ', error);
        });
    }
  }

  addCard() {
    this.cards.push({ term: '', definition: '', image: '' });
  }

  deleteCard(index: number) {
    this.cards.splice(index, 1);
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
        this.cards[cardIndex].image = imageUrl;
        console.log('image URL', imageUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
}
