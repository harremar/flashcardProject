import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      this.router.navigate(['admin/list']);
    } catch (error) {
      console.log(error);
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.router.navigate(['admin/list']);
    } catch (error) {
      console.log(error);
    }
  }

  updateUser(userId: string, newData: any) {
    return this.firestore.collection('Users').doc(userId).update(newData);
  }

  private isAuthenticated: any = localStorage.getItem('userIsLoggedIn');
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
