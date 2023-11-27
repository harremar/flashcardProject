import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  getDoc,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
} from 'firebase/firestore';
import { async } from '@angular/core/testing';

const firebaseConfig = {
  apiKey: 'AIzaSyA4c2OycAAjcVGB6yBFOO64Exs8vo-94zY',
  authDomain: 'n423-data-harrell.firebaseapp.com',
  projectId: 'n423-data-harrell',
  storageBucket: 'n423-data-harrell.appspot.com',
  messagingSenderId: '187657843004',
  appId: '1:187657843004:web:3cee58a9d206c7209a6e39',
  measurementId: 'G-98FJJCDDW9',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {}
  navigate(route: string) {
    this.router.navigate([route]);
  }

  email = '';
  password = '';

  async loginUser() {
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then(async () => {
        localStorage.setItem('userIsLoggedIn', JSON.stringify('true'));

        this.router.navigate(['explore']);

        setTimeout(() => {
          window.location.reload();
        }, 1500);

        // Fetch the user's first and last name from the database
        const q = query(
          collection(db, 'Users'),
          where('email', '==', this.email)
        );
        const querySnapshot = await getDocs(q);
        console.log('query ', querySnapshot.docs);
        if (querySnapshot.docs.length > 0) {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data());
            const userData = doc.data();
            console.log(userData['fName']);
            console.log(userData['lName']);
            localStorage.setItem(
              'fullName',
              userData['fName'] + ' ' + userData['lName']
            );
            localStorage.setItem(
              'firstLetter',
              userData['fName'].charAt(0).toUpperCase()
            );
            localStorage.setItem(
              'fname',
              userData['fName'].charAt(0).toUpperCase() +
                userData['fName'].slice(1)
            );
            localStorage.setItem(
              'lname',
              userData['lName'].charAt(0).toUpperCase() +
                userData['lName'].slice(1)
            );
            localStorage.setItem('email', userData['email']);
            localStorage.setItem('profileImg', userData['profileImg']);
          });
        } else {
          console.log('no data');
        }
      })
      .catch((error) => {
        console.log(error.code);
        alert('Wrong credentials');
        localStorage.setItem('userIsLoggedIn', JSON.stringify('false'));
      });
  }
}
