import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
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
  idCardOutline,
} from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
import { SignalementsService } from './services/signalements.service';
import { User } from 'firebase/auth';
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
      idCardOutline,
    });
  }

  authService = inject(AuthService);
  signalementsService = inject(SignalementsService);
  user = this.authService.userSignal;

  ngOnInit() {
    const localUser = this.authService.getUserFromLocalStorage();

    if (localUser) {
      this.authService.userSignal.set(localUser);
    } else {
      this.fetchUser();
    }
  }
  async fetchUser() {
    // ca va utiliser le service pour creer une authentification anonynme et stocker dans local storage

    try {
      const userResponse = await this.authService.signInAnonymously();
      if (userResponse) {
        console.log('je suis la');
        this.authService.userSignal.set(userResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
