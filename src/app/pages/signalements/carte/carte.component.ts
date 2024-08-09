import {
  AfterViewInit,
  Component,
  OnInit,
  inject,
  signal,
  computed,
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
} from '@ionic/angular/standalone';
import mapboxgl from 'mapbox-gl';
import { LocationService } from 'src/app/services/location.service';
import { SignalementsService } from 'src/app/services/signalements.service';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonLabel,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonSelectOption,
    IonSelect,
  ],
})
export class CarteComponent implements OnInit, AfterViewInit {
  locationService = inject(LocationService);
  signalementsService = inject(SignalementsService);
  selectedFilter = signal('all');

  allSignalements = this.signalementsService.signalementsSignal;
  map!: mapboxgl.Map;

  // Filtrer les signalements en fonction du statut
  filteredSignalements = computed(() => {
    const filter = this.selectedFilter();
    const signalements = this.allSignalements() || [];

    console.log('Filtrage des signalements avec le filtre:', filter);

    switch (filter) {
      case 'inProgress':
        return signalements.filter(
          (signalement) => signalement.status === 'En cours'
        );
      case 'resolved':
        return signalements.filter(
          (signalement) => signalement.status === 'Résolu'
        );
      default:
        return signalements;
    }
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

      this.map.on('load', () => {
        // Ajouter un cercle pour la position de l'utilisateur
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

        this.signalementsService.loadSignalements().subscribe({
          next: (signalements) => {
            this.signalementsService.signalementsSignal.set(signalements);
            this.displaySignalements(this.filteredSignalements());
          },
          error: (err) => {
            console.error('Erreur lors du chargement des signalements:', err);
          },
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

  onChangeSignalementsFilter(filter: string) {
    this.selectedFilter.set(filter);
    this.displaySignalements(this.filteredSignalements());
  }

  displaySignalements(signalements: any[]) {
    // Supprimez les anciens marqueurs
    this.clearMarkers();

    signalements.forEach((signalement) => {
      if (signalement.coordinates) {
        const marker = new mapboxgl.Marker({ color: '#0000ff' })
          .setLngLat([signalement.coordinates.lng, signalement.coordinates.lat])
          .addTo(this.map);
      }
    });
  }

  clearMarkers() {
    // Logique pour supprimer les anciens marqueurs
    // Vous pouvez stocker les marqueurs dans un tableau et les supprimer ici
  }

  ngOnInit(): void {}
}
