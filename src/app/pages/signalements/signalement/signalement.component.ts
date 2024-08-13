import {
  Component,
  OnInit,
  input,
  Input,
  inject,
  computed,
  effect,
  signal,
  DestroyRef,
  AfterViewInit,
} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { type Signalemenent } from '../signalement.model';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { Location } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import {
  closeCircle,
  camera,
  send,
  locateOutline,
  add,
  pin,
  checkmarkCircle,
  trashOutline,
  checkmarkDoneOutline,
} from 'ionicons/icons';

import {
  IonAccordionGroup,
  IonAccordion,
  IonLabel,
  IonItem,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonCardSubtitle,
} from '@ionic/angular/standalone';
import { SignalementsService } from 'src/app/services/signalements.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-signalement',
  templateUrl: './signalement.component.html',
  styleUrls: ['./signalement.component.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonItem,
    IonLabel,
    IonAccordion,
    IonAccordionGroup,
    RouterLink,
    DatePipe,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignalementComponent implements OnInit, AfterViewInit {
  constructor() {
    addIcons({
      closeCircle,
      camera,
      send,
      locateOutline,
      pin,
      checkmarkCircle,
      add,
      trashOutline,
      checkmarkDoneOutline,
    });
  }
  router = inject(Router);
  private locationService = inject(LocationService);
  toastService = inject(ToastService);
  destroyRef = inject(DestroyRef);
  signalementsService = inject(SignalementsService);
  selectedSignalementId = input<string>();
  singleSignalement = signal<Signalemenent | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  showConfimBtn = signal(true);
  userId = this.signalementsService.userId();
  private location = inject(Location);
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];

  signalement = computed(() => this.singleSignalement());

  async confirmSignalement() {
    try {
      await this.signalementsService.addConfirmation(
        this.selectedSignalementId()!,
        this.userId
      );
      console.log('Confirmation added successfully');
    } catch (error) {
      console.error('Error adding confirmation:', error);
    }
  }

  async removeSignalement() {
    try {
      await this.signalementsService.deleteSignalement(
        this.selectedSignalementId()!,
        this.signalement()?.recipient!
      );
      await this.signalementsService.loadSignalements();
      this.router.navigate(['/signalements/liste']);
    } catch (error) {
      this.toastService.presentToast(
        'top',
        'seulement les diestinarie sont autorisé a cloturer cette annonce'
      );

      console.error('Erreur lors de la suppression du signalement:', error);
    }
  }

  async updateSignalementStatus() {
    try {
      await this.signalementsService.updateSignalementStatus(
        this.selectedSignalementId()!,
        this.signalement()?.recipient!
      );
      this.toastService.presentToast(
        'top',
        'le signalement a été marqué comme resolut'
      );
    } catch (error) {
      console.log(error);
      this.toastService.presentToast(
        'top',
        'seulement les diestinarie sont autorisé a changer le statut  cette annonce'
      );
    }
  }

  public actionSheetButtonsUpdate = [
    {
      text: 'Update',

      handler: () => {
        this.updateSignalementStatus();
      },
    },

    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  public actionSheetButtonsRemove = [
    {
      text: 'Remove',
      handler: () => {
        this.removeSignalement();
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  ngOnInit() {
    this.isFetching.set(true);
    const signalementSubsciption = this.signalementsService
      .getSignalementById(this.selectedSignalementId()!)
      .subscribe({
        next: (data) => {
          this.singleSignalement.set(data);
          this.isFetching.set(false);
          if (data?.confirmedByUsers.includes(this.userId)) {
            this.showConfimBtn.set(false);
          }
        },
        error: (error) => {
          console.log(error);
          this.error.set('chargement du signalement en cours...');
        },
      });
    this.destroyRef.onDestroy(() => {
      signalementSubsciption.unsubscribe();
    });
  }
  goBack() {
    // Obtenir l'URL précédente
    const previousUrl = document.referrer;

    // Si l'utilisateur vient de 'http://localhost:4200/signalements/carte'
    if (previousUrl.includes('signalements/carte')) {
      window.location.href = 'http://localhost:4200/signalements/carte';
    } else {
      // Sinon, revenir en arrière dans l'historique de navigation
      this.location.back();
    }
  }

  async ngAfterViewInit() {
    (mapboxgl as typeof mapboxgl).accessToken =
      'pk.eyJ1IjoiZHpmdWxsc3RhY2tkZXYiLCJhIjoiY2x2eWJkejkzMjVodTJrbnlvaGs2c2Y0ZyJ9.IVAMRDDapDnAT7KWCYk4mA';

    const position = await this.locationService.getCurrentPosition();

    if (position) {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [position.longitude, position.latitude],
        zoom: 10,
      });

      this.map.on('load', async () => {
        this.map.addSource('user-location', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [position.longitude, position.latitude],
            },
            properties: {},
          },
        });

        this.map.addLayer({
          id: 'user-location-circle',
          type: 'circle',
          source: 'user-location',
          paint: {
            'circle-radius': 10,
            'circle-color': '#ff0000',
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
          },
        });

        this.map.flyTo({
          center: [position.longitude, position.latitude],
          zoom: 14,
          speed: 1.5,
          curve: 1,
          easing: (t) => t,
        });
      });
    } else {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40],
        zoom: 10,
      });
    }
  }
}
