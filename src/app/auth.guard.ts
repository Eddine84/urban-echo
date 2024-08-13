import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.userSignal();
    if (user && !user.isAnonymous) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
