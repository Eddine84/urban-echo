import { Routes } from '@angular/router';
import { ListeComponent } from './liste/liste.component';
import { CarteComponent } from './carte/carte.component';
import { SignalementComponent } from './signalement/signalement.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'liste',
    pathMatch: 'full',
  },
  {
    path: 'liste',
    component: ListeComponent,
  },
  {
    path: 'carte',
    component: CarteComponent,
  },
  {
    path: ':selectedSignalementId',
    component: SignalementComponent,
  },
];
