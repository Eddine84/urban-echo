import { Component, OnInit, inject, signal } from '@angular/core';
import { SignalementLargeComponent } from './signalement-large/signalement-large.component';
import { SignalementSmallComponent } from './signalement-small/signalement-small.component';

import { SignalementsService } from 'src/app/services/signalements.service';

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
  signalementsService = inject(SignalementsService);
  signalements = this.signalementsService.getSignalements();

  selectedSignalementId = signal<string>('1');
  // selectedSignalementId = '1';

  get selectedSignalement() {
    return this.signalementsService.getSelectedSignalement(
      this.selectedSignalementId()
    )!;
  }

  onSelect(id: string) {
    this.selectedSignalementId.set(id);
    // this.selectedSignalementId = id;
    // console.log(this.selectedSignalementId);
  }

  ngOnInit() {}
}
