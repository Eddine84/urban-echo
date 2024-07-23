import { Component } from '@angular/core';
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
import {
  addOutline,
  searchOutline,
  playCircle,
  radio,
  library,
  search,
  personOutline,
  lockClosedOutline,
  chevronForward,
  listOutline,
} from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
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
  ],
})
export class AppComponent {
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
}
