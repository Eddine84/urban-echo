import { Component, OnInit, input, output } from '@angular/core';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonContent,
  IonAvatar,
  IonThumbnail,
  IonButton,
} from '@ionic/angular/standalone';
import { type Signalemenent } from '../../signalement.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signalement-small',
  templateUrl: './signalement-small.component.html',
  styleUrls: ['./signalement-small.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonAvatar,
    IonContent,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonLabel,
    IonItem,
    IonList,
    IonThumbnail,
    RouterLink,
  ],
})
export class SignalementSmallComponent {
  signalement = input.required<Signalemenent>();
  selected = input.required<boolean>();
  select = output<string>();
  onSelectSignalement() {
    this.select.emit(this.signalement().id);
  }
}
