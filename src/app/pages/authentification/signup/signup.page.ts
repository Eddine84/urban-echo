import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { categories } from '../../signaler/dummy_categories';
import { Categorie } from '../../signaler/categorie.model';
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
  authService = inject(AuthService);
  availableCategories = signal<Categorie[]>([]);
  constructor() {
    addIcons({ personOutline, lockClosedOutline, chevronForward });
  }

  async loadAvailableCategories() {
    const allCategories = await this.authService.getCategories();
    this.availableCategories.set(allCategories);
    for (const category of allCategories) {
      const isUsed = await this.authService.isCategoryUsed(category.value);
      if (!isUsed) {
        this.availableCategories.update((previousList) => [
          ...previousList,
          category,
        ]);
      }
    }
  }

  registerForm = new FormGroup({
    email: new FormControl(''),
  });

  onSubmit() {
    console.log();
  }
  ngOnInit() {
    this.loadAvailableCategories();
  }
}
