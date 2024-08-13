import { Component, OnInit, input } from '@angular/core';
import {
  IonLabel,
  IonItem,
  IonList,
  IonCardContent,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import { Signalemenent } from '../../signalement.model';
import { RouterLink } from '@angular/router';
import { DatePipe, CommonModule, SlicePipe } from '@angular/common';
@Component({
  selector: 'app-signalement-large',
  templateUrl: './signalement-large.component.html',
  styleUrls: ['./signalement-large.component.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    RouterLink,
    DatePipe,
    SlicePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignalementLargeComponent implements OnInit {
  constructor() {
    addIcons({ locationOutline });
  }
  signalementFenetre = input.required<Signalemenent>();

  ngOnInit() {}
}
