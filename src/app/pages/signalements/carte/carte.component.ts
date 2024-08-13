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
        // Create a custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';

        // Create a container for the marker image and label
        const markerContainer = document.createElement('div');
        markerContainer.style.display = 'flex';
        markerContainer.style.flexDirection = 'column';
        markerContainer.style.alignItems = 'center'; // Center the image and label horizontally
        markerContainer.style.marginTop = '10px'; // Add some margin at the top if needed

        // Add an image or icon
        const img = document.createElement('img');
        img.src = signalement.images[0]; // Replace with the path to your image/icon
        img.style.width = '40px'; // Set the width of the image
        img.style.height = '40px'; // Set the height of the image
        img.style.borderRadius = '50%'; // Make the image circular
        img.style.objectFit = 'cover'; // Ensure the image is properly cropped
        markerContainer.appendChild(img);

        // Add a title or label
        const label = document.createElement('div');
        label.innerText = signalement.title || 'Signalement'; // Use the signalement's title

        // Apply advanced styling to the label
        label.style.textAlign = 'center'; // Center the text
        label.style.marginTop = '8px'; // Add margin to create space between the image and the label
        label.style.padding = '5px 10px'; // Add padding inside the label
        label.style.backgroundColor = '#007BFF'; // Set a background color (Bootstrap primary blue)
        label.style.color = '#FFFFFF'; // Set the text color to white
        label.style.borderRadius = '8px'; // Round the corners
        label.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; // Add a subtle shadow for depth
        label.style.fontSize = '14px'; // Adjust the font size
        label.style.fontWeight = 'bold'; // Make the text bold
        label.style.display = 'inline-block'; // Ensures the label is just as wide as its content

        // Add the label to the markerContainer
        markerContainer.appendChild(label);

        // Append the markerContainer to the marker element
        el.appendChild(markerContainer);

        // Create a new marker using the custom element
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([signalement.coordinates.lng, signalement.coordinates.lat])
          .addTo(this.map);

        // Add a click event listener to the marker
        marker.getElement().addEventListener('click', () => {
          this.selectedSignalement.set(signalement); // Store the selected signalement
          const modalTrigger = document.getElementById('open-modal');
          if (modalTrigger) {
            modalTrigger.click(); // Trigger the button to open the modal
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
