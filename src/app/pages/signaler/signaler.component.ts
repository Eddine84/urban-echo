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
import { categories } from './liste_categories_destinataires';
import { PhotoService } from 'src/app/services/photo.service';
import { CommonModule } from '@angular/common';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
import { ToastService } from 'src/app/services/toast.service';

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
  private loadingController = inject(LoadingController);
  private toasService = inject(ToastService);
  formSubmitted = false;
  @ViewChild('modal', { static: true }) modal!: IonModal;
  @ViewChild('form') form?: ElementRef<HTMLFormElement>;
  categories: Categorie[] = categories;
  destinatairesSelections = 'aucun';
  selectedDestinataires = signal<string[]>([]);
  signalementPosition = signal({
    lat: 0,
    lng: 0,
  });
  signalementForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [
      Validators.required,
      Validators.maxLength(1000),
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
    return this.formSubmitted && this.selectedDestinataires().length < 1;
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
    const loading = await this.presentLoading();

    try {
      // Vérification des permissions de la caméra
      const hasPermission = await this.checkCameraPermission();

      if (!hasPermission) {
        this.toasService.presentToast(
          'top',
          "L'accès à la caméra a été refusé ou une erreur s'est produite"
        );
        return;
      }

      // Ajouter une nouvelle photo à la galerie
      const photo = await this.photoService.addNewToGallery();

      if (photo) {
        const photoControl = new FormControl(
          photo.webviewPath,
          Validators.required
        );
        this.photos.push(photoControl);
      } else {
        console.log(
          "L'utilisateur a refusé l'accès à la caméra ou une erreur s'est produite"
        );
        this.toasService.presentToast(
          'top',
          "L'accès à la caméra a été refusé ou une erreur s'est produite"
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo :", error);
      this.toasService.presentToast(
        'top',
        "Erreur lors de l'ajout de la photo"
      );
    } finally {
      await loading.dismiss();
    }
  }

  async checkCameraPermission() {
    try {
      const status = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });

      if (status.state === 'granted') {
        // Permission déjà accordée
        return true;
      } else if (status.state === 'prompt') {
        // Permission non encore demandée, déclenchement de la demande
        return await this.requestCameraAccess();
      } else {
        // Permission refusée
        console.warn('Permission caméra refusée');
        return false;
      }
    } catch (err) {
      console.error(
        'Erreur lors de la vérification de la permission de la caméra :',
        err
      );
      return false;
    }
  }

  async requestCameraAccess() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      console.log('Photo capturée', photo);
      return true;
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra :", err);
      return false;
    }
  }

  removePhoto(index: number) {
    this.photoService.removePhoto(index);
  }

  async getCurrentLocation() {
    this.signalementForm.controls['address'].setValue('');
    const position = await this.locationService.getCurrentPosition();

    if (position) {
      console.log('this is my position : ', position);
      this.signalementPosition.set({
        lat: position.latitude,
        lng: position.longitude,
      });

      const addressSubscription = this.mapboxService
        .getAdresseFromCoords(position.latitude, position.longitude)
        .subscribe({
          next: (response) => {
            const placeName = response.features[0]?.place_name;
            console.log(placeName, 'as place name');
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

  async search(event: any) {
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

  async onSelect(address: string) {
    this.signalementForm.controls['address'].setValue(address);
    this.mapboxService.address = [];

    const position = await this.locationService.getCurrentPosition();
    if (position) {
      console.log('this is my position : ', position);
      this.signalementPosition.set({
        lat: position.latitude,
        lng: position.longitude,
      });
    }
  }

  async onFormSubmit() {
    this.formSubmitted = true;
    if (this.signalementForm.invalid) {
      return;
    }

    const newSignalement: Signalemenent = {
      id: '',
      title: this.signalementForm.value.title!,
      location: this.signalementForm.value.address!,
      date: new Date().toISOString(),
      images: this.signalementForm.value.photos!,

      content: this.signalementForm.value.content!,
      coordinates: this.signalementPosition(),
      category: this.signalementForm.value.selectedType!,
      recipient: this.selectedDestinataires(),
      status: 'En cours',
      resolutionComment: '',
      confirmedByUsers: [],
      userId: this.signalementsService.userId(),
    };
    console.log('this is my signalement location', newSignalement);
    try {
      await this.signalementsService.addSignalement(newSignalement);
      await this.signalementsService.loadSignalements();
      this.toasService.presentToast('top', 'Signalement ajouté avec succès');
      console.log('Signalement ajouté avec succès');
      this.router.navigate(['/signalements/liste']);
    } catch (error) {
      console.error("Erreur lors de l'ajout du signalement:", error);
      this.toasService.presentToast(
        'top',
        "Erreur lors de l'ajout du signalement"
      );
    }

    this.signalementForm.reset();
    this.selectedDestinataires.set([]);
    this.destinatairesSelections = 'aucun';
    this.photoService.photos = [];
  }
  get photosAreInvalid() {
    return this.formSubmitted && this.photos.controls.length === 0;
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Chargement...',
    });
    await loading.present();
    return loading;
  }
}
