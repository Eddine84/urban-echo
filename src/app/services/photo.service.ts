import { Injectable } from '@angular/core';
import {
  getStorage, // Fonction pour obtenir une référence à Firebase Storage
  ref, // Fonction pour obtenir une référence de stockage à un chemin spécifique
  uploadString, // Fonction pour uploader une chaîne de caractères
  getDownloadURL, // Fonction pour obtenir l'URL de téléchargement d'un fichier
} from '@angular/fire/storage';
import {
  Camera, // Capacitor Camera API
  CameraResultType, // Enum pour spécifier le type de résultat de la caméra
  CameraSource, // Enum pour spécifier la source de la caméra (caméra ou galerie)
  Photo, // Interface pour le type de photo retourné par la caméra
} from '@capacitor/camera';

@Injectable({
  providedIn: 'root', // Fournit ce service à l'ensemble de l'application
})
export class PhotoService {
  public photos: UserPhoto[] = []; // Tableau pour stocker les photos de l'utilisateur

  // Méthode pour ajouter une nouvelle photo à la galerie
  public async addNewToGallery(): Promise<UserPhoto> {
    // Prendre une photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // Obtenir la photo en tant qu'URI
      source: CameraSource.Camera, // Utiliser la caméra pour capturer la photo
      quality: 100, // Qualité maximale de la photo
    });

    // Sauvegarder l'image et obtenir les informations sur l'image sauvegardée
    const savedImageFile = await this.savePicture(capturedPhoto);
    // Ajouter la nouvelle photo au début du tableau des photos
    this.photos.unshift(savedImageFile);
    return savedImageFile; // Retourner la photo ajoutée
  }

  // Méthode pour sauvegarder une photo
  private async savePicture(cameraPhoto: Photo): Promise<UserPhoto> {
    // Convertir la photo en base64, requis par Firebase Storage
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Créer une référence à l'emplacement du bucket Firebase Storage
    const storage = getStorage();
    const fileName = `${new Date().getTime()}.jpeg`; // Générer un nom de fichier unique
    const storageRef = ref(storage, `photos/${fileName}`); // Référence de stockage

    // Uploader le fichier et les métadonnées
    const snapshot = await uploadString(storageRef, base64Data, 'data_url');

    // Obtenir l'URL de téléchargement
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // Retourner les informations sur la photo sauvegardée
    return {
      filepath: storageRef.fullPath, // Chemin complet du fichier dans le stockage
      webviewPath: downloadUrl, // URL de téléchargement
    };
  }

  // Méthode pour lire une photo en tant que base64
  private async readAsBase64(cameraPhoto: Photo): Promise<string> {
    // Récupérer la photo, la lire en tant que blob, puis la convertir en base64
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    // Convertir le blob en base64
    return (await this.convertBlobToBase64(blob)) as string;
  }

  // Méthode pour convertir un blob en base64
  private convertBlobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader(); // Créer un lecteur de fichiers
      reader.onerror = reject; // Rejeter la promesse en cas d'erreur
      reader.onload = () => {
        resolve(reader.result as string); // Résoudre la promesse avec le résultat en base64
      };
      reader.readAsDataURL(blob); // Lire le blob en tant qu'URL de données
    });

  // Méthode pour retirer une photo du tableau des photos
  removePhoto(index: number) {
    if (index > -1) {
      this.photos.splice(index, 1); // Retirer une photo à l'index spécifié
    }
  }
}

// Interface pour représenter une photo de l'utilisateur
export interface UserPhoto {
  filepath: string; // Chemin du fichier dans le stockage
  webviewPath?: string; // URL de téléchargement
}
