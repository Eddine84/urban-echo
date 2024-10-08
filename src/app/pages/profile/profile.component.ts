import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonContent,
  IonCardHeader,
  IonCardContent,
  IonList,
  IonItem,
  IonText,
  IonCard,
  IonCardTitle,
  IonLabel,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
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
  logOutOutline,
  notificationsOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { SignalementsService } from 'src/app/services/signalements.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonCardTitle,
    IonCard,
    IonText,
    IonItem,
    IonList,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonHeader,
  ],
})
export class ProfileComponent implements OnInit {
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
      logOutOutline,
      notificationsOutline,
    });
  }

  private authService = inject(AuthService);
  private signalementsService = inject(SignalementsService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  userName: string = '';
  userEmail: string = '';
  userCategory: string = '';

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.displayName || 'Utilisateur';
      this.userEmail = user.email || 'Email non disponible';
    }
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  async logout() {
    await this.authService.logout();
    const subscribe = this.signalementsService.loadSignalements().subscribe({
      next: (data) => {
        this.signalementsService.signalementsSignal.set(data);
        this.router.navigate(['/signalements/liste']);
      },
      error: () => {
        console.log(console.error);
        this.router.navigate(['/signalements/liste']);
      },
    });
    this,
      this.destroyRef.onDestroy(() => {
        subscribe.unsubscribe();
      });
  }
}
