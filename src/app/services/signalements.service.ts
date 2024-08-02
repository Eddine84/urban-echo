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
  signalementsData: Signalemenent[] = [
    {
      id: '1',
      userId: 'user001',
      title: 'Nid de poule dangereux',
      location: 'Rue de la Confédération, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        'Un nid de poule dangereux a été signalé sur la Rue de la Confédération à Genève.',
      coordinates: {
        lat: 46.2044,
        lng: 6.1432,
      },
      category: 'Infrastructure',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: '',
      recipient: ['Service des routes et mobilité, Genève'],
    },
    {
      id: '2',
      userId: 'user002',
      title: 'Lampadaire cassé',
      location: 'Avenue de la Paix, Genève',
      date: '2020-12-31',
      status: 'Résolu',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        "Un lampadaire cassé a été signalé sur l'Avenue de la Paix à Genève.",
      coordinates: {
        lat: 46.2267,
        lng: 6.1484,
      },
      category: 'Éclairage public',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: 'Le lampadaire a été remplacé par un nouveau.',
      recipient: ["Service de l'éclairage public, Genève"],
    },
    {
      id: '3',
      userId: 'user003',
      title: "Fuite d'eau",
      location: 'Boulevard du Théâtre, Genève',
      date: '2015-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        "Une fuite d'eau a été signalée sur le Boulevard du Théâtre à Genève.",
      coordinates: {
        lat: 46.2074,
        lng: 6.147,
      },
      category: 'Canalisation',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: '',
      recipient: ['Service des eaux, Genève'],
    },
    {
      id: '4',
      userId: 'user004',
      title: 'Graffiti sur mur',
      location: 'Rue de Carouge, Genève',
      date: '2010-12-31',
      status: 'Résolu',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        'Des graffitis ont été signalés sur un mur de la Rue de Carouge à Genève.',
      coordinates: {
        lat: 46.1944,
        lng: 6.139,
      },
      category: 'Propreté',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment:
        'Les graffitis ont été nettoyés par une équipe de nettoyage.',
      recipient: ['Service de la propreté, Genève'],
    },
    {
      id: '5',
      userId: 'user005',
      title: 'Arbre tombé',
      location: 'Parc des Bastions, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content: 'Un arbre tombé a été signalé au Parc des Bastions à Genève.',
      coordinates: {
        lat: 46.201,
        lng: 6.1457,
      },
      category: 'Végétation',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: '',
      recipient: ['Service des espaces verts, Genève'],
    },
    {
      id: '6',
      userId: 'user006',
      title: 'Voiture abandonnée',
      location: 'Rue du Mont-Blanc, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        'Une voiture abandonnée a été signalée sur la Rue du Mont-Blanc à Genève.',
      coordinates: {
        lat: 46.2071,
        lng: 6.1466,
      },
      category: 'Véhicules',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: '',
      recipient: ['Police municipale, Genève'],
    },
    {
      id: '7',
      userId: 'user007',
      title: 'Déchets encombrants',
      location: 'Rue de Lausanne, Genève',
      date: '2025-12-31',
      status: 'Résolu',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        'Des déchets encombrants ont été signalés sur la Rue de Lausanne à Genève.',
      coordinates: {
        lat: 46.21,
        lng: 6.1483,
      },
      category: 'Propreté',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment:
        'Les déchets ont été enlevés par le service de propreté de la ville.',
      recipient: ['Service de la propreté, Genève'],
    },
    {
      id: '8',
      userId: 'user008',
      title: 'Feu de signalisation défectueux',
      location: 'Place du Molard, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        'Un feu de signalisation défectueux a été signalé sur la Place du Molard à Genève.',
      coordinates: {
        lat: 46.2045,
        lng: 6.1477,
      },
      category: 'Signalisation',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: '',
      recipient: ['Service de la mobilité, Genève'],
    },
    {
      id: '9',
      userId: 'user009',
      title: 'Panneau de signalisation manquant',
      location: 'Rue du Rhône, Genève',
      date: '2025-12-31',
      status: 'Résolu',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        'Un panneau de signalisation manquant a été signalé sur la Rue du Rhône à Genève.',
      coordinates: {
        lat: 46.2044,
        lng: 6.1505,
      },
      category: 'Signalisation',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: 'Le panneau de signalisation a été remplacé.',
      recipient: ['Service de la mobilité, Genève'],
    },
    {
      id: '10',
      userId: 'user010',
      title: 'Trottoir endommagé',
      location: "Rue de l'Hôtel-de-Ville, Genève",
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        "Un trottoir endommagé a été signalé sur la Rue de l'Hôtel-de-Ville à Genève.",
      coordinates: {
        lat: 46.2018,
        lng: 6.1481,
      },
      category: 'Infrastructure',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: '',
      recipient: ['Service des routes et mobilité, Genève'],
    },
    {
      id: '11',
      userId: 'user011',
      title: "Comportement raciste d'un vendeur",
      location: 'Migros Balexert, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/5d65d99d-24b6-4e00-a504-b07b7cc606ac',
        'blob:http://localhost:8100/9c376b07-3829-492a-a52b-ca3ccef75698',
      ],
      content:
        "Une personne a signalé le comportement raciste d'un vendeur à Migros Balexert à Genève.",
      coordinates: {
        lat: 46.2181,
        lng: 6.1209,
      },
      category: 'Comportement',

      confirmedByUsers: ['123123', 'asd123123'],
      resolutionComment: '',
      recipient: ['Service clientèle Migros'],
    },
  ];

  private signalements = signal<Signalemenent[]>(this.signalementsData);
  allSignalement = this.signalements.asReadonly();

  //
  loadSignalements() {
    return this.fetchSignalements();
  }
  //
  getSelectedSignalement(selectedSignalementId: string) {
    return this.signalements().find(
      (signalement) => signalement.id === selectedSignalementId
    );
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
