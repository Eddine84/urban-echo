import { Injectable } from '@angular/core';
import { type Signalemenent } from '../pages/signalements/signalement.model';
@Injectable({ providedIn: 'root' })
export class SignalementsService {
  private signalements = [
    {
      id: '1',
      title: 'Nid de poule dangereux',
      location: 'Rue de la Confédération, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
        'blob:http://localhost:8100/f8ec26f4-a10a-4511-a79f-905ce53fa5d6',
      ],
      content:
        'Un nid de poule dangereux a été signalé sur la Rue de la Confédération à Genève.',
      coordinates: {
        lat: 46.2044,
        lng: 6.1432,
      },
      category: 'Infrastructure',
      confirmations: 3,
      resolutionComment: '',
      recipient: ['Service des routes et mobilité, Genève'],
    },
    {
      id: '2',
      title: 'Lampadaire cassé',
      location: 'Avenue de la Paix, Genève',
      date: '2025-12-31',
      status: 'Résolu',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
        'blob:http://localhost:8100/f8ec26f4-a10a-4511-a79f-905ce53fa5d6',
      ],
      content:
        "Un lampadaire cassé a été signalé sur l'Avenue de la Paix à Genève.",
      coordinates: {
        lat: 46.2267,
        lng: 6.1484,
      },
      category: 'Éclairage public',
      confirmations: 5,
      resolutionComment: 'Le lampadaire a été remplacé par un nouveau.',
      recipient: ["Service de l'éclairage public, Genève"],
    },
    {
      id: '3',
      title: "Fuite d'eau",
      location: 'Boulevard du Théâtre, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
        'blob:http://localhost:8100/f8ec26f4-a10a-4511-a79f-905ce53fa5d6',
      ],
      content:
        "Une fuite d'eau a été signalée sur le Boulevard du Théâtre à Genève.",
      coordinates: {
        lat: 46.2074,
        lng: 6.147,
      },
      category: 'Canalisation',
      confirmations: 2,
      resolutionComment: '',
      recipient: ['Service des eaux, Genève'],
    },
    {
      id: '4',
      title: 'Graffiti sur mur',
      location: 'Rue de Carouge, Genève',
      date: '2025-12-31',
      status: 'Résolu',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
        'blob:http://localhost:8100/f8ec26f4-a10a-4511-a79f-905ce53fa5d6',
      ],
      content:
        'Des graffitis ont été signalés sur un mur de la Rue de Carouge à Genève.',
      coordinates: {
        lat: 46.1944,
        lng: 6.139,
      },
      category: 'Propreté',
      confirmations: 4,
      resolutionComment:
        'Les graffitis ont été nettoyés par une équipe de nettoyage.',
      recipient: ['Service de la propreté, Genève'],
    },
    {
      id: '5',
      title: 'Arbre tombé',
      location: 'Parc des Bastions, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
        'blob:http://localhost:8100/f8ec26f4-a10a-4511-a79f-905ce53fa5d6',
      ],
      content: 'Un arbre tombé a été signalé au Parc des Bastions à Genève.',
      coordinates: {
        lat: 46.201,
        lng: 6.1457,
      },
      category: 'Végétation',
      confirmations: 3,
      resolutionComment: '',
      recipient: ['Service des espaces verts, Genève'],
    },
    {
      id: '6',
      title: 'Voiture abandonnée',
      location: 'Rue du Mont-Blanc, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
        'blob:http://localhost:8100/f8ec26f4-a10a-4511-a79f-905ce53fa5d6',
      ],
      content:
        'Une voiture abandonnée a été signalée sur la Rue du Mont-Blanc à Genève.',
      coordinates: {
        lat: 46.2071,
        lng: 6.1466,
      },
      category: 'Véhicules',
      confirmations: 6,
      resolutionComment: '',
      recipient: ['Police municipale, Genève'],
    },
    {
      id: '7',
      title: 'Déchets encombrants',
      location: 'Rue de Lausanne, Genève',
      date: '2025-12-31',
      status: 'Résolu',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
      ],
      content:
        'Des déchets encombrants ont été signalés sur la Rue de Lausanne à Genève.',
      coordinates: {
        lat: 46.21,
        lng: 6.1483,
      },
      category: 'Propreté',
      confirmations: 5,
      resolutionComment:
        'Les déchets ont été enlevés par le service de propreté de la ville.',
      recipient: ['Service de la propreté, Genève'],
    },
    {
      id: '8',
      title: 'Feu de signalisation défectueux',
      location: 'Place du Molard, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
      ],
      content:
        'Un feu de signalisation défectueux a été signalé sur la Place du Molard à Genève.',
      coordinates: {
        lat: 46.2045,
        lng: 6.1477,
      },
      category: 'Signalisation',
      confirmations: 7,
      resolutionComment: '',
      recipient: ['Service de la mobilité, Genève'],
    },
    {
      id: '9',
      title: 'Panneau de signalisation manquant',
      location: 'Rue du Rhône, Genève',
      date: '2025-12-31',
      status: 'Résolu',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
      ],
      content:
        'Un panneau de signalisation manquant a été signalé sur la Rue du Rhône à Genève.',
      coordinates: {
        lat: 46.2044,
        lng: 6.1505,
      },
      category: 'Signalisation',
      confirmations: 4,
      resolutionComment: 'Le panneau de signalisation a été remplacé.',
      recipient: ['Service de la mobilité, Genève'],
    },
    {
      id: '10',
      title: 'Trottoir endommagé',
      location: "Rue de l'Hôtel-de-Ville, Genève",
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
      ],
      content:
        "Un trottoir endommagé a été signalé sur la Rue de l'Hôtel-de-Ville à Genève.",
      coordinates: {
        lat: 46.2018,
        lng: 6.1481,
      },
      category: 'Infrastructure',
      confirmations: 3,
      resolutionComment: '',
      recipient: ['Service des routes et mobilité, Genève'],
    },
    {
      id: '11',
      title: "Comportement raciste d'un vendeur",
      location: 'Migros Balexert, Genève',
      date: '2025-12-31',
      status: 'En cours',
      images: [
        'blob:http://localhost:8100/67e5bed2-365a-4239-ae37-1270bf984e87',
      ],
      content:
        "Une personne a signalé le comportement raciste d'un vendeur à Migros Balexert à Genève.",
      coordinates: {
        lat: 46.2181,
        lng: 6.1209,
      },
      category: 'Comportement',
      confirmations: 1,
      resolutionComment: '',
      recipient: ['Service clientèle Migros'],
    },
  ];

  getSignalements() {
    return this.signalements;
  }

  getSelectedSignalement(selectedSignalementId: string) {
    return this.signalements.find(
      (signalement) => signalement.id === selectedSignalementId
    );
  }

  addSignalement(singleSignalement: Signalemenent) {
    return this.signalements.unshift(singleSignalement);
  }
}
