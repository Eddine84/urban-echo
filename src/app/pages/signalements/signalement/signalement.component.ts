import {
  Component,
  OnInit,
  input,
  Input,
  inject,
  computed,
  effect,
  signal,
  DestroyRef,
} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { type Signalemenent } from '../signalement.model';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  closeCircle,
  camera,
  send,
  locateOutline,
  add,
  pin,
  checkmarkCircle,
  trashOutline,
} from 'ionicons/icons';

import {
  IonAccordionGroup,
  IonAccordion,
  IonLabel,
  IonItem,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonCardSubtitle,
} from '@ionic/angular/standalone';
import { SignalementsService } from 'src/app/services/signalements.service';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'app-signalement',
  templateUrl: './signalement.component.html',
  styleUrls: ['./signalement.component.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonItem,
    IonLabel,
    IonAccordion,
    IonAccordionGroup,
    RouterLink,
    DatePipe,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignalementComponent implements OnInit {
  constructor() {
    addIcons({
      closeCircle,
      camera,
      send,
      locateOutline,
      pin,
      checkmarkCircle,
      add,
      trashOutline,
    });
  }
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  signalementsService = inject(SignalementsService);
  selectedSignalementId = input<string>();
  singleSignalement = signal<Signalemenent | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');

  signalement = computed(() =>
    this.signalementsService.getSelectedSignalement(
      this.selectedSignalementId()!
    )
  );

  async confirmSignalement() {
    const userId = 'ELxvP1C6YSOZ3bGYD8FF';

    try {
      await this.signalementsService.addConfirmation(
        this.selectedSignalementId()!,
        userId
      );
      console.log('Confirmation added successfully');
    } catch (error) {
      console.error('Error adding confirmation:', error);
    }
  }

  async removeSignalement() {
    const userId = '2f2bdb69-1af7-4330-a67a-8eba33f43f42';

    try {
      await this.signalementsService.deleteSignalement(
        this.selectedSignalementId()!,
        userId
      );
      this.router.navigate(['/signalements/liste']);
    } catch (error) {
      console.error('Erreur lors de la suppression du signalement:', error);
    }
  }

  updateSignalementStatus() {
    if (this.signalement()?.status === 'En cours') {
      this.signalementsService.updateSignalementStatus(
        this.signalement()?.id!,
        this.signalement()?.recipient!,
        'Résolu'
      );
    }
  }

  ngOnInit() {
    this.isFetching.set(true);
    const signalementSubsciption = this.signalementsService
      .getSignalementById(this.selectedSignalementId()!)
      .subscribe({
        next: (data) => {
          this.singleSignalement.set(data);
          this.isFetching.set(false);
        },
        error: (error) => {
          console.log(error);
          this.error.set('chargement du signalement en cours...');
        },
      });
    this.destroyRef.onDestroy(() => {
      signalementSubsciption.unsubscribe();
    });
  }
}
