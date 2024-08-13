import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { isPlatform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  async getCurrentPosition(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    try {
      if (isPlatform('hybrid')) {
        let permissions = await Geolocation.checkPermissions();

        if (permissions.location !== 'granted') {
          permissions = await Geolocation.requestPermissions();
        }
        if (permissions.location === 'granted') {
          const coordinates = await Geolocation.getCurrentPosition();
          return {
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
          };
        } else {
          console.log('Location permission not granted');
          return null;
        }
      } else {
        return this.getCurrentPositionWeb();
      }
    } catch (e) {
      console.error('Error getting location', e);
      return null; // Retourner null en cas d'erreur
    }
  }

  getCurrentPositionWeb(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location', error);
            reject(null); // Rejeter la promesse en cas d'erreur
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        reject(null); // Rejeter la promesse si la géolocalisation n'est pas supportée
      }
    });
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
