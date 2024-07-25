import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { categories } from './dummy_categories';
import { PhotoService } from 'src/app/services/photo.service';
import { CommonModule } from '@angular/common';
import { LocationService } from 'src/app/services/location.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

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
  ],
})
export class SignalerComponent {
  constructor() {
    addIcons({ closeCircle, camera, send, locateOutline, pin });
  }
  signalementsService = inject(SignalementsService);

  public photoService = inject(PhotoService);
  public locationService = inject(LocationService);
  public mapboxService = inject(MapboxService);

  @ViewChild('modal', { static: true }) modal!: IonModal;
  categories: Categorie[] = categories;
  destinatairesSelections = 'aucun';
  selectedDestinataires: string[] = [];

  get Alladresses() {
    return this.mapboxService.address;
  }
  entredTitle = '';
  content = '';
  selectedAdresse = signal<string>('');
  comportement = '';
  selectedType = '';
  signalementPosition = {
    lat: 0,
    lng: 0,
  };

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
    this.selectedDestinataires = categories;
    this.destinatairesSelections = this.formatData(this.selectedDestinataires)!;
    this.modal.dismiss();
  }

  async addPhoto() {
    this.photoService.addNewToGallery();
  }
  removePhoto(index: number) {
    this.photoService.removePhoto(index);
  }

  async getCurrentLocation() {
    this.selectedAdresse.update((prev) => '');
    const position = await this.locationService.getCurrentPosition();
    if (position) {
      this.signalementPosition.lat = position.latitude;
      this.signalementPosition.lng = position.longitude;
      console.log('user position is', position);

      this.mapboxService
        .getAdresseFromCoords(position.latitude, position.longitude)
        .subscribe({
          next: (response) => {
            const placeName = response.features[0]?.place_name;
            this.selectedAdresse.update((prev) => placeName);
          },
          error: (err) => {
            console.error("Erreur lors de la récupération de l'adresse:", err);
          },
        });
    }
  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService.search_word(searchTerm).subscribe({
        next: (features) => {
          this.mapboxService.address = features.map((feat) => feat.place_name);
        },
      });
    } else {
      this.mapboxService.address = [];
    }
  }

  onSelect(address: string) {
    this.selectedAdresse.update((prev) => address);
    this.mapboxService.address = [];
  }

  async onFormSubmit() {
    // Générer un nouvel ID unique
    const uniqueId = `id_${new Date().getTime()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const singleSignalement = {
      id: uniqueId,
      title: this.entredTitle,
      location: this.selectedAdresse(),
      date: new Date().toISOString(),
      status: 'En cours',
      images: this.photoService.photos
        .map((photo) => photo.webviewPath)
        .filter((path): path is string => path !== undefined), // Utilisez les URLs des photos téléchargées
      content: this.content,
      coordinates: this.signalementPosition,
      category: this.selectedType,
      confirmations: 0,
      resolutionComment: '',
      recipient: this.selectedDestinataires,
    };

    console.log(singleSignalement);

    // Ajouter le signalement à Firestore
    // const signalementsCollection = this.firestore.collection('signalements');
    // await signalementsCollection.add(singleSignalement);
  }
}
