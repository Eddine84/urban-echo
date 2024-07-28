export type SignalStatus = 'En cours' | 'Résolu';

export interface Signalemenent {
  id: string;
  userId: string;
  title: string;
  location: string;
  date: string;
  status: SignalStatus;
  images: string[];
  content: string;
  coordinates: { lat: number; lng: number };
  category: string;
  confirmations: number;
  confirmedByUsers: string[];
  resolutionComment: string;
  recipient: string[];
}
