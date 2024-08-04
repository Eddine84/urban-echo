import { Injectable } from '@angular/core';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  browserLocalPersistence,
  User,
  updateProfile,
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

  // Fonction pour s'inscrire avec email et mot de passe
  async register(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return null;
    }
  }

  // Fonction pour se connecter avec email et mot de passe
  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return null;
    }
  }

  // Fonction pour envoyer un email de réinitialisation de mot de passe
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Email de réinitialisation de mot de passe envoyé.');
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email de réinitialisation de mot de passe:",
        error
      );
    }
  }
}
