import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.page').then((m) => m.SignupPage),
  },

  {
    path: 'password-reset',
    loadComponent: () =>
      import('./password-reset/password-reset.page').then(
        (m) => m.PasswordResetPage
      ),
  },
];
