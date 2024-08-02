import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import {
  SignalStatus,
  type Signalemenent,
} from '../pages/signalements/signalement.model';
import { Observable } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  docData,
} from '@angular/fire/firestore';
import { addDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class SignalementsService {
  private firestore = inject(Firestore);
  private destroRef = inject(DestroyRef);

  loadSignalements() {
    return this.fetchSignalements();
  }

  async addSignalement(signalement: Signalemenent): Promise<void> {
    const signalementsCollection = collection(this.firestore, 'signalements');
    const newDocRef = doc(signalementsCollection);
    signalement.id = newDocRef.id;
    signalement.confirmedByUsers = [signalement.id];
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
      if (!signalementData.confirmedByUsers.includes(userId)) {
        signalementData.confirmedByUsers.push(userId);
        await setDoc(signalementDocRef, signalementData);
      }
    } else {
      console.error('Signalement does not exist.');
      throw new Error('Signalement does not exist.');
    }
  }

  async deleteSignalement(id: string, destinataire: string): Promise<void> {
    const signalementDocRef = doc(this.firestore, `signalements/${id}`);
    const signalementSnapshot = await getDoc(signalementDocRef);

    if (signalementSnapshot.exists()) {
      const signalementData = signalementSnapshot.data() as Signalemenent;
      console.log(destinataire);
      console.log(signalementData);
      if (
        signalementData.id === id &&
        signalementData.recipient.includes(destinataire)
      ) {
        await deleteDoc(signalementDocRef);
        console.log('Document successfully deleted!');
      } else {
        console.error('User not authorized to delete this document.');
        alert(
          'seulement les diestinarie sont autorisé a cloturer cette annonce'
        );
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
    destinataire: string
  ) {
    const signalementDocRef = doc(
      this.firestore,
      `signalements/${selectedSignalementId}`
    );
    const signalementSnapshot = await getDoc(signalementDocRef);
    if (signalementSnapshot.exists()) {
      const signalementData = signalementSnapshot.data() as Signalemenent;

      if (
        signalementData.id === selectedSignalementId &&
        signalementData.recipient.includes(destinataire)
      ) {
        signalementData.status = 'Résolu';
        await setDoc(signalementDocRef, signalementData);
        console.log('Signalement status updated to "Résolu".');
      } else {
        console.error('User not authorized to change status on this document.');
        alert(
          'seulement les diestinarie sont autorisé a changer le statut  cette annonce'
        );
        throw new Error(
          'User not authorized to change status of this document.'
        );
      }
    } else {
      console.error('No such document!');
      throw new Error('No such document!');
    }
  }

  private fetchSignalements() {
    const signalementsCollection = collection(this.firestore, 'signalements');
    return collectionData(signalementsCollection, {
      idField: 'id',
    }) as Observable<Signalemenent[]>;
  }

  getSignalementById(id: string): Observable<Signalemenent | undefined> {
    const signalementDoc = doc(this.firestore, `signalements/${id}`);
    return docData(signalementDoc, { idField: 'id' }) as Observable<
      Signalemenent | undefined
    >;
  }
}
