import {
  AfterViewInit,
  Component,
  OnInit,
  inject,
  signal,
  computed,
  Provider,
} from '@angular/core';
import {
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonContent,
  IonSelectOption,
  IonSelect,
  IonHeader,
  IonButton,
  IonModal,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import { LocationService } from 'src/app/services/location.service';
import { SignalementsService } from 'src/app/services/signalements.service';
import { Signalemenent } from '../signalement.model';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss'],
  standalone: true,
  imports: [
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCard,
    IonModal,
    IonButton,
    IonHeader,
    IonContent,
    IonLabel,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonSelectOption,
    IonSelect,
    DatePipe,
    RouterLink,
  ],
  providers: [ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarteComponent implements OnInit, AfterViewInit {
  locationService = inject(LocationService);
  signalementsService = inject(SignalementsService);
  selectedFilter = signal('all');
  selectedSignalement = signal<Signalemenent | null>(null); // Pour stocker le signalement sélectionné
  private modalController = inject(ModalController);
  private router = inject(Router);
  allSignalements = this.signalementsService.signalementsSignal;
  map!: mapboxgl.Map;

  markers: mapboxgl.Marker[] = [];

  filteredSignalements = computed(() => {
    const filter = this.selectedFilter();
    const signalements = this.allSignalements() || [];
    const position = this.map?.getCenter();

    if (!position) return [];

    const filteredByStatus = signalements.filter((signalement) => {
      if (filter === 'inProgress') {
        return signalement.status === 'En cours';
      } else if (filter === 'resolved') {
        return signalement.status === 'Résolu';
      }
      return true;
    });

    return filteredByStatus.filter((signalement) => {
      if (!signalement.coordinates) return false;

      const distance = this.locationService.calculateDistance(
        position.lat,
        position.lng,
        signalement.coordinates.lat,
        signalement.coordinates.lng
      );

      return distance <= 30;
    });
  });

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

        try {
          const signalementsData =
            await this.signalementsService.loadSignalements();
          if (signalementsData) {
            this.signalementsService.signalementsSignal.set(signalementsData);
            this.displaySignalements();
          } else {
            console.log('No signalements available');
          }
        } catch (error) {
          console.error('Error loading signalements:', error);
        }
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

  onChangeSignalementsFilter(filter: string) {
    this.selectedFilter.set(filter);
    this.displaySignalements();
  }

  displaySignalements() {
    this.clearMarkers();

    const filtered = this.filteredSignalements();
    filtered.forEach((signalement: Signalemenent) => {
      if (signalement.coordinates) {
        const el = document.createElement('div');
        el.className = 'custom-marker';

        const markerContainer = document.createElement('div');
        markerContainer.style.display = 'flex';
        markerContainer.style.flexDirection = 'column';
        markerContainer.style.alignItems = 'center';
        markerContainer.style.marginTop = '10px';

        const img = document.createElement('img');
        img.src = signalement.images[0];
        img.style.width = '40px';
        img.style.height = '40px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        markerContainer.appendChild(img);

        const label = document.createElement('div');
        label.innerText = signalement.title.slice(0, 10) || 'Signalement';

        label.style.textAlign = 'center';
        label.style.marginTop = '8px';
        label.style.padding = '5px 10px';
        label.style.backgroundColor = '#007BFF';
        label.style.color = '#FFFFFF';
        label.style.borderRadius = '8px';
        label.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        label.style.fontSize = '14px';
        label.style.fontWeight = 'bold';
        label.style.display = 'inline-block';

        markerContainer.appendChild(label);

        el.appendChild(markerContainer);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([signalement.coordinates.lng, signalement.coordinates.lat])
          .addTo(this.map);

        marker.getElement().addEventListener('click', () => {
          this.selectedSignalement.set(signalement);
          const modalTrigger = document.getElementById('open-modal');
          if (modalTrigger) {
            modalTrigger.click();
          }
        });

        this.markers.push(marker);
      }
    });
  }

  clearMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }

  async closeAndRedirect() {
    // Fermer le modal
    await this.modalController.dismiss();

    // Rediriger vers la page du signalement sélectionné
    const selectedId = this.selectedSignalement()?.id;
    if (selectedId) {
      this.router.navigate(['/signalements/', selectedId]);
    }
  }

  ngOnInit(): void {}
}
