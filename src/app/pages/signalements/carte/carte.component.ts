import { Component, OnInit } from '@angular/core';
import {
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonAccordion, IonAccordionGroup],
})
export class CarteComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
