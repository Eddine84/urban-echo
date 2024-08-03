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
import { ToastService } from 'src/app/services/toast.service';

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
  toastService = inject(ToastService);
  destroyRef = inject(DestroyRef);
  signalementsService = inject(SignalementsService);
  selectedSignalementId = input<string>();
  singleSignalement = signal<Signalemenent | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  showConfimBtn = signal(true);
  userId = this.signalementsService.userId();
  destinataire = 'police_municipale';

  signalement = computed(() => this.singleSignalement());

  async confirmSignalement() {
    try {
      await this.signalementsService.addConfirmation(
        this.selectedSignalementId()!,
        this.userId
      );
      console.log('Confirmation added successfully');
    } catch (error) {
      console.error('Error adding confirmation:', error);
    }
  }

  async removeSignalement() {
    try {
      await this.signalementsService.deleteSignalement(
        this.selectedSignalementId()!,
        this.destinataire
      );
      this.router.navigate(['/signalements/liste']);
    } catch (error) {
      this.toastService.presentToast(
        'top',
        'seulement les diestinarie sont autorisé a cloturer cette annonce'
      );

      console.error('Erreur lors de la suppression du signalement:', error);
    }
  }

  async updateSignalementStatus() {
    try {
      await this.signalementsService.updateSignalementStatus(
        this.selectedSignalementId()!,
        this.destinataire
      );
      this.toastService.presentToast(
        'top',
        'le signalement a été marqué comme resolut'
      );
    } catch (error) {
      console.log(error);
      this.toastService.presentToast(
        'top',
        'seulement les diestinarie sont autorisé a changer le statut  cette annonce'
      );
    }
  }

  public actionSheetButtonsUpdate = [
    {
      text: 'Update',

      handler: () => {
        this.updateSignalementStatus();
      },
    },

    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  public actionSheetButtonsRemove = [
    {
      text: 'Remove',
      handler: () => {
        this.removeSignalement();
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  ngOnInit() {
    this.isFetching.set(true);
    const signalementSubsciption = this.signalementsService
      .getSignalementById(this.selectedSignalementId()!)
      .subscribe({
        next: (data) => {
          this.singleSignalement.set(data);
          this.isFetching.set(false);
          if (data?.confirmedByUsers.includes(this.userId)) {
            this.showConfimBtn.set(false);
          }
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
