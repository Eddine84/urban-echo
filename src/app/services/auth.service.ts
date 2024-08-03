import { Injectable } from '@angular/core';
import {
  Auth,
  signInAnonymously,
  browserLocalPersistence,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {
    this.auth
      .setPersistence(browserLocalPersistence)
      .then(() => {
        console.log(
          "Persistance de l'authentification configurée sur le stockage local."
        );
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la configuration de la persistance de l'authentification:",
          error
        );
      });
  }

  // Fonction pour se connecter anonymement
  async signInAnonymously(): Promise<User | null> {
    try {
      const userCredential = await signInAnonymously(this.auth);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de la connexion anonyme:', error);
      return null;
    }
  }

  // Fonction pour récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
