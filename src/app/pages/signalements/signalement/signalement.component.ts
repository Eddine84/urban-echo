import {
  Component,
  OnInit,
  input,
  Input,
  inject,
  computed,
  effect,
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
  signalementsService = inject(SignalementsService);
  selectedSignalementId = input<string>();

  signalement = computed(() =>
    this.signalementsService.getSelectedSignalement(
      this.selectedSignalementId()!
    )
  );

  confirmSignalement() {
    this.signalementsService.addConfirmation(this.selectedSignalementId()!);
  }

  removeSignalement() {
    const signalement = this.signalement();
    if (signalement) {
      this.signalementsService.removeSignalement(
        this.selectedSignalementId()!,
        signalement.userId
      );
      this.router.navigate(['/signalements/liste']);
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

  ngOnInit() {}
}
