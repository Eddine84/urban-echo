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
import { Signalemenent } from '../signalement.model';

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

  // Ajouter une propriété pour stocker les marqueurs
  markers: mapboxgl.Marker[] = [];

  // Filtrer les signalements en fonction du statut
  filteredSignalements = computed(() => {
    const filter = this.selectedFilter();
    const signalements = this.allSignalements() || [];

    console.log('Filtre sélectionné:', filter);
    console.log('Tous les signalements:', signalements);

    switch (filter) {
      case 'inProgress':
        return signalements.filter(
          (signalement: Signalemenent) => signalement.status === 'En cours'
        );
      case 'resolved':
        return signalements.filter(
          (signalement: Signalemenent) => signalement.status === 'Résolu'
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
          next: (signalements: Signalemenent[]) => {
            console.log('Signalements chargés:', signalements);
            this.signalementsService.signalementsSignal.set(signalements);
            this.displaySignalements();
          },
          error: (err: any) => {
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
    console.log('Changement de filtre:', filter);
    this.selectedFilter.set(filter);
    this.displaySignalements();
  }

  displaySignalements() {
    // Supprimez les anciens marqueurs
    this.clearMarkers();

    const filtered = this.filteredSignalements();
    console.log('Signalements filtrés:', filtered);

    filtered.forEach((signalement: Signalemenent) => {
      if (signalement.coordinates) {
        const marker = new mapboxgl.Marker({ color: '#0000ff' })
          .setLngLat([signalement.coordinates.lng, signalement.coordinates.lat])
          .addTo(this.map);

        // Ajoutez chaque marqueur à la liste des marqueurs
        this.markers.push(marker);
      }
    });
  }

  clearMarkers() {
    console.log('Nettoyage des anciens marqueurs');
    // Supprimer chaque marqueur de la carte
    this.markers.forEach((marker) => marker.remove());
    // Réinitialiser le tableau des marqueurs
    this.markers = [];
  }

  ngOnInit(): void {}
}
