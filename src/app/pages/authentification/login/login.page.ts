import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonIcon,
  IonFab,
  IonButton,
  IonToast,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  chevronForward,
} from 'ionicons/icons';
import { PasswordResetPage } from '../password-reset/password-reset.page';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonButton,
    IonFab,
    IonIcon,
    IonInput,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    PasswordResetPage,
    RouterLink,
    FormsModule,
  ],
})
export class LoginPage implements OnInit {
  constructor() {
    addIcons({ personOutline, lockClosedOutline, chevronForward });
  }
  private toastController = inject(ToastController);
  private authService = inject(AuthService);

  async showToast() {
    const toast = await this.toastController.create({
      message: 'Invalid values detected, please check your inputs',
      duration: 2000,
    });
    toast.present();
  }
  // email = '';
  // password = '';

  // async login() {
  //   const user = await this.authService.login(this.email, this.password);
  //   if (user) {
  //     console.log('Utilisateur connecté:', user);
  //   } else {
  //     console.log('Échec de la connexion.');
  //   }
  // }
  ngOnInit() {}

  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      // this.showToast();
      return;
    }
    const entredEmail = formData.form.value.email;
    const entredPassword = formData.form.value.password;
    console.log(entredPassword, entredEmail);
    console.log(formData);

    formData.form.reset();
  }
}
