import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {}

  navigate(route: string) {
    this.router.navigate([route]);
  }

  fName = '';
  lName = '';
  email = '';
  password = '';

  async createUser() {
    if (
      this.fName == '' ||
      this.lName == '' ||
      this.email == '' ||
      this.password == ''
    ) {
      alert('All feilds need to be filled');
    } else {
      const auth = getAuth();

      try {
        const result = await this.afAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );

        if (result.user) {
          const uid = result.user.uid;

          // Use the UID as the document ID when adding user data to Firestore
          await this.firestore.collection('Users').doc(uid).set({
            fName: this.fName,
            lName: this.lName,
            email: this.email,
            password: this.password,
          });

          localStorage.setItem('fullName', this.fName + ' ' + this.lName);
          localStorage.setItem('fname', this.fName);
          localStorage.setItem('lname', this.lName);
          localStorage.setItem(
            'firstLetter',
            this.fName.charAt(0).toUpperCase()
          );
          localStorage.setItem('email', this.email);
          localStorage.setItem('userIsLoggedIn', JSON.stringify('true'));

          this.router.navigate(['explore']);

          setTimeout(() => {
            window.location.reload();
          }, 2000);
          console.log('User data added to Firestore with UID as document ID');
          alert('Hello ' + this.fName + '! You have created an account');
          this.fName = '';
          this.lName = '';
          this.email = '';
          this.password = '';
        }
      } catch (error) {
        console.log('Error creating user and adding data:', error);
        if (
          error ==
          'FirebaseError: Firebase: The email address is badly formatted. (auth/invalid-email).'
        ) {
          alert('Email is badly forrmatted');
        } else if (
          error ==
          'FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).'
        ) {
          alert('Password needs to be at least 6 characters long');
        } else {
          alert('Email may already be used. Please try another email.');
        }
      }
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log('User is registered', result.user);
    } catch (error) {
      console.log('Error registering user', error);
    }
  }
}
