export interface Signalemenent {
  id: string;
  title: string;
  location: string;
  date: string;
  status: string;
  images: string[];
  content: string;
  coordinates: { lat: number; lng: number };
  category: string;
  confirmations: number;
  resolutionComment: string;
  recipient: string[];
}
