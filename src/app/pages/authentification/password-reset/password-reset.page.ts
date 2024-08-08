import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  chevronForward,
} from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonIcon,
  IonFabButton,
  IonFab,
  ToastController,
  IonButton,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule, // Ajoutez ceci pour les formulaires réactifs
    RouterLink,
  ],
})
export class PasswordResetPage implements OnInit {
  resetPasswordForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
  });

  authService = inject(AuthService);
  toastController = inject(ToastController);
  router = inject(Router);

  constructor() {
    addIcons({ personOutline, lockClosedOutline, chevronForward });
  }

  ngOnInit() {}

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  async onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const enteredEmail = this.resetPasswordForm.value.email;
    try {
      await this.authService.resetPassword(enteredEmail!);
      await this.showToast('Email de réinitialisation de mot de passe envoyé.');
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error(error);
      await this.showToast(
        "Erreur lors de l'envoi de l'email de réinitialisation de mot de passe."
      );
    }
  }
}
