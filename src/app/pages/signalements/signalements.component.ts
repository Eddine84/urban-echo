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
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listCircleOutline, mapOutline } from 'ionicons/icons';

@Component({
  selector: 'app-signalements',
  templateUrl: './signalements.component.html',
  styleUrls: ['./signalements.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
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
  ngOnInit() {}
  constructor() {
    addIcons({ mapOutline, listCircleOutline });
  }
}
