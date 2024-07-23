import {
  Component,
  NgModule,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { categories } from './dummy_categories';
import { PhotoService } from 'src/app/services/photo.service';
import { CommonModule } from '@angular/common';
import { LocationService } from 'src/app/services/location.service';
import { HttpClient } from '@angular/common/http';

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

  public photoService = inject(PhotoService);
  public locationService = inject(LocationService);
  public mapboxService = inject(MapboxService);

  @ViewChild('modal', { static: true }) modal!: IonModal;
  categories: Categorie[] = categories;
  destinatairesSelections = 'aucun';
  selectedDestinataires: string[] = [];

  entredTitle = '';
  content = '';

  get Alladresses() {
    return this.mapboxService.address;
  }
  selectedAdresse = signal<string>('');
  comportement = '';
  selectedType = '';
  entrePhotos = [];

  private formatData(data: string[]) {
    if (data.length === 1) {
      const categorie = this.categories.find(
        (categorie) => categorie.value === data[0]
      );
      return categorie?.text;
    }

    return `${data.length} destinataires`;
  }

  fruitSelectionChanged(categories: string[]) {
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

  onFormSubmit() {
    console.log('1', this.entredTitle);
    console.log('2', this.content);
    console.log('3', this.selectedType);
    console.log('4', this.selectedDestinataires);
    console.log('5', this.photoService.photos);
    console.log('6', this.selectedAdresse());
  }
}
