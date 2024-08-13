import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
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
  IonCard,
  IonSelect,
  IonSelectOption,
  IonToolbar,
} from '@ionic/angular/standalone';

import { Signalemenent } from '../signalement.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.scss'],
  standalone: true,
  imports: [
    IonToolbar,
    IonCard,
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
    IonSelect,
    IonSelectOption,
  ],
})
export class ListeComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  signalementsService = inject(SignalementsService);
  selectedFilter = signal('all');
  allSignalements = this.signalementsService.signalementsSignal;
  isFetching = signal(false);
  error = signal('');
  selectedSignalement = signal<any>({});
  private authService = inject(AuthService);
  user = this.authService.userSignal;
  // Calculé les signalements en fonction du filtre sélectionné
  signalements = computed(() => {
    console.log('Calculating filtered signalements');
    switch (this.selectedFilter()) {
      case 'inProgress':
        return this.allSignalements()!.filter(
          (signalement) => signalement.status === 'En cours'
        );
      case 'resolved':
        return this.allSignalements()!.filter(
          (signalement) => signalement.status === 'Résolu'
        );
      case 'mostConfirmed':
        return this.allSignalements()!.sort(
          (a, b) => b.confirmedByUsers.length - a.confirmedByUsers.length
        );
      case 'mostRecent':
        return this.allSignalements()!.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case 'oldest':
        return this.allSignalements()!.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      default:
        return this.allSignalements();
    }
  });

  onSelect(id: string) {
    this.selectedSignalement.set(
      this.allSignalements()?.find((signalement) => signalement.id === id)
    );
  }

  onChangeSignalementsFilter(filter: string) {
    this.selectedFilter.set(filter);
  }
  async ngOnInit() {
    const localUser = this.authService.getUserFromLocalStorage();
    if (!localUser) {
      await this.fetchUser();
    } else {
      this.loadSignalements();
    }
  }

  async fetchUser() {
    this.isFetching.set(true);
    try {
      const userResponse = await this.authService.signInAnonymously();
      if (userResponse) {
        this.authService.getUserFromLocalStorage();
        this.loadSignalements();
      }
    } catch (error) {
      console.log('Error in fetchUser', error);
      this.error.set("Erreur lors de l'initialisation");
      this.isFetching.set(false);
    }
  }

  loadSignalements() {
    this.signalementsService.loadSignalements().subscribe({
      next: (loadSignalementsSData) => {
        if (loadSignalementsSData) {
          this.signalementsService.signalementsSignal.set(
            loadSignalementsSData
          );
          this.selectedSignalement.set(loadSignalementsSData[0]);
          this.isFetching.set(false);
        } else {
          console.log('cant fetch signalement...');
          this.isFetching.set(false);
        }
      },
      error: (error) => {
        console.log('Error loading data', error);
        this.error.set('erreur lors du chargement des signalement');
        this.isFetching.set(false);
      },
    });
  }

  constructor() {
    console.log('constructor called');
  }
}
