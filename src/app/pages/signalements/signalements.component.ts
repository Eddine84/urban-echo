import { Component, OnInit, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonLabel,
  IonContent,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { Signalemenent } from './signalement.model';

@Component({
  selector: 'app-signalements',
  templateUrl: './signalements.component.html',
  styleUrls: ['./signalements.component.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
    IonContent,
    IonLabel,
    IonToolbar,
    IonSegmentButton,
    IonSegment,
    IonHeader,
    RouterOutlet,
    RouterLink,
  ],
})
export class SignalementsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
