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
import {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  doc,
  limit,
  deleteDoc,
} from 'firebase/firestore';

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

  // async getCategories(): Promise<any[]> {
  //   const db = getFirestore();
  //   const categoriesSnapshot = await getDocs(collection(db, 'categories'));
  //   const categories = categoriesSnapshot.docs.map((doc) => doc.data());
  //   return categories;
  // }

  // async updateCategories(categoryValue: string) {
  //   const db = getFirestore();
  //   // Accéder à la collection où les catégories sont stockées
  //   const categoriesCollection = collection(db, 'categories');

  //   // Créer une requête pour trouver la catégorie spécifiée
  //   const q = query(categoriesCollection, where('value', '==', categoryValue));

  //   // Exécuter la requête
  //   const querySnapshot = await getDocs(q);

  //   // Parcourir les résultats de la requête (devrait normalement n'avoir qu'un seul résultat pour une clé unique)
  //   querySnapshot.forEach(async (document) => {
  //     // Effacer le document trouvé
  //     await deleteDoc(doc(db, 'categories', document.id));
  //   });
  // }

  // async isCategoryUsed(categoryValue: string): Promise<boolean> {
  //   const db = getFirestore();
  //   const querySnapshot = await getDocs(
  //     query(
  //       collection(db, 'categories'),
  //       where('text', '==', categoryValue),
  //       limit(1)
  //     )
  //   );
  //   return !querySnapshot.empty;
  // }
}
