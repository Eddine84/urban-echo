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
        // Pour les appareils mobiles (iOS et Android)
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
          return null; // Retourner null si la permission n'est pas accordée
        }
      } else {
        // Pour le web
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
}
