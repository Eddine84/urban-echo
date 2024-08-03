import { Component, OnInit, inject, signal } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonTabButton,
  IonTabs,
  IonContent,
  IonIcon,
  IonTabBar,
} from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';
import { addIcons } from 'ionicons';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

import { CommonModule } from '@angular/common';
import {
  addOutline,
  searchOutline,
  playCircle,
  radio,
  library,
  search,
  personOutline,
  listOutline,
} from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
import { SignalementsService } from './services/signalements.service';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    IonTabBar,
    IonIcon,
    IonContent,
    IonTabs,
    IonTabButton,
    IonApp,
    RouterOutlet,
    RouterLink,
    IonRouterOutlet,
    RouterLinkActive,

    CommonModule,
  ],
})
export class AppComponent implements OnInit {
  constructor() {
    addIcons({
      addOutline,
      searchOutline,
      playCircle,
      radio,
      library,
      search,
      personOutline,
      listOutline,
    });
  }

  authService = inject(AuthService);
  signalementsService = inject(SignalementsService);

  ngOnInit(): void {
    this.authService.signInAnonymously().then((user) => {
      if (user) {
        console.log('Utilisateur anonyme connecté:', user);
        this.signalementsService.userId.set(user.uid);
      } else {
        console.log('Échec de la connexion anonyme.');
      }
    });
  }
}
