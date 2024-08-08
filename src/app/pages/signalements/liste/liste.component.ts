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

  ngOnInit() {
    console.log('ngOnInit called');

    this.isFetching.set(true);
    const loadSignalementsSubscription = this.signalementsService
      .loadSignalements()
      .subscribe({
        next: (data) => {
          console.log('Data loaded', data);
          this.signalementsService.signalementsSignal.set(data);
          this.isFetching.set(false);
          console.log('test 2');
          this.selectedSignalement.set(data[0]);
        },
        error: (error) => {
          console.log('Error loading data', error);
          this.error.set('erreur lors du chargement des signalement');
          this.isFetching.set(false);
        },
      });

    this.destroyRef.onDestroy(() => {
      loadSignalementsSubscription.unsubscribe();
    });
  }

  constructor() {
    console.log('constructor called');
  }
}
