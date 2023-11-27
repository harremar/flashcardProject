import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

import { AuthService } from './auth-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private storage: Storage = inject(Storage);
  isMenuVisible = false;
  isMenuVisible2 = false;
  d: string = 'inactive';
  m: string = 'inactive';
  u: string = 'inactive';

  fullName = localStorage.getItem('fullName');
  userEmail = localStorage.getItem('email');
  firstName = localStorage.getItem('fname');
  lastName = localStorage.getItem('lname');
  profileImg = localStorage.getItem('profileImg');

  user: any;
  updatedfName: string = ''; // Updated to explicitly define type
  updatedlName: string = ''; // Updated to explicitly define type
  proImg: string = ''; // Updated to explicitly define type

  userIsLoggedIn: boolean = false;
  decks: any[] = [];

  @ViewChild('fnameInput') fnameInput: ElementRef | undefined;
  @ViewChild('lnameInput') lnameInput: ElementRef | undefined;
  @ViewChild('profileImageInput') profileImageInput: ElementRef | undefined;

  person: Observable<any> | undefined; // Observable to hold user data
  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private userService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if there is a value in LocalStorage
    const loggedIn = localStorage.getItem('userIsLoggedIn');
    if (loggedIn) {
      this.userIsLoggedIn = JSON.parse(loggedIn);
      // console.log(this.userIsLoggedIn);
    } else {
      this.userIsLoggedIn = false;
    }
    // this.updatedfName = localStorage.getItem('fname') || ''; // Use the value from localStorage or an empty string as a fallback
    // this.updatedlName = localStorage.getItem('lname') || ''; // Use the value from localStorage or an empty string as a fallback
    // this.proImg = localStorage.getItem('profileImage') || '';

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      console.log(uid);
    }
    this.person = this.firestore
      .collection('Users')
      .doc('userId123')
      .valueChanges();
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
    // console.log(this.isMenuVisible);
  }

  toggleMenu2() {
    this.isMenuVisible2 = !this.isMenuVisible2;
    // console.log(this.isMenuVisible);
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.isMenuVisible = false;
  }

  logoutUser() {
    localStorage.setItem('userIsLoggedIn', JSON.stringify('false'));
    this.userIsLoggedIn = false;
    localStorage.clear();
    this.router.navigate(['home']);
    // this.isMenuVisible = !this.isMenuVisible;
    this.isMenuVisible2 = !this.isMenuVisible2;
  }

  async deleteUser(uid: string) {
    // Reference the Firestore collection and document for the user
    const userRef = this.firestore.collection('Users').doc(uid);

    // First, delete the user's data from the Firestore database
    try {
      await userRef.delete();
      console.log('User data deleted from Firestore');
      this.router.navigate(['home']);
      localStorage.clear();
    } catch (error) {
      console.error('Error deleting user data from Firestore:', error);
    }

    // Next, delete the user from Firebase Authentication
    const auth: any = getAuth();
    try {
      await deleteDoc(doc(auth, 'Users', uid));
      console.log('User deleted from Authentication');
    } catch (error) {
      console.error('Error deleting user from Authentication:', error);
    }
  }

  deleteCurrentUser() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      this.deleteUser(uid);
      user
        .delete()
        .then(() => {
          // Go to login screen
          alert('You have deleted your account');
          localStorage.setItem('userIsLoggedIn', JSON.stringify('false'));
          this.userIsLoggedIn = false;
        })
        .catch((error) => {
          // Handle error
        });
    }
  }

  // Function to update user information
  updateUserInfo() {
    if (!this.updatedfName || !this.updatedlName) {
      alert('First Name and Last Name are required.'); // Display an error message
      return; // Exit the function without further processing
    }

    // Update user info in Firestore for each deck
    this.decks.forEach((deck) => {
      const deckId = deck.id;
      const newData = {
        creator: this.updatedfName + ' ' + this.updatedlName,
      };

      this.firestore
        .collection('Decks')
        .doc(deckId)
        .update(newData)
        .then(() => {
          console.log(
            `User information updated for deck ${deckId} successfully`
          );
        })
        .catch((error) => {
          console.error(
            `Error updating user information for deck ${deckId}:`,
            error
          );
          alert(`Error updating user information for deck ${deckId}`);
        });
    });

    localStorage.setItem('fname', this.updatedfName);
    localStorage.setItem('lname', this.updatedlName);
    localStorage.setItem(
      'fullName',
      this.updatedfName + ' ' + this.updatedlName
    );
    this.fullName = localStorage.getItem('fullName');
    this.userEmail = localStorage.getItem('email');
    this.firstName = localStorage.getItem('fname');
    this.lastName = localStorage.getItem('lname');
    this.isMenuVisible2 = !this.isMenuVisible2;
    this.moreOption();

    const auth = getAuth();
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newData = {
        fName: this.updatedfName,
        lName: this.updatedlName,
      };

      this.userService
        .updateUser(userId, newData)
        .then(() => {
          console.log('User information updated successfully');
          alert('User information updated successfully');

          // Clear the input fields
          if (this.fnameInput && this.lnameInput) {
            this.fnameInput.nativeElement.value = '';
            this.lnameInput.nativeElement.value = '';
          }
          // Reload the user data or perform other actions
        })
        .catch((error) => {
          console.error('Error updating user information:', error);
          alert('Error updating user information');
        });
    } else {
      console.log('No user is currently authenticated.');
    }
  }

  moreOption() {
    this.m = this.m == 'inactive' ? 'active' : 'inactive';
  }
  deleteOption() {
    this.d = this.d == 'inactive' ? 'active' : 'inactive';
  }

  uploadOption() {
    this.u = this.u == 'inactive' ? 'active' : 'inactive';
  }

  async uploadFile(input: HTMLInputElement) {
    if (!input.files) return;

    const file = input.files[0];
    if (file) {
      const timestamp = new Date().getTime();
      const storageRef = ref(
        this.storage,
        'user-images/' + timestamp + '-' + file.name
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        const snapshot = await uploadTask;
        // Now that the upload is completed, get the download URL
        const imageUrl = await getDownloadURL(storageRef);

        // Use the download URL as needed
        console.log('image URL', imageUrl);
        localStorage.setItem('profileImg', imageUrl);
        localStorage.getItem('profileImg');

        // Return the image URL
        // return imageUrl;
        // if (userId) {
        //   this.updateImageUrlInFirestore(userId, imageUrl);
        // }
        const auth = getAuth();
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const newData = {
            // fName: this.updatedfName,
            // lName: this.updatedlName,
            profileImg: imageUrl,
          };

          this.userService
            .updateUser(userId, newData)
            .then(() => {
              console.log('User information updated successfully');
              alert('User information updated successfully');

              // Clear the input fields
              if (this.fnameInput && this.lnameInput) {
                this.fnameInput.nativeElement.value = '';
                this.lnameInput.nativeElement.value = '';
              }
              // Reload the user data or perform other actions
            })
            .catch((error) => {
              console.error('Error updating user information:', error);
              alert('Error updating user information');
            });
        } else {
          console.log('No user is currently authenticated.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
  // updateImageUrlInFirestore(userId: string, imageUrl: string) {
  //   const userDeckRef = this.firestore.collection('Users').doc(userId);

  //   // Assuming 'deck' is a field in the user document representing the deck
  //   userDeckRef.update({
  //     imageUrl: imageUrl,
  //   });
  // }
}
