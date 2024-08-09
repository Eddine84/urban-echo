import {
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { categories } from './dummy_categories';
import { PhotoService } from 'src/app/services/photo.service';
import { CommonModule } from '@angular/common';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';

import {
  IonInput,
  IonHeader,
  IonTitle,
  IonLabel,
  IonContent,
  IonItem,
  IonToolbar,
  IonList,
  IonTextarea,
  IonButton,
  IonImg,
  IonThumbnail,
  IonText,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonModal,
  IonIcon,
  IonFab,
  IonFabButton,
  IonRow,
  IonCol,
  IonGrid,
} from '@ionic/angular/standalone';
import { Categorie } from './categorie.model';
import { TypeheadComponent } from './typehead/typehead.component';
import { addIcons } from 'ionicons';
import {
  closeCircle,
  camera,
  send,
  locateOutline,
  add,
  pin,
} from 'ionicons/icons';
import { MapboxService } from 'src/app/services/mapbox.service';
import { SignalementsService } from 'src/app/services/signalements.service';
import { Signalemenent } from '../signalements/signalement.model';

export function atLeastOneRecipientSelected(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (control.value && control.value.length > 0) {
    return null;
  }
  return { required: true };
}

@Component({
  selector: 'app-signaler',
  templateUrl: './signaler.component.html',
  styleUrls: ['./signaler.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonCol,
    IonRow,
    IonFabButton,
    IonFab,
    IonIcon,
    IonSearchbar,
    IonText,
    IonImg,
    IonButton,
    IonTextarea,
    IonList,
    IonToolbar,
    IonItem,
    IonContent,
    IonLabel,
    IonTitle,
    IonHeader,
    IonInput,
    IonThumbnail,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonModal,
    TypeheadComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class SignalerComponent {
  signalementsService = inject(SignalementsService);
  router = inject(Router);
  public photoService = inject(PhotoService);
  public locationService = inject(LocationService);
  public mapboxService = inject(MapboxService);
  private destroyRef = inject(DestroyRef);
  formSubmitted = false;
  @ViewChild('modal', { static: true }) modal!: IonModal;
  @ViewChild('form') form?: ElementRef<HTMLFormElement>;
  categories: Categorie[] = categories;
  destinatairesSelections = 'aucun';
  selectedDestinataires = signal<string[]>([]);
  signalementPosition = {
    lat: 0,
    lng: 0,
  };
  signalementForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    address: new FormControl('', [Validators.required]),
    selectedType: new FormControl('', [Validators.required]),
    photos: new FormArray([], [Validators.required]),
  });

  get Alladresses() {
    return this.mapboxService.address;
  }

  get titlesInvalid() {
    return this.formSubmitted && this.signalementForm.controls['title'].invalid;
  }
  get contentIsInvalid() {
    return (
      this.formSubmitted && this.signalementForm.controls['content'].invalid
    );
  }
  get addressIsInvalid() {
    return (
      this.formSubmitted && this.signalementForm.controls['address'].invalid
    );
  }
  get selectedTypeIsInvalid() {
    return (
      this.formSubmitted &&
      this.signalementForm.controls['selectedType'].invalid
    );
  }
  get recipientTypeIsInvalid() {
    return this.formSubmitted && this.selectedDestinataires.length === 0;
  }

  constructor() {
    addIcons({ closeCircle, camera, send, locateOutline, pin });
  }
  get photos(): FormArray {
    return this.signalementForm.get('photos') as FormArray;
  }

  private formatData(data: string[]) {
    if (data.length === 1) {
      const categorie = this.categories.find(
        (categorie) => categorie.value === data[0]
      );
      return categorie?.text;
    }

    return `${data.length} destinataires`;
  }

  DestinatairesSelectionChanged(categories: string[]) {
    this.selectedDestinataires.set(categories);
    this.destinatairesSelections = this.formatData(
      this.selectedDestinataires()
    )!;
    console.log('categorie choisi par moi', this.selectedDestinataires());
    this.modal.dismiss();
  }

  async addPhoto() {
    await this.photoService.addNewToGallery();
    const photoControl = new FormControl(
      this.photoService.photos[this.photoService.photos.length - 1].webviewPath,
      Validators.required
    );
    this.photos.push(photoControl);
  }

  removePhoto(index: number) {
    this.photoService.removePhoto(index);
  }

  async getCurrentLocation() {
    this.signalementForm.controls['address'].setValue('');
    const position = await this.locationService.getCurrentPosition();

    if (position) {
      this.signalementPosition.lat = position.latitude;
      this.signalementPosition.lng = position.longitude;
      console.log('user position is', position);

      const addressSubscription = this.mapboxService
        .getAdresseFromCoords(position.latitude, position.longitude)
        .subscribe({
          next: (response) => {
            console.log('hey djamel this is response', response);
            const placeName = response.features[0]?.place_name;
            this.signalementForm.controls['address'].setValue(placeName);
          },
          error: (err) => {
            console.error("Erreur lors de la récupération de l'adresse:", err);
          },
        });

      this.destroyRef.onDestroy(() => {
        addressSubscription.unsubscribe();
      });
    }
  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      const mapboxSubscription = this.mapboxService
        .search_word(searchTerm)
        .subscribe({
          next: (features) => {
            this.mapboxService.address = features.map(
              (feat) => feat.place_name
            );
          },
        });
      this.destroyRef.onDestroy(() => {
        mapboxSubscription.unsubscribe();
      });
    } else {
      this.mapboxService.address = [];
    }
  }

  onSelect(address: string) {
    this.signalementForm.controls['address'].setValue(address);
    this.mapboxService.address = [];
  }

  async onFormSubmit() {
    this.formSubmitted = true;
    if (this.signalementForm.invalid) {
      return;
    }

    console.log(this.selectedDestinataires());

    const newSignalement: Signalemenent = {
      id: '',
      title: this.signalementForm.value.title!,
      location: this.signalementForm.value.address!,
      date: new Date().toISOString(),
      images: this.signalementForm.value.photos!,
      // images: this.photoService.photos
      //   .map((photo) => photo.webviewPath)
      //   .filter((path): path is string => path !== undefined),
      content: this.signalementForm.value.content!,
      coordinates: this.signalementPosition,
      category: this.signalementForm.value.selectedType!,
      recipient: this.selectedDestinataires(),
      status: 'En cours',
      resolutionComment: '',
      confirmedByUsers: [],
      userId: this.signalementsService.userId(),
    };

    try {
      await this.signalementsService.addSignalement(newSignalement);
      console.log('Signalement ajouté avec succès');
      this.router.navigate(['/signalements/liste']);
    } catch (error) {
      console.error("Erreur lors de l'ajout du signalement:", error);
    }

    this.signalementForm.reset();
    this.selectedDestinataires.set([]);
    this.destinatairesSelections = 'aucun';
    this.photoService.photos = [];
  }
  get photosAreInvalid() {
    return this.formSubmitted && this.photos.controls.length === 0;
  }
}
