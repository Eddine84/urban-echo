import { Component, OnInit, input } from '@angular/core';
import {
  IonTitle,
  IonContent,
  IonToolbar,
  IonHeader,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, IonTitle, RouterOutlet],
})
export class AuthentificationComponent implements OnInit {
  constructor() {}
  authPageTitle = input.required<string>();
  ngOnInit() {}
}
