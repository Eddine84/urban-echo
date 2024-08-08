import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import {
  SignalStatus,
  type Signalemenent,
} from '../pages/signalements/signalement.model';
import { Observable, from, of, switchMap } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  docData,
} from '@angular/fire/firestore';
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SignalementsService {
  detectChanges() {
    throw new Error('Method not implemented.');
  }
  private firestore = inject(Firestore);
  private destroRef = inject(DestroyRef);
  authService = inject(AuthService);
  db = getFirestore();
  userId = signal('');

  signalementsSignal = signal<Signalemenent[]>([]);
  get signalements() {
    return this.signalementsSignal.asReadonly();
  }

  async addSignalement(signalement: Signalemenent): Promise<void> {
    const signalementsCollection = collection(this.firestore, 'signalements');
    const newDocRef = doc(signalementsCollection);
    signalement.id = newDocRef.id;
    // signalement.confirmedByUsers = [signalement.id];
    return setDoc(newDocRef, signalement);
  }

  async addConfirmation(
    selectedSignalementId: string,
    userId: string
  ): Promise<void> {
    const signalementDocRef = doc(
      this.firestore,
      `signalements/${selectedSignalementId}`
    );
    const signalementSnapshot = await getDoc(signalementDocRef);
    if (signalementSnapshot.exists()) {
      const signalementData = signalementSnapshot.data() as Signalemenent;
      // he chercher sur db qu il ya pas l'id user pour le laisser faire un signalement
      if (!signalementData.confirmedByUsers.includes(userId)) {
        signalementData.confirmedByUsers.push(userId);
        await setDoc(signalementDocRef, signalementData);
      }
    } else {
      console.error('Signalement does not exist.');
      throw new Error('Signalement does not exist.');
    }
  }

  async deleteSignalement(id: string, destinataire: string[]): Promise<void> {
    const signalementDocRef = doc(this.firestore, `signalements/${id}`);
    const signalementSnapshot = await getDoc(signalementDocRef);

    if (signalementSnapshot.exists()) {
      const signalementData = signalementSnapshot.data() as Signalemenent;

      if (
        signalementData.id === id &&
        signalementData.recipient.some((element) =>
          destinataire.includes(element)
        )
      ) {
        await deleteDoc(signalementDocRef);
        console.log('Document successfully deleted!');
      } else {
        throw new Error('User not authorized to delete this document.');
      }
    } else {
      console.error('No such document!');
      throw new Error('No such document!');
    }
  }

  //je dois creer un login et recuperer l'id de destinarie compte et chequer sur la liste que le signaleur a pusher pour pourvoir verifier si c'est le bon pour autoriser le update
  async updateSignalementStatus(
    selectedSignalementId: string,
    destinataire: string[]
  ) {
    const signalementDocRef = doc(
      this.firestore,
      `signalements/${selectedSignalementId}`
    );
    const signalementSnapshot = await getDoc(signalementDocRef);
    if (signalementSnapshot.exists()) {
      const signalementData = signalementSnapshot.data() as Signalemenent;
      console.log('attention this is sginalement :', signalementData.id);
      console.log('attention this is selected!! :', selectedSignalementId);
      console.log('attention ce ci est destinataire :', destinataire);
      if (
        signalementData.id === selectedSignalementId &&
        signalementData.recipient.some((element) =>
          destinataire.includes(element)
        )
      ) {
        signalementData.status = 'Résolu';
        await setDoc(signalementDocRef, signalementData);
        console.log('Signalement status updated to "Résolu".');
      } else {
        throw new Error(
          'seulement les diestinarie sont autorisé a changer le statut  cette annonce'
        );
      }
    } else {
      throw new Error('No such document!');
    }
  }
  private fetchSignalements(): Observable<Signalemenent[]> {
    const user = this.authService.userSignal;
    const isAnonymous = user()?.isAnonymous;

    const signalementsCollection = collection(this.firestore, 'signalements');

    if (isAnonymous) {
      // Utilisateur anonyme : récupérer tous les signalements
      return collectionData(signalementsCollection, {
        idField: 'id',
      }) as Observable<Signalemenent[]>;
    } else {
      // Utilisateur authentifié : récupérer les signalements spécifiques à la catégorie de l'utilisateur
      const usersDocRef = doc(this.firestore, 'users', user()?.uid!);

      return from(getDoc(usersDocRef)).pipe(
        switchMap((userSnapshot) => {
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const userCategory = userData['categorie'];
            console.log('userData', userData);
            console.log('userCategory', userCategory);
            const categoryQuery = query(
              signalementsCollection,
              where('recipient', 'array-contains', userCategory)
            );
            return collectionData(categoryQuery, {
              idField: 'id',
            }) as Observable<Signalemenent[]>;
          } else {
            console.error('Utilisateur non trouvé dans la collection users.');
            return of([]);
          }
        })
      );
    }
  }
  loadSignalements(): Observable<Signalemenent[]> {
    return this.fetchSignalements();
  }
  getSignalementById(id: string): Observable<Signalemenent | undefined> {
    const signalementDoc = doc(this.firestore, `signalements/${id}`);
    return docData(signalementDoc, { idField: 'id' }) as Observable<
      Signalemenent | undefined
    >;
  }
}
