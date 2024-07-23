import { Component, OnInit, input, Input } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Signalemenent } from '../signalement.model';
import { RouterLink } from '@angular/router';
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
import { signalements } from '../dummy-signalements';

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignalementComponent implements OnInit {
  selectedSignalementId = input<string>();
  constructor() {}
  @Input() signalement?: Signalemenent;
  signalements = signalements;

  ngOnInit() {
    this.signalement = signalements.find(
      (single) => single.id === this.selectedSignalementId()
    );
    console.log(this.selectedSignalementId());
  }
}
