import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { categories } from '../../signaler/dummy_categories';
import { Categorie } from '../../signaler/categorie.model';
import { passwordStrengthValidator } from '../validators';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonIcon,
  IonFab,
  IonSelectOption,
  IonSelect,
  IonButton,
  IonAlert,
  AlertController,
  ToastController,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  chevronForward,
} from 'ionicons/icons';
import { PasswordResetPage } from '../password-reset/password-reset.page';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    IonProgressBar,
    IonAlert,
    IonButton,
    IonFab,
    IonIcon,
    IonInput,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSelectOption,
    IonSelect,
    CommonModule,
    PasswordResetPage,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SignupPage implements OnInit {
  router = inject(Router);
  formSubmitted = false;
  isFetching = signal(false);
  authService = inject(AuthService);
  availableCategories = signal<Categorie[]>(categories);
  choosedCategorie = signal({});
  alertController = inject(AlertController);
  toastController = inject(ToastController);
  public progress = 0;
  destroyRef = inject(DestroyRef);
  private firestore = getFirestore();

  constructor() {
    addIcons({ personOutline, lockClosedOutline, chevronForward });
    setInterval(() => {
      this.progress += 0.01;

      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    }, 50);
  }

  get emailIsInvalid() {
    return (
      this.registerForm.controls.email.touched &&
      this.registerForm.controls.email.dirty &&
      this.registerForm.controls.email.invalid
    );
  }
  get passwordIsInvalid() {
    return (
      this.registerForm.controls.password.touched &&
      this.registerForm.controls.password.dirty &&
      this.registerForm.controls.password.invalid
    );
  }

  registerForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator,
      ],
    }),
    categorie: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  async onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.isFetching.set(true);
    try {
      const response = await this.authService.register(
        this.registerForm.value.email!,
        this.registerForm.value.password!
      );

      if (response) {
        const userDocRef = doc(this.firestore, `users/${response.uid}`);
        await setDoc(userDocRef, {
          email: this.registerForm.value.email,
          categorie: this.registerForm.value.categorie,
        });
        await this.showToast('Success ! utilisateur crée !');
        this.router.navigate(['/signalements/liste']);
        console.log('my response:', response);
      }
    } catch (error) {
      console.log(error);
      await this.showToast("L'utilisateur existe déjà.");
    } finally {
      // Assurez-vous que isFetching est mis à false à la fin de la tentative, que ce soit un succès ou un échec
      this.isFetching.set(false);
    }
  }

  async handleSelectChange(event: any) {
    const selectedCategorie = event.detail.value;

    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: `Enter the code to confirm the category: ${selectedCategorie}`,
      inputs: [
        {
          name: 'code',
          type: 'password',
          placeholder: 'Enter code',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async (data) => {
            console.log('this is data', data);
            const choosenCategorie = categories.find(
              (item) => item.uniqueCode === data.code
            );
            if (choosenCategorie && !choosenCategorie?.created) {
              this.registerForm.controls.categorie.setValue(selectedCategorie);
              console.log(selectedCategorie);
            } else {
              this.registerForm.controls.categorie.setValue('');
              await this.showToast(
                "Vous n'avez pas le droit de choisir cette catégorie."
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  ngOnInit() {}
}
