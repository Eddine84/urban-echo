import { Routes } from '@angular/router';
import { SignalementsComponent } from './pages/signalements/signalements.component';
import { routes as signalementsRoutes } from './pages/signalements/signalements.routes';
import { SignalerComponent } from './pages/signaler/signaler.component';
import { AuthentificationComponent } from './pages/authentification/authentification.component';
import { routes as authRoutes } from './pages/authentification/auth.routes';
import { NotFoundComponent } from './pages/not-found/not-found.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signalements/liste',
    pathMatch: 'full',
  },
  {
    path: 'signalements',
    component: SignalementsComponent,
    children: signalementsRoutes,
  },
  {
    path: 'signaler',
    component: SignalerComponent,
  },
  {
    path: 'auth',
    component: AuthentificationComponent,
    children: authRoutes,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
