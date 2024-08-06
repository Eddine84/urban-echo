import { Component, DestroyRef, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { passwordStrengthValidator } from '../validators';
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
import { Observable, debounce, debounceTime, of } from 'rxjs';
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
    ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  constructor() {
    addIcons({ personOutline, lockClosedOutline, chevronForward });
  }
  ngOnInit() {
    const savedForm = window.localStorage.getItem('saved-login-form');
    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      this.loginForm.patchValue({ email: loadedForm.email });
    }

    const subscription = this.loginForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator,
      ],
    }),
  });

  get emailIsInvalid() {
    return (
      this.loginForm.controls.email.touched &&
      this.loginForm.controls.email.dirty &&
      this.loginForm.controls.email.invalid
    );
  }
  get passwordIsInvalid() {
    return (
      this.loginForm.controls.password.touched &&
      this.loginForm.controls.password.dirty &&
      this.loginForm.controls.password.invalid
    );
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const enteredEmail = this.loginForm.value.email;
    const enteredPassword = this.loginForm.value.password;
    try {
      const user = await this.authService.login(
        enteredEmail!,
        enteredPassword!
      );
      if (user) {
        console.log('User logged in successfully:', user);
        // Redirigez l'utilisateur ou effectuez d'autres actions nécessaires
      }
    } catch (error: any) {
      console.error('Login failed', error);
    }
  }
}
