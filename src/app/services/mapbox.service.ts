import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
export interface MaxboxOutput {
  attribution: string;
  features: Feature[];
  query: [];
}
export interface Feature {
  place_name: string;
}

export interface Cordinates {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  public address: string[] = [];

  private mapboxToken =
    'pk.eyJ1IjoiZHpmdWxsc3RhY2tkZXYiLCJhIjoiY2x6b21oYmtxMHlpbjJrcXdxZzQ3ZW9meSJ9.tLI1_4tHGZbLMdLtyopXdw';

  private http = inject(HttpClient);

  search_word(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http
      .get(
        url +
          query +
          '.json?types=address&access_token=' +
          environment.mapbox.accessToken
      )
      .pipe(
        map((res: Object) => {
          const maxboxOutput = res as MaxboxOutput;
          return maxboxOutput.features;
        })
      );
  }

  getAdresseFromCoords(lat: number, lng: number): Observable<any> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=address&access_token=${environment.mapbox.accessToken}`;
    return this.http.get(url).pipe(map((response) => response));
  }
}
