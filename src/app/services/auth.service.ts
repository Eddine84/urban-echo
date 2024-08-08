import { Injectable, signal } from '@angular/core';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  browserLocalPersistence,
  User,
  fetchSignInMethodsForEmail,
} from '@angular/fire/auth';
import { signOut } from 'firebase/auth';

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
  userSignal = signal<User | null>(null);
  get user() {
    return this.userSignal.asReadonly();
  }

  // Fonction pour se connecter anonymement
  async signInAnonymously(): Promise<User | null> {
    try {
      const userCredential = await signInAnonymously(this.auth);
      const user = userCredential.user;
      this.userSignal.set(user);
      return user;
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
      const user = userCredential.user;
      this.userSignal.set(user);
      return user;
    } catch (error) {
      throw error;
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
      const user = userCredential.user;
      this.userSignal.set(user);
      return user;
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        console.error('Mot de passe incorrect');
      } else if (error.code === 'auth/user-not-found') {
        console.error('Utilisateur non trouvé');
      } else {
        console.error('Erreur lors de la connexion:', error.message);
      }
      return null;
    }
  }
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSignal.set(null);
    await this.signInAnonymously();
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Email de réinitialisation de mot de passe envoyé.');
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email de réinitialisation de mot de passe:",
        error
      );
      throw error;
    }
  }

  getUserFromLocalStorage(): User | null {
    const keys = Object.keys(localStorage);
    const authUserKey = keys.find((key) =>
      key.startsWith('firebase:authUser:')
    );
    if (authUserKey) {
      const user = localStorage.getItem(authUserKey);
      if (user) {
        const userData: User = JSON.parse(user);
        this.userSignal.set(userData);
        return userData;
      }
    }
    return null;
  }

  // Fonction pour vérifier si un utilisateur existe via son email
  async checkIfUserExists(email: string): Promise<boolean> {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
      return false;
    }
  }
}
