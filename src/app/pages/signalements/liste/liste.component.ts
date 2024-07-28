import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  SimpleChanges,
  afterNextRender,
  afterRender,
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
} from '@ionic/angular/standalone';
import { interval, single } from 'rxjs';
import { Signalemenent } from '../signalement.model';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.scss'],
  standalone: true,
  imports: [
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
  signalementsService = inject(SignalementsService);

  selectedFilter = signal('all');

  signalements = computed(() => {
    switch (this.selectedFilter()) {
      case 'inProgress':
        return this.signalementsService
          .allSignalement()
          .filter((signalement) => signalement.status === 'En cours');
      case 'resolved':
        return this.signalementsService
          .allSignalement()
          .filter((signalement) => signalement.status === 'Résolu');
      case 'mostConfirmed':
        return this.signalementsService
          .allSignalement()
          .sort((a, b) => b.confirmations - a.confirmations);
      case 'mostRecent':
        return this.signalementsService
          .allSignalement()
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      case 'oldest':
        return this.signalementsService
          .allSignalement()
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
      default:
        return this.signalementsService.allSignalement();
    }
  });
  selectedSignalementId = signal<string>(this.signalements()[0].id);
  selectedSignalement = signal<Signalemenent>(this.signalements()[0]);

  onSelect(id: string) {
    this.selectedSignalementId.set(id);
    this.selectedSignalement.set(
      this.signalementsService.getSelectedSignalement(
        this.selectedSignalementId()
      )!
    );
  }

  onChangeSignalementsFilter(filter: string) {
    this.selectedFilter.set(filter);
  }

  ngOnInit() {}
}
