import { Component, OnInit, signal } from '@angular/core';
import { SignalementLargeComponent } from './signalement-large/signalement-large.component';
import { SignalementSmallComponent } from './signalement-small/signalement-small.component';
import { signalements } from '../dummy-signalements';

import {
  IonHeader,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonAvatar,
  IonThumbnail,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    SignalementLargeComponent,
    SignalementSmallComponent,
    IonThumbnail,
  ],
})
export class ListeComponent implements OnInit {
  signalements = signalements;

  selectedSignalementId = signal<string>('1');

  get selectedSignalement() {
    return this.signalements.find(
      (signalement) => signalement.id === this.selectedSignalementId()
    )!;
  }

  onSelect(id: string) {
    this.selectedSignalementId.set(id);
  }

  ngOnInit() {}
}
